import { AspectRatioPreset } from "./values";
import { VectorPatternType } from "./components/canvas/vector-overlay";
import { StudioTextureType } from "./components/canvas/studio-texture";

export interface ImageStyle {
  scale: number;
  borderRadius: number;
  shadow: string;
  blur: number;
  opacity: number;
  brightness?: number;
  contrast?: number;
  saturate?: number;
  rotate: number;
  rotateX: number;
  rotateY: number;
  clipPath: string;
  flipX: boolean;
  flipY: boolean;
  glassmorphism?: boolean;
  glassBlur?: number;
  crop: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export const DEFAULT_IMAGE_STYLE: ImageStyle = {
  scale: 100,
  borderRadius: 0,
  shadow: "none",
  rotate: 0,
  rotateX: 0,
  rotateY: 0,
  blur: 0,
  opacity: 100,
  brightness: 100,
  contrast: 100,
  saturate: 100,
  clipPath: "none",
  flipX: false,
  flipY: false,
  glassmorphism: false,
  glassBlur: 16,
  crop: { top: 0, right: 0, bottom: 0, left: 0 },
};

export interface ImageElement {
  id: string;
  type: "image";
  name: string;
  src: string;
  position: { x: number; y: number };
  style: ImageStyle;
  isVisible: boolean;
  isLocked: boolean;
  dither?: DitherConfig;
  width?: number;
  height?: number;
  isPlaceholder?: boolean;
  placeholderLabel?: string;
}

export interface TextStyle {
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  letterSpacing?: number;
  writingMode?: "horizontal" | "vertical" | "vertical-upright";
  color: string;
  colorVia?: string;
  colorEnd?: string;
  colorType?: "solid" | "gradient";
  colorDirection?: string;
  textShadow: string;
  borderRadius: number;
  borderWidth?: number;
  backgroundColor: string;
  backgroundColorVia?: string;
  backgroundColorEnd?: string;
  backgroundType?: "solid" | "gradient";
  backgroundDirection?: string;
  padding: number;
  showBackground: boolean;
  backgroundShadow: string;
  textEffect: string[];
  rotate: number;
  rotateX: number;
  rotateY: number;
  glassmorphism?: boolean;
  glassBlur?: number;
}

export const DEFAULT_TEXT_STYLE: TextStyle = {
  fontSize: 48,
  fontFamily: "Inter",
  fontWeight: "600",
  letterSpacing: 0,
  writingMode: "horizontal",
  color: "#ffffff",
  colorVia: "#cbd5e1",
  colorEnd: "#64748b",
  colorType: "gradient",
  colorDirection: "to bottom",
  textShadow: "none",
  borderRadius: 0,
  borderWidth: 0,
  backgroundColor: "#18181b",
  backgroundColorVia: "#111113",
  backgroundColorEnd: "#09090b",
  backgroundType: "gradient",
  backgroundDirection: "to bottom",
  padding: 8,
  showBackground: false,
  backgroundShadow: "none",
  textEffect: [],
  rotate: 0,
  rotateX: 0,
  rotateY: 0,
  glassmorphism: false,
  glassBlur: 16,
};

export interface TextElement {
  id: string;
  type: "text";
  name: string;
  content: string;
  position: { x: number; y: number };
  style: TextStyle;
  isVisible: boolean;
  isLocked: boolean;
}

export type WindowFrameStyle = "macos" | "windows" | "classic" | "browser" | "minimal";

export interface CodeStyle {
  fontSize: number;
  fontFamily: string;
  theme: "tokyo-night" | "one-dark" | "dracula" | "github-dark" | "monokai";
  showWindowControls: boolean;
  windowTitle: string;
  windowFrame?: WindowFrameStyle;
  lineNumbers: boolean;
  padding: number;
  borderRadius: number;
  shadow: string;
  rotate: number;
  rotateX: number;
  rotateY: number;
  scale: number;
  opacity: number;
  glassmorphism?: boolean;
  glassBlur?: number;
  width?: number;
}

export const DEFAULT_CODE_STYLE: CodeStyle = {
  fontSize: 14,
  fontFamily: "var(--font-mono)",
  theme: "tokyo-night",
  showWindowControls: true,
  windowTitle: "showcase.tsx",
  windowFrame: "macos",
  lineNumbers: true,
  padding: 16,
  borderRadius: 12,
  shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  rotate: 0,
  rotateX: 0,
  rotateY: 0,
  scale: 100,
  opacity: 100,
  glassmorphism: false,
  glassBlur: 24,
  width: 500,
};

export interface CodeElement {
  id: string;
  type: "code";
  name: string;
  code: string;
  language: string;
  position: { x: number; y: number };
  style: CodeStyle;
  isVisible: boolean;
  isLocked: boolean;
  width?: number;
}

export type CanvasElement = ImageElement | TextElement | CodeElement;

export interface MeshGradientConfig {
  colors: string[]; // 5 hex colors
  speed: number;
  noiseIntensity: number;
  noiseScale: number;
  noiseGrain: number;
  isAnimating: boolean;
  ditherEnabled: boolean;
  ditherType: number; // 0: Bayer 2x2, 1: Bayer 4x4, 2: Bayer 8x8, 3: Random
  ditherPixelSize: number;
  ditherColorSteps: number;
  ditherStrength: number;
}

export interface OverlayConfig {
  pattern: VectorPatternType;
  patternOpacity: number;
  patternColor: string;
  texture: StudioTextureType;
  textureOpacity: number;
}

export interface EditorCanvasProps {
  width: number;
  height: number;
  canvasBackground: string;
  meshConfig: MeshGradientConfig;
  overlayConfig: OverlayConfig;
  elements: CanvasElement[];
  selectedElementId: string | null;
  isDragging: boolean;
  isCropping: boolean;
  snapGuides?: { x: number | null; y: number | null };
  showGrid?: boolean;
  onElementMouseDown: (e: React.PointerEvent, elementId: string) => void;
  onEmptyClick: () => void;
  onMouseMove: (e: React.PointerEvent) => void;
  onMouseUp: (e: React.PointerEvent) => void;
  onCropChange: (id: string, newCrop: any) => void;
}

export type ExportFormat = "mp4" | "gif" | "png" | "jpeg" | "svg";

export interface EditorState {
  aspectRatio: AspectRatioPreset;
  canvasBackground: string;
  meshConfig: MeshGradientConfig;
  overlayConfig: OverlayConfig;
  elements: CanvasElement[];
  selectedElementId: string | null;
  isCropping: boolean;
  exportFormat: ExportFormat;
  exportQuality: string;
  exportDuration: number;
  exportFps: number;
  historyIndex: number;
  history: HistoryState[];
  activeTab: string;
  lastSelectedTextId: string | null;
  lastSelectedImageId: string | null;
  lastSelectedCodeId: string | null;
  userPresets: Array<{
    id: string;
    name: string;
    createdAt: number;
    aspectRatio: AspectRatioPreset;
    canvasBackground: string;
    meshConfig: MeshGradientConfig;
    overlayConfig: OverlayConfig;
    elements: CanvasElement[];
  }>;

  setActiveTab: (tab: string) => void;
  setAspectRatio: (name: string) => void;
  setCustomSize: (width: number, height: number) => void;
  setBackground: (bg: string) => void;
  setMeshConfig: (config: Partial<MeshGradientConfig>) => void;
  setOverlayConfig: (config: Partial<OverlayConfig>) => void;
  setExportFormat: (format: ExportFormat) => void;
  setExportQuality: (quality: string) => void;
  setExportDuration: (duration: number) => void;
  setExportFps: (fps: number) => void;
  addElement: (element: CanvasElement) => void;
  updateElement: (
    id: string,
    updates:
      | Partial<CanvasElement>
      | Partial<ImageElement["style"]>
      | Partial<TextElement["style"]>
      | Partial<CodeStyle>
  ) => void;
  removeElement: (id: string) => void;
  toggleVisibility: (id: string) => void;
  toggleLock: (id: string) => void;
  selectElement: (id: string | null) => void;
  setCropping: (isCropping: boolean) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  setElements: (elements: CanvasElement[]) => void;
  setDitherConfig: (layerId: string, config: Partial<DitherConfig>) => void;
  saveCustomPreset: (name: string) => void;
  deleteCustomPreset: (id: string) => void;
  loadTemplateOrPreset: (preset: {
    elements: CanvasElement[];
    canvasBackground?: string;
    meshConfig?: MeshGradientConfig;
    overlayConfig?: OverlayConfig;
    aspectRatio?: AspectRatioPreset;
  }) => void;
  exportPresetsAsJson: () => string;
  importPresetsFromJson: (jsonStr: string) => boolean;
  loadUserPresets: () => void;
}

export interface LeftPanelProps {
  isCropping: boolean;
  onToggleCropping: () => void;
  onImageUpload: (file: File) => void;
}

export interface Wallpaper {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
}

export interface Meme {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
}

export interface MemesOptions {
  limit?: number;
  enableCache?: boolean;
  cacheTime?: number;
}

export interface HistoryState {
  elements: CanvasElement[];
  canvasBackground: string;
  meshConfig: MeshGradientConfig;
  overlayConfig: OverlayConfig;
  aspectRatio?: AspectRatioPreset;
}

export interface RightPanelProps {
  onDownload?: () => void;
}

export interface DitherConfig {
  enabled: boolean;
  ditherType: number; // 0: Bayer 2x2, 1: Bayer 4x4, 2: Bayer 8x8, 3: Random
  pixelSize: number;
  colorSteps: number;
  strength?: number;
  colorFront: string; // Hex string e.g. "#ffffff"
  colorBack: string; // Hex string e.g. "#000000"
}

