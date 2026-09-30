import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { createDefaultDocument } from "../store/use-store";
import { decodeDraft, CanvasDocumentSchema } from "./draft-schema";
import {
  openDraftDatabase,
  readDraft,
  writeDraft,
  DraftConflictError,
  DraftInvalidError,
  DraftQuotaError,
  DraftUnavailableError,
} from "./draft-storage";
import { PRESET_GRADIENTS } from "../values";

beforeEach(async () => {
  await new Promise<void>((resolve) => {
    const request = indexedDB.deleteDatabase("fluidframe-recovery");
    request.onsuccess = request.onerror = () => resolve();
  });
});

describe("recovery drafts", () => {
  it("round trips every supported radial gradient background", async () => {
    const db = await openDraftDatabase();
    try {
      let revision: string | null = null;
      for (const preset of PRESET_GRADIENTS) {
        const document = {
          ...createDefaultDocument(),
          canvasBackground: preset.value,
        };
        const record = await writeDraft(db, revision, document);
        expect(decodeDraft(await readDraft(db))).toEqual({
          kind: "valid",
          record,
        });
        revision = record.revision;
      }
    } finally {
      db.close();
    }
  });
  it("identifies storage errors for recovery guidance", () => {
    for (const ErrorClass of [
      DraftQuotaError,
      DraftConflictError,
      DraftInvalidError,
      DraftUnavailableError,
    ]) {
      expect(new ErrorClass().name).toBe(ErrorClass.name);
    }
  });
  it("round trips a document and keeps the prior revision on invalid writes", async () => {
    const db = await openDraftDatabase();
    const document = createDefaultDocument();
    const first = await writeDraft(db, null, document);
    expect(decodeDraft(await readDraft(db))).toEqual({
      kind: "valid",
      record: first,
    });
    await expect(
      writeDraft(db, first.revision, {
        ...document,
        aspectRatio: { ...document.aspectRatio, width: -1 },
      }),
    ).rejects.toBeInstanceOf(DraftInvalidError);
    expect(await readDraft(db)).toEqual(first);
    db.close();
  });
  it("rejects stale concurrent writers", async () => {
    const db = await openDraftDatabase();
    const first = await writeDraft(db, null, createDefaultDocument());
    await writeDraft(db, first.revision, createDefaultDocument());
    await expect(
      writeDraft(db, first.revision, createDefaultDocument()),
    ).rejects.toBeInstanceOf(DraftConflictError);
    db.close();
  });
  it("rejects unsupported, duplicate, and transient sources", () => {
    expect(decodeDraft({ schemaVersion: 2 })).toEqual({ kind: "unsupported" });
    expect(decodeDraft({ document: {} })).toEqual({ kind: "corrupt" });
    const base = createDefaultDocument();
    const bad = {
      ...base,
      elements: [
        {
          id: "a",
          type: "image",
          name: "x",
          src: "blob:temporary",
          position: { x: 0, y: 0 },
          style: {},
          isVisible: true,
          isLocked: false,
        },
      ],
    };
    expect(CanvasDocumentSchema.safeParse(bad).success).toBe(false);
  });
});

import { BUILTIN_TEMPLATES } from "../templates/presets-data";
import {
  DEFAULT_CODE_STYLE,
  DEFAULT_IMAGE_STYLE,
  DEFAULT_TEXT_STYLE,
} from "../types";

it("accepts built-in templates and complete image, text, and code layers", () => {
  for (const template of BUILTIN_TEMPLATES) {
    const base = createDefaultDocument();
    expect(
      CanvasDocumentSchema.safeParse({
        ...base,
        aspectRatio: template.aspectRatio || base.aspectRatio,
        elements: template.elements,
      }).success,
      template.id,
    ).toBe(true);
  }
  const document = createDefaultDocument();
  document.elements = [
    {
      id: "image",
      type: "image",
      name: "Image",
      src: "data:image/png;base64,YQ==",
      position: { x: -10, y: 2 },
      style: {
        ...DEFAULT_IMAGE_STYLE,
        crop: { top: 1, right: 2, bottom: 3, left: 4 },
      },
      isVisible: true,
      isLocked: false,
    },
    {
      id: "text",
      type: "text",
      name: "Text",
      content: "hello",
      position: { x: 0, y: 0 },
      style: DEFAULT_TEXT_STYLE,
      isVisible: true,
      isLocked: false,
    },
    {
      id: "code",
      type: "code",
      name: "Code",
      code: "hello()",
      language: "js",
      position: { x: 0, y: 0 },
      style: DEFAULT_CODE_STYLE,
      isVisible: true,
      isLocked: false,
    },
  ];
  expect(CanvasDocumentSchema.safeParse(document).success).toBe(true);
});
