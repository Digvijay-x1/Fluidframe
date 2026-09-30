// @vitest-environment jsdom
import "fake-indexeddb/auto";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useDraftRecovery } from "./use-draft-recovery";
import { createDefaultDocument, useStore } from "../store/use-store";
import { BUILTIN_TEMPLATES } from "../templates/presets-data";
import * as storage from "../recovery/draft-storage";

const navigation = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock("next/navigation", () => ({
  useRouter: () => navigation,
  useSearchParams: () => new URLSearchParams(window.location.search),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("../recovery/draft-storage", async (importOriginal) => {
  const actual = await importOriginal<typeof storage>();
  return { ...actual, openDraftDatabase: vi.fn(actual.openDraftDatabase) };
});

let root: Root | undefined;
let recovery: ReturnType<typeof useDraftRecovery>;
let db: IDBDatabase;
function Harness() { recovery = useDraftRecovery(); return null; }
const settle = () => act(async () => { await new Promise((resolve) => setTimeout(resolve, 20)); });
async function mount() {
  root = createRoot(document.createElement("div"));
  await act(async () => { root!.render(<Harness />); });
  await vi.waitFor(async () => { await settle(); expect(recovery.ready).toBe(true); });
}
async function seed(raw: unknown) {
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("drafts", "readwrite");
    tx.objectStore("drafts").put(raw, "current");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

beforeEach(async () => {
  vi.clearAllMocks();
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  window.history.replaceState(null, "", "/editor");
  vi.spyOn(window, "confirm").mockReturnValue(true);
  useStore.getState().replaceDocument(createDefaultDocument());
  await new Promise<void>((resolve) => {
    const request = indexedDB.deleteDatabase("fluidframe-recovery");
    request.onsuccess = () => resolve();
  });
  db = await storage.openDraftDatabase();
});
afterEach(async () => {
  if (root) await act(async () => root!.unmount());
  root = undefined;
  db.close();
  vi.restoreAllMocks(); vi.unstubAllGlobals();
});

it("preserves both canvases after unavailable startup until the user loads the saved draft", async () => {
  const saved = await storage.writeDraft(db, null, { ...createDefaultDocument(), canvasBackground: "#112233" });
  vi.mocked(storage.openDraftDatabase).mockRejectedValueOnce(new storage.DraftUnavailableError());
  await mount();
  expect(recovery.status).toBe("unavailable");
  useStore.getState().setBackground("#445566");
  await act(async () => recovery.retry());
  expect(recovery.status).toBe("conflict");
  expect(await storage.readDraft(db)).toEqual(saved);
  expect(useStore.getState().canvasBackground).toBe("#445566");
  await act(async () => recovery.loadSaved());
  expect(recovery.status).toBe("saved");
  expect(useStore.getState().canvasBackground).toBe("#112233");
  expect(await storage.readDraft(db)).toEqual(saved);
});

it("writes the current canvas only after an explicit conflict choice on retry", async () => {
  await storage.writeDraft(db, null, { ...createDefaultDocument(), canvasBackground: "#112233" });
  vi.mocked(storage.openDraftDatabase).mockRejectedValueOnce(new storage.DraftUnavailableError());
  await mount();
  useStore.getState().setBackground("#445566");
  await act(async () => recovery.retry());
  await act(async () => recovery.useThisCanvas());
  expect(recovery.status).toBe("saved");
  expect((await storage.readDraft(db) as { document: { canvasBackground: string } }).document.canvasBackground).toBe("#445566");
});

it("opens the requested template after a corrupt draft is discarded", async () => {
  await seed({ schemaVersion: 1 });
  const template = BUILTIN_TEMPLATES[0];
  window.history.replaceState(null, "", `/editor?template=${template.id}`);
  await mount();
  expect(recovery.problem).toBe("corrupt");
  expect(navigation.replace).not.toHaveBeenCalled();
  await act(async () => recovery.discard());
  await vi.waitFor(async () => {
    await settle();
    expect(useStore.getState().elements).toEqual(template.elements);
  });
  expect(recovery.problem).toBeNull();
  expect(navigation.replace).toHaveBeenCalledWith("/editor");
});

it("retains a corrupt draft read on retry so discard remains usable", async () => {
  await seed({ schemaVersion: 1 });
  vi.mocked(storage.openDraftDatabase).mockRejectedValueOnce(new storage.DraftUnavailableError());
  await mount();
  await act(async () => recovery.retry());
  expect(recovery.problem).toBe("corrupt");
  await act(async () => recovery.discard());
  expect(recovery.problem).toBeNull();
  expect(recovery.status).toBe("saved");
});

it("keeps conflict actions usable when the draft changes before discard", async () => {
  await seed({ schemaVersion: 1 });
  await mount();
  const saved = await storage.writeDraft(db, null, { ...createDefaultDocument(), canvasBackground: "#112233" });
  await act(async () => recovery.discard());
  expect(recovery.status).toBe("conflict");
  expect(await storage.readDraft(db)).toEqual(saved);
  await act(async () => recovery.loadSaved());
  expect(recovery.problem).toBeNull();
  expect(useStore.getState().canvasBackground).toBe("#112233");
});

it.each(["retry", "discard"] as const)("removes controller listeners after %s and unmount", async (action) => {
  if (action === "retry") vi.mocked(storage.openDraftDatabase).mockRejectedValueOnce(new storage.DraftUnavailableError());
  else await seed({ schemaVersion: 1 });
  await mount();
  const subscribe = vi.spyOn(useStore, "subscribe");
  const removeDocument = vi.spyOn(document, "removeEventListener");
  const removeWindow = vi.spyOn(window, "removeEventListener");
  await act(async () => recovery[action]());
  expect(subscribe).toHaveBeenCalledOnce();
  await act(async () => root!.unmount()); root = undefined;
  expect(removeDocument).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
  expect(removeWindow).toHaveBeenCalledWith("pagehide", expect.any(Function));
  useStore.getState().setBackground("#abcdef");
  await new Promise((resolve) => setTimeout(resolve, 550));
  expect((await storage.readDraft(db) as { document: { canvasBackground: string } }).document.canvasBackground).not.toBe("#abcdef");
});

it("retries a template whose first save failed without consuming its URL", async () => {
  const template = BUILTIN_TEMPLATES[0];
  window.history.replaceState(null, "", `/editor?template=${template.id}`);
  vi.spyOn(storage, "writeDraft").mockRejectedValueOnce(new storage.DraftQuotaError());
  await mount();
  expect(recovery.status).toBe("error");
  expect(navigation.replace).not.toHaveBeenCalled();
  await act(async () => recovery.retry());
  await vi.waitFor(async () => {
    await settle();
    expect(useStore.getState().elements).toEqual(template.elements);
  });
  expect(navigation.replace).toHaveBeenCalledWith("/editor");
});

it("closes a database opened by retry after the editor unmounts", async () => {
  vi.mocked(storage.openDraftDatabase).mockRejectedValueOnce(new storage.DraftUnavailableError());
  await mount();
  const connection = await storage.openDraftDatabase();
  const close = vi.spyOn(connection, "close");
  let resolveOpen!: (value: IDBDatabase) => void;
  vi.mocked(storage.openDraftDatabase).mockReturnValueOnce(new Promise((resolve) => { resolveOpen = resolve; }));
  let retry!: Promise<void>;
  await act(async () => { retry = recovery.retry(); });
  await act(async () => root!.unmount()); root = undefined;
  resolveOpen(connection);
  await retry;
  expect(close).toHaveBeenCalledOnce();
  expect(await storage.readDraft(db)).toBeUndefined();
});

it.each(["template", "preset"] as const)("keeps a recovered draft when opening a %s is cancelled", async (kind) => {
  const document = { ...createDefaultDocument(), canvasBackground: "#112233" };
  const saved = await storage.writeDraft(db, null, document);
  await mount();
  const generation = useStore.getState().documentGeneration;
  vi.mocked(window.confirm).mockReturnValueOnce(false);
  const preset = kind === "template" ? BUILTIN_TEMPLATES[0] : { ...createDefaultDocument(), id: "preset", name: "Saved scene", createdAt: 1 };
  let opened = true;
  await act(async () => { opened = await recovery.loadTemplateOrPreset(preset); });
  expect(opened).toBe(false);
  expect(window.confirm).toHaveBeenCalledOnce();
  expect(useStore.getState().canvasBackground).toBe("#112233");
  expect(useStore.getState().documentGeneration).toBe(generation);
  expect(await storage.readDraft(db)).toEqual(saved);
});

it("persists a confirmed built-in template while retaining the current background", async () => {
  await storage.writeDraft(db, null, { ...createDefaultDocument(), canvasBackground: "#112233" });
  await mount();
  const template = BUILTIN_TEMPLATES[0];
  let opened = false;
  await act(async () => { opened = await recovery.loadTemplateOrPreset(template); });
  expect(opened).toBe(true);
  expect(window.confirm).toHaveBeenCalledOnce();
  expect(useStore.getState().canvasBackground).toBe("#112233");
  expect(useStore.getState().elements).toEqual(template.elements);
  expect((await storage.readDraft(db) as { document: unknown }).document).toEqual({
    ...createDefaultDocument(), canvasBackground: "#112233", aspectRatio: template.aspectRatio, elements: template.elements,
  });
});

it("applies a saved preset's complete canvas settings", async () => {
  await mount();
  const preset = { ...createDefaultDocument(), canvasBackground: "#445566", id: "preset", name: "Saved scene", createdAt: 1 };
  let opened = false;
  await act(async () => { opened = await recovery.loadTemplateOrPreset(preset); });
  expect(opened).toBe(true);
  expect(window.confirm).not.toHaveBeenCalled();
  expect(useStore.getState().canvasBackground).toBe("#445566");
  expect((await storage.readDraft(db) as { document: { canvasBackground: string } }).document.canvasBackground).toBe("#445566");
});

it("does not replace a canvas or a newer draft when a panel template hits a conflict", async () => {
  const saved = await storage.writeDraft(db, null, { ...createDefaultDocument(), canvasBackground: "#112233" });
  await mount();
  const newer = await storage.writeDraft(db, saved.revision, { ...createDefaultDocument(), canvasBackground: "#445566" });
  let opened = true;
  await act(async () => { opened = await recovery.loadTemplateOrPreset(BUILTIN_TEMPLATES[0]); });
  expect(opened).toBe(false);
  expect(recovery.status).toBe("conflict");
  expect(useStore.getState().canvasBackground).toBe("#112233");
  expect(useStore.getState().elements).toEqual([]);
  expect(await storage.readDraft(db)).toEqual(newer);
});
