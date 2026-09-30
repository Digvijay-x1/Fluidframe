import type { CanvasDocument } from "../types";
import { useStore } from "../store/use-store";
import { projectDocument } from "./draft-schema";
import {
  DraftConflictError,
  DraftInvalidError,
  DraftUnavailableError,
  writeDraft,
} from "./draft-storage";

export type RecoveryStatus =
  | "idle"
  | "pending"
  | "saving"
  | "saved"
  | "error"
  | "unavailable"
  | "conflict"
  | "invalid";
export class DraftController {
  private revision: string | null;
  private edit = 0;
  private savedEdit = 0;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private maxTimer: ReturnType<typeof setTimeout> | undefined;
  private writing: Promise<void> | undefined;
  private unsubscribe: (() => void) | undefined;
  private stop: (() => void) | undefined;
  private paused = false;
  private replacing = false;
  private disposed = false;
  status: RecoveryStatus = "idle";
  error: Error | undefined;
  constructor(
    private db: IDBDatabase,
    revision: string | null,
    private notify: (status: RecoveryStatus, error?: Error) => void,
  ) {
    this.revision = revision;
    this.status = revision ? "saved" : "idle";
  }
  start() {
    if (this.stop) return this.stop;
    this.unsubscribe = useStore.subscribe((state, previous) => {
      if (this.replacing || this.disposed) return;
      if (
        state.aspectRatio === previous.aspectRatio &&
        state.canvasBackground === previous.canvasBackground &&
        state.meshConfig === previous.meshConfig &&
        state.overlayConfig === previous.overlayConfig &&
        state.elements === previous.elements
      )
        return;
      this.edit++;
      if (this.paused && this.status === "invalid") this.paused = false;
      if (!this.paused) {
        this.setStatus("pending");
        this.schedule();
      }
    });
    const flush = () => {
      if (document.visibilityState === "hidden") void this.flush();
    };
    const hide = () => {
      void this.flush();
    };
    document.addEventListener("visibilitychange", flush);
    window.addEventListener("pagehide", hide);
    this.stop = () => {
      this.disposed = true;
      this.unsubscribe?.();
      this.cancelTimers();
      document.removeEventListener("visibilitychange", flush);
      window.removeEventListener("pagehide", hide);
    };
    return this.stop;
  }
  private setStatus(status: RecoveryStatus, error?: Error) {
    if (this.disposed) return;
    this.status = status;
    this.error = error;
    this.notify(status, error);
  }
  private cancelTimers() {
    clearTimeout(this.timer);
    clearTimeout(this.maxTimer);
    this.timer = this.maxTimer = undefined;
  }
  private schedule() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => void this.flush(), 500);
    this.maxTimer ??= setTimeout(() => void this.flush(), 2000);
  }
  async flush(): Promise<void> {
    this.cancelTimers();
    if (this.paused || this.disposed || this.replacing) return;
    if (this.writing) {
      await this.writing;
      if (this.edit > this.savedEdit && !this.paused) return this.flush();
      return;
    }
    if (this.edit === this.savedEdit) return;
    const edit = this.edit;
    const document = projectDocument(useStore.getState());
    this.setStatus("saving");
    this.writing = (async () => {
      try {
        const record = await writeDraft(this.db, this.revision, document);
        this.revision = record.revision;
        this.savedEdit = edit;
        if (this.edit === edit) this.setStatus("saved");
      } catch (error) {
        const failure =
          error instanceof Error ? error : new DraftUnavailableError();
        if (failure instanceof DraftConflictError) {
          this.paused = true;
          this.setStatus("conflict", failure);
        } else if (failure instanceof DraftInvalidError) {
          this.paused = true;
          this.setStatus("invalid", failure);
        } else this.setStatus("error", failure);
      }
    })();
    await this.writing;
    this.writing = undefined;
    if (this.edit > this.savedEdit && !this.paused && this.status !== "error")
      void this.flush();
  }
  retry() {
    if (this.status === "invalid") this.paused = false;
    if (this.status === "error" || this.status === "invalid") {
      this.setStatus("pending");
      return this.flush();
    }
    return Promise.resolve();
  }
  markConflict() {
    this.paused = true;
    this.setStatus("conflict", new DraftConflictError());
  }
  async replace(
    document: CanvasDocument,
    expectedRevision?: string | null,
    expectedRaw?: unknown,
  ) {
    if (this.disposed || this.replacing) return false;
    this.cancelTimers();
    this.replacing = true;
    try {
      await this.writing;
      if (this.disposed) return false;
      const record = await writeDraft(
        this.db,
        expectedRevision === undefined ? this.revision : expectedRevision,
        document,
        expectedRaw,
      );
      if (this.disposed) return false;
      this.revision = record.revision;
      useStore.getState().replaceDocument(record.document);
      this.edit++;
      this.savedEdit = this.edit;
      this.paused = false;
      this.setStatus("saved");
      return true;
    } catch (error) {
      const failure =
        error instanceof Error ? error : new DraftUnavailableError();
      if (failure instanceof DraftConflictError) {
        this.paused = true;
        this.setStatus("conflict", failure);
      } else this.setStatus("error", failure);
      return false;
    } finally {
      this.replacing = false;
    }
  }
  async adopt(document: CanvasDocument, revision: string | null) {
    this.cancelTimers();
    await this.writing;
    if (this.disposed) return;
    this.replacing = true;
    this.revision = revision;
    useStore.getState().replaceDocument(document);
    this.edit++;
    this.savedEdit = this.edit;
    this.paused = false;
    this.setStatus("saved");
    this.replacing = false;
  }
  getRevision() {
    return this.revision;
  }
}
