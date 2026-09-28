import { z } from "zod";
import type { CanvasDocument, EditorState } from "../types";
import { createDefaultDocument } from "../store/use-store";

const finite = z.number().finite();
const positive = finite.positive();
const position = z.object({ x: finite, y: finite });
const crop = z.object({ top: finite, right: finite, bottom: finite, left: finite });
const common = {
  id: z.string().min(1), name: z.string(), position,
  isVisible: z.boolean(), isLocked: z.boolean(),
};
const imageStyle = z.object({
  scale: finite, borderRadius: finite, shadow: z.string(), blur: finite,
  opacity: finite, brightness: finite.optional(), contrast: finite.optional(),
  saturate: finite.optional(), rotate: finite, rotateX: finite, rotateY: finite,
  clipPath: z.string(), flipX: z.boolean(), flipY: z.boolean(),
  glassmorphism: z.boolean().optional(), glassBlur: finite.optional(), crop,
});
const textStyle = z.object({
  fontSize: finite, fontFamily: z.string(), fontWeight: z.string(),
  letterSpacing: finite.optional(),
  writingMode: z.enum(["horizontal", "vertical", "vertical-upright"]).optional(),
  color: z.string(), colorVia: z.string().optional(), colorEnd: z.string().optional(),
  colorType: z.enum(["solid", "gradient"]).optional(), colorDirection: z.string().optional(),
  textShadow: z.string(), borderRadius: finite, borderWidth: finite.optional(),
  backgroundColor: z.string(), backgroundColorVia: z.string().optional(),
  backgroundColorEnd: z.string().optional(),
  backgroundType: z.enum(["solid", "gradient"]).optional(),
  backgroundDirection: z.string().optional(), padding: finite,
  showBackground: z.boolean(), backgroundShadow: z.string(),
  textEffect: z.array(z.string()), rotate: finite, rotateX: finite, rotateY: finite,
  glassmorphism: z.boolean().optional(), glassBlur: finite.optional(),
});
const codeStyle = z.object({
  fontSize: finite, fontFamily: z.string(),
  theme: z.enum(["tokyo-night", "one-dark", "dracula", "github-dark", "monokai"]),
  showWindowControls: z.boolean(), windowTitle: z.string(),
  windowFrame: z.enum(["macos", "windows", "classic", "browser", "minimal"]).optional(),
  lineNumbers: z.boolean(), padding: finite, borderRadius: finite,
  shadow: z.string(), rotate: finite, rotateX: finite, rotateY: finite,
  scale: finite, opacity: finite, glassmorphism: z.boolean().optional(),
  glassBlur: finite.optional(), width: positive.optional(),
});
const dither = z.object({
  enabled: z.boolean(), ditherType: finite, pixelSize: finite,
  colorSteps: finite, strength: finite.optional(),
  colorFront: z.string(), colorBack: z.string(),
});
const safeImageSource = (src: string) =>
  src === "" || /^data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=]+$/i.test(src) ||
  /^https?:\/\//i.test(src) || /^(\/|\.\/|\.\.\/)[^\s]*$/.test(src);
const image = z.object({
  ...common, type: z.literal("image"), src: z.string(), style: imageStyle,
  dither: dither.optional(), width: positive.optional(), height: positive.optional(),
  isPlaceholder: z.boolean().optional(), placeholderLabel: z.string().optional(),
}).refine((value) => safeImageSource(value.src) && (value.src !== "" || value.isPlaceholder === true));
const text = z.object({ ...common, type: z.literal("text"), content: z.string(), style: textStyle });
const code = z.object({ ...common, type: z.literal("code"), code: z.string(), language: z.string(), style: codeStyle, width: positive.optional() });
export const CanvasElementSchema = z.union([image, text, code]);
const background = z.string().refine((value) =>
  value === "mesh" || /^#[0-9a-f]{3,8}$/i.test(value) || /^rgba?\([\d\s.,%]+\)$/i.test(value) ||
  /^url\((['"]?)(https?:\/\/[^)'"\s]+|\/[a-z0-9_./%?&=+-]+)\1\)$/i.test(value)
);
export const CanvasDocumentSchema = z.object({
  aspectRatio: z.object({
    name: z.string(), label: z.string(),
    category: z.enum(["Video & Display", "Social Media", "Developer & Launch", "Design & Standard", "Custom"]),
    width: positive, height: positive, previewClass: z.string(),
  }),
  canvasBackground: background,
  meshConfig: z.object({
    colors: z.array(z.string()), speed: finite, noiseIntensity: finite,
    noiseScale: finite, noiseGrain: finite, isAnimating: z.boolean(),
    ditherEnabled: z.boolean(), ditherType: finite, ditherPixelSize: finite,
    ditherColorSteps: finite, ditherStrength: finite,
  }),
  overlayConfig: z.object({
    pattern: z.enum(["none", "topographic", "isometric", "dotmatrix", "circuit", "waves", "honeycomb", "blueprint", "crosshair", "japanese-wave", "constellation", "diagonal-stripes", "moroccan", "matrix-rain", "plus-grid", "radar", "scales", "triangles"]),
    patternOpacity: finite, patternColor: z.string(),
    texture: z.enum(["none", "grain", "paper", "scratches", "canvas", "dust", "halftone"]),
    textureOpacity: finite,
  }),
  elements: z.array(CanvasElementSchema),
}).superRefine((value, ctx) => {
  const ids = new Set<string>();
  let codes = 0;
  for (const element of value.elements) {
    if (ids.has(element.id)) ctx.addIssue({ code: "custom", message: "Duplicate element ID" });
    ids.add(element.id);
    if (element.type === "code") codes++;
  }
  if (codes > 1) ctx.addIssue({ code: "custom", message: "Only one code element is supported" });
});
export const DraftRecordV1Schema = z.object({
  schemaVersion: z.literal(1), revision: z.string().uuid(), savedAt: finite,
  document: CanvasDocumentSchema,
});
export type DraftRecordV1 = z.infer<typeof DraftRecordV1Schema>;
export type DecodeResult =
  | { kind: "valid"; record: DraftRecordV1 }
  | { kind: "corrupt" }
  | { kind: "unsupported" };
export function decodeDraft(raw: unknown): DecodeResult {
  if (!raw || typeof raw !== "object") return { kind: "corrupt" };
  const version = (raw as { schemaVersion?: unknown }).schemaVersion;
  if (typeof version !== "number" || !Number.isInteger(version)) return { kind: "corrupt" };
  if (version !== 1) return { kind: "unsupported" };
  const parsed = DraftRecordV1Schema.safeParse(raw);
  return parsed.success ? { kind: "valid", record: parsed.data } : { kind: "corrupt" };
}
export const projectDocument = (state: CanvasDocument | EditorState): CanvasDocument => ({
  aspectRatio: state.aspectRatio, canvasBackground: state.canvasBackground,
  meshConfig: state.meshConfig, overlayConfig: state.overlayConfig, elements: state.elements,
});
export const isDefaultDocument = (document: CanvasDocument) =>
  JSON.stringify(document) === JSON.stringify(createDefaultDocument());
