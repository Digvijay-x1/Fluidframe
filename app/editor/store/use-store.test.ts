import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_IMAGE_STYLE, type ImageElement } from "../types";
import { useStore } from "./use-store";

const image = (id: string): ImageElement => ({
  id,
  type: "image",
  name: id,
  src: "data:image/png;base64,fixture",
  position: { x: 10, y: 20 },
  style: { ...DEFAULT_IMAGE_STYLE },
  isVisible: true,
  isLocked: false,
});

beforeEach(() => {
  useStore.getState().reset();
  useStore.getState().addElement(image("first"));
  useStore.getState().addElement(image("second"));
});

describe.each([
  { action: "toggleVisibility" as const, field: "isVisible" as const },
  { action: "toggleLock" as const, field: "isLocked" as const },
])("$action history", ({ action, field }) => {
  it("preserves an unrecorded move when undoing a toggle", () => {
    const original = useStore.getState().elements;
    useStore.getState().updateElement("first", { position: { x: 11, y: 20 } });
    const moved = useStore.getState().elements;
    useStore.getState()[action]("first");
    const toggled = useStore.getState().elements;

    useStore.getState().undo();
    expect(useStore.getState().elements).toEqual(moved);
    useStore.getState().undo();
    expect(useStore.getState().elements).toEqual(original);
    useStore.getState().redo();
    expect(useStore.getState().elements).toEqual(moved);
    useStore.getState().redo();
    expect(useStore.getState().elements).toEqual(toggled);
  });

  it("preserves an unrecorded move after undo while discarding obsolete redo entries", () => {
    useStore.getState().setBackground("#112233");
    useStore.getState().undo();
    const background = useStore.getState().canvasBackground;
    useStore.getState().updateElement("first", { position: { x: 11, y: 20 } });
    const moved = useStore.getState().elements;
    useStore.getState()[action]("first");
    const toggled = useStore.getState().elements;
    useStore.getState().undo();
    expect(useStore.getState().elements).toEqual(moved);
    useStore.getState().redo();
    expect(useStore.getState().elements).toEqual(toggled);
    useStore.getState().redo();
    expect(useStore.getState().elements).toEqual(toggled);
    expect(useStore.getState().canvasBackground).toBe(background);
  });

  it("undoes and redoes each toggle without removing or changing other layers", () => {
    const original = useStore.getState().elements;
    const originalHistoryIndex = useStore.getState().historyIndex;
    const originalBackground = useStore.getState().canvasBackground;
    useStore.getState()[action]("first");
    const toggled = useStore.getState().elements;
    expect(useStore.getState().historyIndex).toBe(originalHistoryIndex + 1);
    expect(toggled[0][field]).toBe(!original[0][field]);
    expect(toggled[1]).toEqual(original[1]);
    expect(original[0][field]).toBe(image("first")[field]);

    useStore.getState()[action]("first");
    expect(useStore.getState().elements).toEqual(original);
    useStore.getState().undo();
    expect(useStore.getState().elements).toEqual(toggled);
    useStore.getState().undo();
    expect(useStore.getState().elements).toEqual(original);
    useStore.getState().redo();
    expect(useStore.getState().elements).toEqual(toggled);
    useStore.getState().redo();
    expect(useStore.getState().elements).toEqual(original);
    expect(useStore.getState().canvasBackground).toBe(originalBackground);
  });

  it("discards the redo branch when toggling after undo", () => {
    useStore.getState().setBackground("#112233");
    useStore.getState().undo();
    useStore.getState()[action]("first");
    const toggled = useStore.getState().elements;
    useStore.getState().redo();
    expect(useStore.getState().elements).toEqual(toggled);
    expect(useStore.getState().canvasBackground).not.toBe("#112233");
    useStore.getState().undo();
    expect(useStore.getState().elements).toEqual([
      image("first"),
      image("second"),
    ]);
  });

  it("ignores a missing layer without adding history or clearing cropping", () => {
    useStore.getState().setCropping(true);
    const before = useStore.getState();
    useStore.getState()[action]("missing");
    expect(useStore.getState()).toBe(before);
  });
});

it("stops cropping when locking the selected layer and preserves its selection", () => {
  useStore.getState().setCropping(true);
  useStore.getState().toggleLock("second");
  expect(useStore.getState().isCropping).toBe(false);
  expect(useStore.getState().selectedElementId).toBe("second");
  useStore.getState().undo();
  expect(useStore.getState().elements[1].isLocked).toBe(false);
  expect(useStore.getState().isCropping).toBe(false);
});

it("keeps cropping when locking another layer", () => {
  useStore.getState().setCropping(true);
  useStore.getState().toggleLock("first");
  expect(useStore.getState().isCropping).toBe(true);
  expect(useStore.getState().selectedElementId).toBe("second");
});
