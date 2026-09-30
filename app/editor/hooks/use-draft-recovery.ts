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
import type { TemplateItem, UserPreset } from "../templates/types";

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
  const stopController = useRef<(() => void) | undefined>(undefined);
  const templateInFlight = useRef(false);
  const pendingTemplateId = useRef<string | null>(null);
  const retryInFlight = useRef(false);
  const presetInFlight = useRef(false);
  const invalidRaw = useRef<unknown>(undefined);
  const [busy, setBusy] = useState(false);
  const lastTemplate = useRef<string | null>(null);
  const consumeTemplate = useCallback(() => {
    lastTemplate.current = new URLSearchParams(window.location.search).get("template");
    const params = new URLSearchParams(window.location.search);
    params.delete("template");
    router.replace(`/editor${params.size ? `?${params}` : ""}`);
  }, [router]);
  const attachController = (db: IDBDatabase, revision: string | null) => {
    stopController.current?.();
    const ctl = new DraftController(db, revision, (next, failure) => {
      setStatus(next); setError(failure);
      if (next === "error" || next === "conflict" || next === "invalid") toast.error(failure?.message ?? "Couldn’t save locally");
    });
    dbRef.current = db;
    controller.current = ctl;
    stopController.current = ctl.start();
    setStatus(ctl.status);
    return ctl;
  };
  useEffect(() => {
    const token = ++startupToken.current;
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
          if (record) { useStore.getState().replaceDocument(record.document); toast.success("Recovered local draft."); }
          else useStore.getState().replaceDocument(createDefaultDocument());
          attachController(db, record?.revision ?? null);
        }
        setReady(true);
      } catch {
        if (abandoned || token !== startupToken.current) return;
        dbRef.current?.close(); dbRef.current = null;
        setStatus("unavailable"); setReady(true);
      }
    };
    void initialize();
    return () => {
      abandoned = true; startupToken.current++;
      stopController.current?.(); stopController.current = undefined;
      dbRef.current?.close(); controller.current = null; dbRef.current = null;
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    if (!templateId) { lastTemplate.current = null; return; }
    if (templateId === lastTemplate.current || templateInFlight.current) return;
    // Leave the URL pending until the recovery problem is resolved.
    if (problem || status === "invalid" || status === "conflict" || status === "error") return;
    const template = BUILTIN_TEMPLATES.find((item) => item.id === templateId);
    if (!template) { toast.error("Template not found"); consumeTemplate(); return; }
    const defaults = createDefaultDocument();
    const document: CanvasDocument = { ...defaults, aspectRatio: template.aspectRatio || defaults.aspectRatio, elements: structuredClone(template.elements) };
    if (!isDefaultDocument(projectDocument(useStore.getState()))) {
      pendingTemplateId.current = templateId;
      setPendingTemplate(document); return;
    }
    const token = startupToken.current;
    templateInFlight.current = true;
    void (async () => {
      try {
        if (controller.current) { if (!await controller.current.replace(document)) return; }
        else if (status === "unavailable") useStore.getState().replaceDocument(document);
        else return;
        if (token === startupToken.current) consumeTemplate();
      } finally { templateInFlight.current = false; }
    })();
  }, [ready, templateId, consumeTemplate, status, problem]);
  const applyTemplate = async () => {
    if (!pendingTemplate || templateInFlight.current || problem || status === "conflict") return;
    const token = startupToken.current;
    const requestedId = pendingTemplateId.current;
    templateInFlight.current = true;
    try {
      if (controller.current) { if (!await controller.current.replace(pendingTemplate)) return; }
      else if (status === "unavailable") useStore.getState().replaceDocument(pendingTemplate);
      else return;
      if (token !== startupToken.current) return;
      setPendingTemplate(null);
      if (new URLSearchParams(window.location.search).get("template") === requestedId) consumeTemplate();
    } finally { templateInFlight.current = false; }
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
    if (retryInFlight.current) return;
    retryInFlight.current = true;
    const token = startupToken.current;
    let db: IDBDatabase | undefined;
    try {
      db = await openDraftDatabase();
      if (token !== startupToken.current) { db.close(); return; }
      const raw = await readDraft(db);
      if (token !== startupToken.current) { db.close(); return; }
      const decoded = raw === undefined ? null : decodeDraft(raw);
      dbRef.current = db;
      if (decoded && decoded.kind !== "valid") {
        invalidRaw.current = raw; setProblem(decoded.kind); setStatus("invalid"); return;
      }
      const record = decoded?.kind === "valid" ? decoded.record : null;
      const ctl = attachController(db, record?.revision ?? null);
      // The current canvas may contain edits made while storage was unavailable.
      // Require an explicit choice before either version is replaced.
      if (record) ctl.markConflict();
      else await ctl.replace(projectDocument(useStore.getState()));
    } catch {
      db?.close();
      if (token === startupToken.current) { dbRef.current = null; setStatus("unavailable"); }
    } finally { retryInFlight.current = false; }
  };
  const discard = async () => {
    if (!window.confirm("Discard the saved draft and use this canvas?")) return;
    const db = dbRef.current;
    if (!db) return;
    const raw = await readDraft(db);
    const revision = raw && typeof raw === "object" ? (raw as { revision?: unknown }).revision ?? null : null;
    if (revision !== null && typeof revision !== "string") { toast.error("Draft changed in another tab"); return; }
    const ctl = attachController(db, revision);
    if (await ctl.replace(projectDocument(useStore.getState()), revision, invalidRaw.current)) {
      setProblem(null); invalidRaw.current = undefined;
    }
  };
  const loadSaved = async () => {
    if (!window.confirm("Load the saved draft and discard this tab’s changes?")) return;
    const ctl = controller.current; const db = dbRef.current;
    if (!ctl || !db) return;
    const raw = await readDraft(db);
    const decoded = decodeDraft(raw);
    if (decoded.kind === "valid") {
      await ctl.adopt(decoded.record.document, decoded.record.revision);
      setProblem(null); invalidRaw.current = undefined;
    } else { invalidRaw.current = raw; setProblem(decoded.kind); setStatus("invalid"); }
  };
  const useThisCanvas = async () => {
    if (!window.confirm("Replace the saved draft with this canvas?")) return;
    const ctl = controller.current; const db = dbRef.current;
    if (!ctl || !db) return;
    const raw = await readDraft(db);
    const decoded = raw === undefined ? null : decodeDraft(raw);
    if (decoded && decoded.kind !== "valid") { invalidRaw.current = raw; setProblem(decoded.kind); setStatus("invalid"); return; }
    if (await ctl.replace(projectDocument(useStore.getState()), decoded?.kind === "valid" ? decoded.record.revision : null)) {
      setProblem(null); invalidRaw.current = undefined;
    }
  };
  const loadTemplateOrPreset = async (preset: TemplateItem | UserPreset) => {
    if (!ready || presetInFlight.current) return false;
    if (problem || status === "conflict" || status === "invalid") {
      toast.error("Resolve the saved draft problem before opening a template or preset.");
      return false;
    }
    const current = projectDocument(useStore.getState());
    if (!isDefaultDocument(current) && !window.confirm("Open this template or preset and replace your local recovery draft?")) return false;
    const isUserPreset = "createdAt" in preset;
    const document: CanvasDocument = structuredClone({
      ...current,
      aspectRatio: preset.aspectRatio || current.aspectRatio,
      elements: preset.elements,
      canvasBackground: isUserPreset ? preset.canvasBackground : current.canvasBackground,
      meshConfig: isUserPreset ? preset.meshConfig : current.meshConfig,
      overlayConfig: isUserPreset ? preset.overlayConfig : current.overlayConfig,
    });
    presetInFlight.current = true;
    setBusy(true);
    try {
      if (controller.current) return await controller.current.replace(document);
      if (status === "unavailable") { useStore.getState().replaceDocument(document); return true; }
      return false;
    } finally { presetInFlight.current = false; setBusy(false); }
  };
  return { ready, busy, status, error, problem, pendingTemplate, applyTemplate, cancelTemplate, newCanvas, retry, discard, loadSaved, useThisCanvas, loadTemplateOrPreset };
}
