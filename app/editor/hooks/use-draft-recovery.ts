"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createDefaultDocument, useStore } from "../store/use-store";
import { BUILTIN_TEMPLATES } from "../templates/presets-data";
import { decodeDraft, isDefaultDocument, projectDocument } from "../recovery/draft-schema";
import { openDraftDatabase, readDraft } from "../recovery/draft-storage";
import { DraftController, type RecoveryStatus } from "../recovery/draft-controller";
import type { CanvasDocument } from "../types";

type Problem = "corrupt" | "unsupported" | null;
export function useDraftRecovery() {
  const router = useRouter();
  const search = useSearchParams();
  const templateId = search.get("template");
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<RecoveryStatus>("idle");
  const [error, setError] = useState<Error>();
  const [problem, setProblem] = useState<Problem>(null);
  const [pendingTemplate, setPendingTemplate] = useState<CanvasDocument | null>(null);
  const controller = useRef<DraftController | null>(null);
  const dbRef = useRef<IDBDatabase | null>(null);
  const startupToken = useRef(0);
  const invalidRaw = useRef<unknown>(undefined);
  const [busy, setBusy] = useState(false);
  const lastTemplate = useRef<string | null>(null);
  const consumeTemplate = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    params.delete("template");
    router.replace(`/editor${params.size ? `?${params}` : ""}`);
  }, [router]);
  useEffect(() => {
    const token = ++startupToken.current;
    let cleanup: (() => void) | undefined;
    let abandoned = false;
    const initialize = async () => {
      try {
        const db = await openDraftDatabase();
        if (abandoned || token !== startupToken.current) { db.close(); return; }
        dbRef.current = db;
        const raw = await readDraft(db);
        if (abandoned || token !== startupToken.current) return;
        const decoded = raw === undefined ? null : decodeDraft(raw);
        if (decoded && decoded.kind !== "valid") {
          invalidRaw.current = raw;
          setProblem(decoded.kind);
          setStatus("invalid");
        } else {
          const record = decoded?.kind === "valid" ? decoded.record : null;
          const draft = record?.document;
          if (draft) { useStore.getState().replaceDocument(draft); toast.success("Recovered local draft."); }
          else useStore.getState().replaceDocument(createDefaultDocument());
          const ctl = new DraftController(db, record?.revision ?? null, (next, failure) => {
            setStatus(next); setError(failure);
            if (next === "error" || next === "conflict" || next === "invalid") toast.error(failure?.message ?? "Couldn’t save locally");
          });
          controller.current = ctl;
          const initialTemplateId = new URLSearchParams(window.location.search).get("template");
          if (initialTemplateId) {
            lastTemplate.current = initialTemplateId;
            const template = BUILTIN_TEMPLATES.find((item) => item.id === initialTemplateId);
            if (!template) { toast.error("Template not found"); consumeTemplate(); }
            else {
              const defaults = createDefaultDocument();
              const templateDocument: CanvasDocument = { ...defaults, aspectRatio: template.aspectRatio || defaults.aspectRatio, elements: structuredClone(template.elements) };
              if (draft && !isDefaultDocument(draft)) setPendingTemplate(templateDocument);
              else {
                if (await ctl.replace(templateDocument)) consumeTemplate();
                if (abandoned || token !== startupToken.current) return;
              }
            }
          }
          setStatus(ctl.status);
          cleanup = ctl.start();
        }
        setReady(true);
      } catch {
        if (abandoned || token !== startupToken.current) return;
        dbRef.current?.close(); dbRef.current = null;
        setStatus("unavailable"); setReady(true);
      }
    };
    void initialize();
    return () => { abandoned = true; startupToken.current++; cleanup?.(); dbRef.current?.close(); controller.current = null; dbRef.current = null; };
  }, []);
  useEffect(() => {
    if (!ready) return;
    if (!templateId) { lastTemplate.current = null; return; }
    if (templateId === lastTemplate.current) return;
    lastTemplate.current = templateId;
    const template = BUILTIN_TEMPLATES.find((item) => item.id === templateId);
    if (!template) { toast.error("Template not found"); consumeTemplate(); return; }
    const defaults = createDefaultDocument();
    const document: CanvasDocument = { ...defaults, aspectRatio: template.aspectRatio || defaults.aspectRatio, elements: structuredClone(template.elements) };
    if (!isDefaultDocument(projectDocument(useStore.getState()))) { setPendingTemplate(document); return; }
    void (async () => {
      if (controller.current) { if (!await controller.current.replace(document)) return; }
      else if (status === "unavailable") useStore.getState().replaceDocument(document);
      else return;
      consumeTemplate();
    })();
  }, [ready, templateId, consumeTemplate, status]);
  const applyTemplate = async () => {
    if (!pendingTemplate) return;
    if (controller.current) { if (!await controller.current.replace(pendingTemplate)) return; }
    else useStore.getState().replaceDocument(pendingTemplate);
    setPendingTemplate(null); consumeTemplate();
  };
  const cancelTemplate = () => { setPendingTemplate(null); consumeTemplate(); };
  const newCanvas = async () => {
    const current = projectDocument(useStore.getState());
    const message = status === "unavailable"
      ? "Start a new canvas? Local recovery is unavailable, so this cannot clear a previous saved draft. Named presets will stay saved."
      : "Start a new canvas? This replaces your local recovery draft. Named presets will stay saved.";
    if (!isDefaultDocument(current) && !window.confirm(message)) return;
    const defaults = createDefaultDocument();
    setBusy(true);
    try {
      if (controller.current) { if (!await controller.current.replace(defaults)) return; }
      else if (status === "unavailable") useStore.getState().replaceDocument(defaults);
      else return;
      consumeTemplate();
    } finally { setBusy(false); }
  };
  const retry = async () => {
    if (controller.current) { await controller.current.retry(); return; }
    try {
      const db = await openDraftDatabase();
      const raw = await readDraft(db);
      const decoded = raw === undefined ? null : decodeDraft(raw);
      if (decoded && decoded.kind !== "valid") { setProblem(decoded.kind); setStatus("invalid"); db.close(); return; }
      const ctl = new DraftController(db, decoded?.kind === "valid" ? decoded.record.revision : null, (next, failure) => { setStatus(next); setError(failure); });
      dbRef.current = db; controller.current = ctl; ctl.start();
      setStatus("pending");
      await ctl.replace(projectDocument(useStore.getState()));
    } catch { setStatus("unavailable"); }
  };
  const discard = async () => {
    if (!window.confirm("Discard the saved draft and use this canvas?")) return;
    const db = dbRef.current;
    if (!db) return;
    const raw = await readDraft(db);
    const revision = raw && typeof raw === "object" ? (raw as { revision?: unknown }).revision : null;
    if (revision !== null && typeof revision !== "string") { toast.error("Draft changed in another tab"); return; }
    const ctl = new DraftController(db, revision, (next, failure) => { setStatus(next); setError(failure); });
    if (await ctl.replace(projectDocument(useStore.getState()), revision, invalidRaw.current)) { setProblem(null); invalidRaw.current = undefined; controller.current = ctl; ctl.start(); }
  };
  const loadSaved = async () => {
    if (!window.confirm("Load the saved draft and discard this tab’s changes?")) return;
    const ctl = controller.current; const db = dbRef.current;
    if (!ctl || !db) return;
    const decoded = decodeDraft(await readDraft(db));
    if (decoded.kind === "valid") await ctl.adopt(decoded.record.document, decoded.record.revision);
    else { setProblem(decoded.kind); setStatus("invalid"); }
  };
  const useThisCanvas = async () => {
    if (!window.confirm("Replace the saved draft with this canvas?")) return;
    const ctl = controller.current; const db = dbRef.current;
    if (!ctl || !db) return;
    const raw = await readDraft(db);
    const decoded = raw === undefined ? null : decodeDraft(raw);
    if (decoded && decoded.kind !== "valid") { setProblem(decoded.kind); setStatus("invalid"); return; }
    await ctl.replace(projectDocument(useStore.getState()), decoded?.kind === "valid" ? decoded.record.revision : null);
  };
  return { ready, busy, status, error, problem, pendingTemplate, applyTemplate, cancelTemplate, newCanvas, retry, discard, loadSaved, useThisCanvas };
}
