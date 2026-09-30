import { CanvasDocumentSchema, type DraftRecordV1 } from "./draft-schema";
import type { CanvasDocument } from "../types";

export class DraftConflictError extends Error {
  constructor() {
    super("Draft changed in another tab");
    this.name = "DraftConflictError";
  }
}
export class DraftUnavailableError extends Error {
  constructor() {
    super("Local recovery unavailable");
    this.name = "DraftUnavailableError";
  }
}
export class DraftInvalidError extends Error {
  constructor() {
    super("Invalid canvas document");
    this.name = "DraftInvalidError";
  }
}
export class DraftQuotaError extends Error {
  constructor() {
    super("Browser storage is full");
    this.name = "DraftQuotaError";
  }
}
const databaseName = "fluidframe-recovery";
const storeName = "drafts";
const key = "current";

export function openDraftDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new DraftUnavailableError());
      return;
    }
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(storeName))
        request.result.createObjectStore(storeName);
    };
    request.onblocked = () => reject(new DraftUnavailableError());
    request.onerror = () => reject(new DraftUnavailableError());
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => db.close();
      resolve(db);
    };
  });
}
export function readDraft(db: IDBDatabase): Promise<unknown | undefined> {
  return new Promise((resolve, reject) => {
    let value: unknown;
    try {
      const tx = db.transaction(storeName, "readonly");
      tx.objectStore(storeName).get(key).onsuccess = (event) => {
        value = (event.target as IDBRequest).result;
      };
      tx.oncomplete = () => resolve(value);
      tx.onerror = tx.onabort = () => reject(new DraftUnavailableError());
    } catch {
      reject(new DraftUnavailableError());
    }
  });
}
export function writeDraft(
  db: IDBDatabase,
  expectedRevision: string | null,
  document: CanvasDocument,
  expectedRaw?: unknown,
): Promise<DraftRecordV1> {
  const parsed = CanvasDocumentSchema.safeParse(document);
  if (!parsed.success) return Promise.reject(new DraftInvalidError());
  const record: DraftRecordV1 = {
    schemaVersion: 1,
    revision: crypto.randomUUID(),
    savedAt: Date.now(),
    document: parsed.data,
  };
  return new Promise((resolve, reject) => {
    let failure: Error | undefined;
    try {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const request = store.get(key);
      request.onsuccess = () => {
        const current = request.result as { revision?: unknown } | undefined;
        try {
          if (
            (current?.revision ?? null) !== expectedRevision ||
            (expectedRaw !== undefined &&
              JSON.stringify(request.result) !== JSON.stringify(expectedRaw))
          ) {
            failure = new DraftConflictError();
            tx.abort();
            return;
          }
          store.put(record, key);
        } catch {
          failure = new DraftConflictError();
          tx.abort();
        }
      };
      tx.oncomplete = () => resolve(record);
      tx.onerror = tx.onabort = () =>
        reject(
          failure ??
            (tx.error?.name === "QuotaExceededError"
              ? new DraftQuotaError()
              : new DraftUnavailableError()),
        );
    } catch (error) {
      reject(
        error instanceof DOMException && error.name === "QuotaExceededError"
          ? new DraftQuotaError()
          : new DraftUnavailableError(),
      );
    }
  });
}
