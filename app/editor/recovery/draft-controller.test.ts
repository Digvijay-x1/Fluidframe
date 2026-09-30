import "fake-indexeddb/auto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useStore, createDefaultDocument } from "../store/use-store";
import { DraftController } from "./draft-controller";
import { openDraftDatabase, readDraft } from "./draft-storage";

let db: IDBDatabase;
let stop: () => void;
beforeEach(async () => {
  await new Promise<void>((resolve) => {
    const request = indexedDB.deleteDatabase("fluidframe-recovery");
    request.onsuccess = request.onerror = () => resolve();
  });
  vi.stubGlobal("document", Object.assign(new EventTarget(), { visibilityState: "visible" }));
  vi.stubGlobal("window", new EventTarget());
  useStore.getState().replaceDocument(createDefaultDocument());
  db = await openDraftDatabase();
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
});
afterEach(() => { stop?.(); db?.close(); vi.useRealTimers(); vi.unstubAllGlobals(); });

it("ignores selection changes and saves document edits after the debounce", async () => {
  const statuses: string[] = [];
  const controller = new DraftController(db, null, (status) => statuses.push(status));
  stop = controller.start();
  useStore.getState().selectElement("missing");
  await vi.advanceTimersByTimeAsync(600);
  expect(await readDraft(db)).toBeUndefined();
  useStore.getState().setBackground("#112233");
  await vi.advanceTimersByTimeAsync(499);
  expect(await readDraft(db)).toBeUndefined();
  await vi.advanceTimersByTimeAsync(1);
  expect((await readDraft(db) as { document: { canvasBackground: string } }).document.canvasBackground).toBe("#112233");
  expect(statuses).toContain("saved");
});

it("saves during continuous edits by the maximum wait", async () => {
  const controller = new DraftController(db, null, () => {});
  stop = controller.start();
  useStore.getState().setBackground("#111111");
  for (let i = 0; i < 5; i++) {
    await vi.advanceTimersByTimeAsync(400);
    useStore.getState().setBackground(`#${String(i + 2).repeat(6)}`);
  }
  await vi.advanceTimersByTimeAsync(1);
  expect(await readDraft(db)).toBeDefined();
});
