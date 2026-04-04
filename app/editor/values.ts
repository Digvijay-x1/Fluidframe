import { MeshGradientConfig, OverlayConfig } from "./types";

export const DEFAULT_DITHER_CONFIG = {
  enabled: false,
  ditherType: 1, // Bayer 4x4 default
  pixelSize: 4,
  colorSteps: 4,
  strength: 100,
  colorFront: "#ffffff",
  colorBack: "#000000",
};

export const DEFAULT_MESH_CONFIG: MeshGradientConfig = {
  colors: ["#09090b", "#18181b", "#3f3f46", "#71717a", "#e4e4e7"],
  speed: 1.0,
  noiseIntensity: 30,
  noiseScale: 1.5,
  noiseGrain: 0,
  isAnimating: true,
  ditherEnabled: false,
  ditherType: 1,
  ditherPixelSize: 4,
  ditherColorSteps: 6,
  ditherStrength: 100,
};

export const DEFAULT_OVERLAY_CONFIG: OverlayConfig = {
  pattern: "none",
  patternOpacity: 30,
  patternColor: "#ffffff",
  texture: "none",
  textureOpacity: 40,
};

export const MESH_PALETTES = [
  {
    name: "Chrome",
    colors: ["#09090b", "#18181b", "#3f3f46", "#71717a", "#e4e4e7"],
  },
  {
    name: "Sunset Silk",
    colors: ["#ff416c", "#ff4b2b", "#ffb347", "#f72585", "#7209b7"],
  },
  {
    name: "Aurora",
    colors: ["#0575e6", "#00f260", "#059669", "#10b981", "#022c22"],
  },
  {
    name: "Velvet Noir",
    colors: ["#090a0f", "#18132e", "#241a4a", "#3b1e70", "#120a21"],
  },
  {
    name: "Vaporwave",
    colors: ["#ff71ce", "#01cdfe", "#05ffa1", "#b967ff", "#fffb96"],
  },
  {
    name: "Pastel Dream",
    colors: ["#ffcbf2", "#f3c4fb", "#c8b6ff", "#b8c0ff", "#ffd6a5"],
  },
  {
    name: "Solar Flare",
    colors: ["#ff0844", "#ffb199", "#f12711", "#f5af19", "#ff4e50"],
  },
  {
    name: "Deep Ocean",
    colors: ["#020b14", "#0a2540", "#004b79", "#0077b6", "#00f2fe"],
  },
  {
    name: "Terracotta",
    colors: ["#2d1519", "#5e2930", "#99474e", "#cf7c73", "#f2c4b8"],
  },
  {
    name: "Emerald Coast",
    colors: ["#22577a", "#38a3a5", "#57cc99", "#80ed99", "#c7f9cc"],
  },
  {
    name: "Golden Hour",
    colors: ["#1c1008", "#451a03", "#b45309", "#f59e0b", "#fde68a"],
  },
];

export interface AspectRatioPreset {
  name: string;
  label: string;
  category: "Video & Display" | "Social Media" | "Developer & Launch" | "Design & Standard" | "Custom";
  width: number;
  height: number;
  previewClass: string;
}

export const ASPECT_RATIOS: AspectRatioPreset[] = [
  // Video & Display
  {
    name: "16:9",
    label: "Video / Landscape",
    category: "Video & Display",
    width: 960,
    height: 540,
    previewClass: "aspect-video",
  },
  {
    name: "21:9",
    label: "Cinematic Ultrawide",
    category: "Video & Display",
    width: 840,
    height: 360,
    previewClass: "aspect-[21/9]",
  },
  {
    name: "16:10",
    label: "MacBook / Display",
    category: "Video & Display",
    width: 800,
    height: 500,
    previewClass: "aspect-[16/10]",
  },

  // Social Media
  {
    name: "9:16",
    label: "Story / Reels / TikTok",
    category: "Social Media",
    width: 540,
    height: 960,
    previewClass: "aspect-[9/16]",
  },
  {
    name: "1:1",
    label: "Square Post",
    category: "Social Media",
    width: 600,
    height: 600,
    previewClass: "aspect-square",
  },
  {
    name: "4:5",
    label: "Instagram Portrait",
    category: "Social Media",
    width: 540,
    height: 675,
    previewClass: "aspect-[4/5]",
  },
  {
    name: "3:1",
    label: "X / Twitter Banner",
    category: "Social Media",
    width: 900,
    height: 300,
    previewClass: "aspect-[3/1]",
  },
  {
    name: "2:1",
    label: "X / Twitter Post",
    category: "Social Media",
    width: 800,
    height: 400,
    previewClass: "aspect-[2/1]",
  },
  {
    name: "2:3",
    label: "Pinterest Pin",
    category: "Social Media",
    width: 600,
    height: 900,
    previewClass: "aspect-[2/3]",
  },
  {
    name: "1.91:1",
    label: "LinkedIn Share",
    category: "Social Media",
    width: 800,
    height: 419,
    previewClass: "aspect-[1.91/1]",
  },

  // Design & Standard
  {
    name: "4:3",
    label: "iPad",
    category: "Design & Standard",
    width: 800,
    height: 600,
    previewClass: "aspect-[4/3]",
  },
  {
    name: "3:4",
    label: "Portrait Tablet",
    category: "Design & Standard",
    width: 600,
    height: 800,
    previewClass: "aspect-[3/4]",
  },
  {
    name: "3:2",
    label: "Dribbble / 35mm Photo",
    category: "Design & Standard",
    width: 900,
    height: 600,
    previewClass: "aspect-[3/2]",
  },
  {
    name: "5:4",
    label: "Standard Monitor",
    category: "Design & Standard",
    width: 750,
    height: 600,
    previewClass: "aspect-[5/4]",
  },
];

export const CODE_THEMES = [
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    bg: "#1a1b26",
    text: "#a9b1d6",
    keyword: "#bb9af7",
    string: "#9ece6a",
    comment: "#565f89",
    number: "#ff9e64",
    function: "#7aa2f7",
    border: "rgba(255, 255, 255, 0.08)",
  },
  {
    id: "one-dark",
    name: "One Dark Pro",
    bg: "#282c34",
    text: "#abb2bf",
    keyword: "#c678dd",
    string: "#98c379",
    comment: "#5c6370",
    number: "#d19a66",
    function: "#61afef",
    border: "rgba(255, 255, 255, 0.08)",
  },
  {
    id: "dracula",
    name: "Dracula",
    bg: "#282a36",
    text: "#f8f8f2",
    keyword: "#ff79c6",
    string: "#f1fa8c",
    comment: "#6272a4",
    number: "#bd93f9",
    function: "#50fa7b",
    border: "rgba(255, 255, 255, 0.08)",
  },
  {
    id: "github-dark",
    name: "GitHub Dark",
    bg: "#0d1117",
    text: "#c9d1d9",
    keyword: "#ff7b72",
    string: "#a5d6ff",
    comment: "#8b949e",
    number: "#79c0ff",
    function: "#d2a8ff",
    border: "rgba(255, 255, 255, 0.12)",
  },
  {
    id: "monokai",
    name: "Monokai Pro",
    bg: "#2d2a2e",
    text: "#fcfcfa",
    keyword: "#ff6188",
    string: "#ffd866",
    comment: "#727072",
    number: "#ab9df2",
    function: "#a9dc76",
    border: "rgba(255, 255, 255, 0.08)",
  },
];

export interface WindowFramePreset {
  id: "macos" | "windows" | "classic" | "browser" | "minimal";
  name: string;
  description: string;
}

export const WINDOW_FRAME_PRESETS: WindowFramePreset[] = [
  { id: "macos", name: "macOS", description: "Traffic lights" },
  { id: "windows", name: "Windows 11", description: "Modern min/max/close" },
  { id: "classic", name: "Classic 95", description: "Retro 3D buttons" },
  { id: "browser", name: "Browser", description: "Address bar pill" },
  { id: "minimal", name: "Minimal", description: "Terminal prompt" },
];

export const FONT_FAMILIES = [
  "Inter",
  "Manrope",
  "Space Grotesk",
  "Roboto",
  "Instrument Serif",
  "Poppins",
  "Playfair Display",
  "Oswald",
  "Montserrat",
  "Arial",
  "Impact",
  "Courier",
];

export const FONT_WEIGHTS = [
  { value: "100", label: "Thin" },
  { value: "200", label: "Extra Light" },
  { value: "300", label: "Light" },
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "bold", label: "Bold" },
  { value: "800", label: "Extra Bold" },
];

export const TEXT_EFFECTS = [
  { name: "Outline", value: "outline" },
  { name: "Underline", value: "underline" },
  { name: "Strikethrough", value: "line-through" },
  { name: "Italic", value: "italic" },
  { name: "Uppercase", value: "uppercase" },
  { name: "Small Caps", value: "small-caps" },
  { name: "Blur", value: "blur" },
];

export const WRITING_MODES = [
  { id: "horizontal", name: "Horizontal", arrow: "→", css: "horizontal-tb", orientation: "mixed" },
  { id: "vertical", name: "Vertical (Down)", arrow: "↓", css: "vertical-rl", orientation: "mixed" },
  { id: "vertical-upright", name: "Vertical (Upright)", arrow: "⇊", css: "vertical-rl", orientation: "upright" },
];

export const CLIP_PATHS = [
  { name: "None", value: "none" },
  { name: "Circle", value: "circle(50% at 50% 50%)" },
  { name: "Ellipse", value: "ellipse(50% 50% at 50% 50%)" },
  { name: "Triangle", value: "polygon(50% 0%, 0% 100%, 100% 100%)" },
  { name: "Diamond", value: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" },
  {
    name: "Pentagon",
    value: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
  },
  {
    name: "Hexagon",
    value: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
  },
  {
    name: "Octagon",
    value: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
  },
  {
    name: "Star",
    value: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
  },
  {
    name: "Message",
    value: "polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)",
  },
];

export const TRANSFORM_3D_PRESETS = [
  { id: "flat", name: "Flat", rotateX: 0, rotateY: 0, rotate: 0 },
  { id: "tilt-left", name: "Tilt Left", rotateX: 10, rotateY: -20, rotate: 2 },
  { id: "tilt-right", name: "Tilt Right", rotateX: 10, rotateY: 20, rotate: -2 },
  { id: "isometric-l", name: "Iso Left", rotateX: 30, rotateY: -30, rotate: 0 },
  { id: "isometric-r", name: "Iso Right", rotateX: 30, rotateY: 30, rotate: 0 },
  { id: "top-down", name: "Top Down", rotateX: 35, rotateY: 0, rotate: 0 },
  { id: "front-tilt", name: "Front Tilt", rotateX: -20, rotateY: 0, rotate: 0 },
  { id: "dramatic", name: "Dramatic", rotateX: 25, rotateY: -35, rotate: 10 },
  { id: "floating", name: "Floating", rotateX: 15, rotateY: -15, rotate: 5 },
];

export const SHADOW_PRESETS = [
  { name: "None", value: "none" },
  { name: "Small", value: "0 1px 2px 0 rgb(0 0 0 / 0.15)" },
  {
    name: "Medium",
    value: "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -1px rgb(0 0 0 / 0.1)",
  },
  {
    name: "Large",
    value:
      "0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -2px rgb(0 0 0 / 0.08)",
  },
  {
    name: "Left",
    value:
      "-8px 0 15px -3px rgb(0 0 0 / 0.5), -4px 0 6px -2px rgb(0 0 0 / 0.08)",
  },
  {
    name: "Right",
    value: "8px 0 15px -3px rgb(0 0 0 / 0.5), 4px 0 6px -2px rgb(0 0 0 / 0.08)",
  },
  {
    name: "XL",
    value:
      "0 20px 25px -5px rgb(0 0 0 / 0.7), 0 10px 10px -5px rgb(0 0 0 / 0.06)",
  },
  {
    name: "L Bottom",
    value:
      "-12px 12px 25px -5px rgb(0 0 0 / 0.7), -6px 6px 10px -5px rgb(0 0 0 / 0.06)",
  },
  {
    name: "R Bottom",
    value:
      "12px 12px 25px -5px rgb(0 0 0 / 0.7), 6px 6px 10px -5px rgb(0 0 0 / 0.06)",
  },
  { name: "2XL", value: "0 50px 50px -12px rgb(0 0 0 / 0.9)" },
];

export const COLOR_PALETTES = {
  sunset: ["#FF6B6B", "#FF8E53", "#FEE440", "#F72585", "#B5179E"],
  ocean: ["#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8", "#023E8A"],
  forest: ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2"],
  purple: ["#7209B7", "#9D4EDD", "#C77DFF", "#E0AAFF", "#F72585"],
  fire: ["#FF0000", "#FF6B35", "#F7931E", "#FDC500", "#FFFF3F"],
  candy: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF"],
  neon: ["#FF006E", "#FFBE0B", "#06FFA5", "#3A86FF", "#8338EC"],
  pastel: ["#FFD6E8", "#FFADD2", "#FFC6FF", "#E7C6FF", "#C8B6FF"],
  monochrome: ["#1a1a1a", "#2d2d2d", "#404040", "#595959", "#737373"],
  warm: ["#FF9E00", "#FF6B35", "#F7931E", "#FDC500", "#FFBE0B"],
  cool: ["#4361EE", "#3F37C9", "#4895EF", "#4CC9F0", "#7209B7"],
  earth: ["#606C38", "#283618", "#BC6C25", "#DDA15E", "#FEFAE0"],
  midnight: ["#0a0e27", "#1a1b41", "#240046", "#3c096c", "#10002b"],
  deepSpace: ["#020202", "#090909", "#0d0d0d", "#1a1a2e", "#16213e"],
  darkForest: ["#0b1d0e", "#1a2f1e", "#1e3a2a", "#234f3a", "#2d5f4a"],
  darkOcean: ["#001219", "#005f73", "#0a1628", "#001d3d", "#003566"],
  vampireBlack: ["#090909", "#131313", "#1a1a1a", "#202020", "#2b2b2b"],
  gothicPurple: ["#1a0033", "#2d004d", "#4a0080", "#6600cc", "#33006f"],
  bloodMoon: ["#1a0000", "#330000", "#4d0000", "#660000", "#800000"],
  deepTeal: ["#002b36", "#073642", "#0f4c5c", "#1b6378", "#2a7a8f"],
};

export const PRESET_GRADIENTS = [
  {
    name: "Ocean",
    value:
      "radial-gradient(at 0% 0%, #0077b6 0px, transparent 70%), radial-gradient(at 100% 0%, #00b4d8 0px, transparent 70%), radial-gradient(at 100% 100%, #90e0ef 0px, transparent 70%), radial-gradient(at 0% 100%, #023e8a 0px, transparent 70%)",
  },
  {
    name: "Forest",
    value:
      "radial-gradient(at 0% 0%, #2d6a4f 0px, transparent 70%), radial-gradient(at 100% 0%, #40916c 0px, transparent 70%), radial-gradient(at 100% 100%, #74c69d 0px, transparent 70%), radial-gradient(at 0% 100%, #52b788 0px, transparent 70%)",
  },
  {
    name: "Purple Dream",
    value:
      "radial-gradient(at 0% 0%, #7209b7 0px, transparent 70%), radial-gradient(at 100% 0%, #9d4edd 0px, transparent 70%), radial-gradient(at 100% 100%, #e0aaff 0px, transparent 70%), radial-gradient(at 0% 100%, #c77dff 0px, transparent 70%)",
  },
  {
    name: "Fire",
    value:
      "radial-gradient(at 0% 0%, #ff0000 0px, transparent 70%), radial-gradient(at 100% 0%, #ff6b35 0px, transparent 70%), radial-gradient(at 100% 100%, #fdc500 0px, transparent 70%), radial-gradient(at 0% 100%, #f7931e 0px, transparent 70%)",
  },
  {
    name: "Candy",
    value:
      "radial-gradient(at 0% 0%, #ff006e 0px, transparent 70%), radial-gradient(at 100% 0%, #fb5607 0px, transparent 70%), radial-gradient(at 100% 100%, #ffbe0b 0px, transparent 70%), radial-gradient(at 0% 100%, #8338ec 0px, transparent 70%)",
  },
  {
    name: "Neon",
    value:
      "radial-gradient(at 0% 0%, #ff006e 0px, transparent 70%), radial-gradient(at 100% 0%, #06ffa5 0px, transparent 70%), radial-gradient(at 100% 100%, #3a86ff 0px, transparent 70%), radial-gradient(at 0% 100%, #ffbe0b 0px, transparent 70%)",
  },
  {
    name: "Mint Fresh",
    value:
      "radial-gradient(at 0% 0%, #06ffa5 0px, transparent 70%), radial-gradient(at 100% 0%, #4cc9f0 0px, transparent 70%), radial-gradient(at 100% 100%, #90e0ef 0px, transparent 70%), radial-gradient(at 0% 100%, #52b788 0px, transparent 70%)",
  },
  {
    name: "Rose Gold",
    value:
      "radial-gradient(at 0% 0%, #ff006e 0px, transparent 70%), radial-gradient(at 100% 0%, #ffbe0b 0px, transparent 70%), radial-gradient(at 100% 100%, #ffd6e8 0px, transparent 70%), radial-gradient(at 0% 100%, #ffc6ff 0px, transparent 70%)",
  },
  {
    name: "Midnight",
    value:
      "radial-gradient(at 0% 0%, #1a1a2e 0px, transparent 70%), radial-gradient(at 100% 0%, #16213e 0px, transparent 70%), radial-gradient(at 100% 100%, #0f3460 0px, transparent 70%), radial-gradient(at 0% 100%, #533483 0px, transparent 70%)",
  },
  {
    name: "Tropical",
    value:
      "radial-gradient(at 0% 0%, #06ffa5 0px, transparent 70%), radial-gradient(at 100% 0%, #ffbe0b 0px, transparent 70%), radial-gradient(at 100% 100%, #ff006e 0px, transparent 70%), radial-gradient(at 0% 100%, #3a86ff 0px, transparent 70%)",
  },
  {
    name: "Lavender",
    value:
      "radial-gradient(at 0% 0%, #9d4edd 0px, transparent 70%), radial-gradient(at 100% 0%, #c77dff 0px, transparent 70%), radial-gradient(at 100% 100%, #e0aaff 0px, transparent 70%), radial-gradient(at 0% 100%, #7209b7 0px, transparent 70%)",
  },
  {
    name: "Coral Reef",
    value:
      "radial-gradient(at 0% 0%, #ff6b6b 0px, transparent 70%), radial-gradient(at 100% 0%, #4ecdc4 0px, transparent 70%), radial-gradient(at 100% 100%, #ffe66d 0px, transparent 70%), radial-gradient(at 0% 100%, #ff006e 0px, transparent 70%)",
  },
  {
    name: "Peachy",
    value:
      "radial-gradient(at 0% 0%, #ffadad 0px, transparent 70%), radial-gradient(at 100% 0%, #ffd6a5 0px, transparent 70%), radial-gradient(at 100% 100%, #fdffb6 0px, transparent 70%), radial-gradient(at 0% 100%, #caffbf 0px, transparent 70%)",
  },
  {
    name: "Midnight Blue",
    value:
      "radial-gradient(at 0% 0%, #0a0e27 0px, transparent 70%), radial-gradient(at 100% 0%, #1a1b41 0px, transparent 70%), radial-gradient(at 100% 100%, #3c096c 0px, transparent 70%), radial-gradient(at 0% 100%, #240046 0px, transparent 70%)",
  },
  {
    name: "Deep Space",
    value:
      "radial-gradient(at 0% 0%, #020202 0px, transparent 70%), radial-gradient(at 100% 0%, #0d0d0d 0px, transparent 70%), radial-gradient(at 100% 100%, #1a1a2e 0px, transparent 70%), radial-gradient(at 0% 100%, #16213e 0px, transparent 70%)",
  },
  {
    name: "Gothic Purple",
    value:
      "radial-gradient(at 0% 0%, #1a0033 0px, transparent 70%), radial-gradient(at 100% 0%, #2d004d 0px, transparent 70%), radial-gradient(at 100% 100%, #6600cc 0px, transparent 70%), radial-gradient(at 0% 100%, #4a0080 0px, transparent 70%)",
  },
  {
    name: "Blood Moon",
    value:
      "radial-gradient(at 0% 0%, #1a0000 0px, transparent 70%), radial-gradient(at 100% 0%, #330000 0px, transparent 70%), radial-gradient(at 100% 100%, #660000 0px, transparent 70%), radial-gradient(at 0% 100%, #4d0000 0px, transparent 70%)",
  },
  {
    name: "Dark Forest",
    value:
      "radial-gradient(at 0% 0%, #0b1d0e 0px, transparent 70%), radial-gradient(at 100% 0%, #1a2f1e 0px, transparent 70%), radial-gradient(at 100% 100%, #234f3a 0px, transparent 70%), radial-gradient(at 0% 100%, #1e3a2a 0px, transparent 70%)",
  },
  {
    name: "Dark Ocean",
    value:
      "radial-gradient(at 0% 0%, #001219 0px, transparent 70%), radial-gradient(at 100% 0%, #0a1628 0px, transparent 70%), radial-gradient(at 100% 100%, #003566 0px, transparent 70%), radial-gradient(at 0% 100%, #001d3d 0px, transparent 70%)",
  },
  {
    name: "Vampire Night",
    value:
      "radial-gradient(at 0% 0%, #090909 0px, transparent 70%), radial-gradient(at 100% 0%, #131313 0px, transparent 70%), radial-gradient(at 100% 100%, #202020 0px, transparent 70%), radial-gradient(at 0% 100%, #1a1a1a 0px, transparent 70%)",
  },
  {
    name: "Deep Teal",
    value:
      "radial-gradient(at 0% 0%, #002b36 0px, transparent 70%), radial-gradient(at 100% 0%, #073642 0px, transparent 70%), radial-gradient(at 100% 100%, #1b6378 0px, transparent 70%), radial-gradient(at 0% 100%, #0f4c5c 0px, transparent 70%)",
  },
  {
    name: "Shadow Realm",
    value:
      "radial-gradient(at 0% 0%, #0f0c29 0px, transparent 70%), radial-gradient(at 100% 0%, #302b63 0px, transparent 70%), radial-gradient(at 100% 100%, #24243e 0px, transparent 70%), radial-gradient(at 0% 100%, #1a1a2e 0px, transparent 70%)",
  },
  {
    name: "Dark Matter",
    value:
      "radial-gradient(at 0% 0%, #10002b 0px, transparent 70%), radial-gradient(at 100% 0%, #240046 0px, transparent 70%), radial-gradient(at 100% 100%, #3c096c 0px, transparent 70%), radial-gradient(at 0% 100%, #5a189a 0px, transparent 70%)",
  },
  {
    name: "Obsidian",
    value:
      "radial-gradient(at 0% 0%, #000000 0px, transparent 70%), radial-gradient(at 100% 0%, #0d0d0d 0px, transparent 70%), radial-gradient(at 100% 100%, #1a1a1a 0px, transparent 70%), radial-gradient(at 0% 100%, #262626 0px, transparent 70%)",
  },
  {
    name: "Abyss",
    value:
      "radial-gradient(at 0% 0%, #001219 0px, transparent 70%), radial-gradient(at 100% 0%, #005f73 0px, transparent 70%), radial-gradient(at 100% 100%, #0a1628 0px, transparent 70%), radial-gradient(at 0% 100%, #003566 0px, transparent 70%)",
  },
];

export interface GradientDirectionOption {
  id: string;
  name: string;
  tailwind: string;
  css: string;
  arrow: string;
}

export const GRADIENT_DIRECTIONS: GradientDirectionOption[] = [
  { id: "to-b", name: "To Bottom", tailwind: "to-b", css: "to bottom", arrow: "↓" },
  { id: "to-r", name: "To Right", tailwind: "to-r", css: "to right", arrow: "→" },
  { id: "to-br", name: "To Bottom Right", tailwind: "to-br", css: "to bottom right", arrow: "↘" },
  { id: "to-tr", name: "To Top Right", tailwind: "to-tr", css: "to top right", arrow: "↗" },
  { id: "to-t", name: "To Top", tailwind: "to-t", css: "to top", arrow: "↑" },
  { id: "to-l", name: "To Left", tailwind: "to-l", css: "to left", arrow: "←" },
  { id: "to-bl", name: "To Bottom Left", tailwind: "to-bl", css: "to bottom left", arrow: "↙" },
  { id: "to-tl", name: "To Top Left", tailwind: "to-tl", css: "to top left", arrow: "↖" },
];

export interface GradientPresetOption {
  name: string;
  from: string;
  via: string;
  to: string;
}

export const TEXT_GRADIENT_PRESETS: GradientPresetOption[] = [
  { name: "Silver", from: "#ffffff", via: "#cbd5e1", to: "#64748b" },
  { name: "Gold", from: "#fef08a", via: "#eab308", to: "#a16207" },
  { name: "Sunset", from: "#ff7e5f", via: "#feb47b", to: "#ff6e7f" },
  { name: "Cyber", from: "#00dfd8", via: "#7928ca", to: "#ff007f" },
  { name: "Neon Cyan", from: "#00f2fe", via: "#38bdf8", to: "#2563eb" },
  { name: "Purple", from: "#e879f9", via: "#c084fc", to: "#6366f1" },
  { name: "Emerald", from: "#86efac", via: "#22c55e", to: "#047857" },
  { name: "Flame", from: "#fde047", via: "#fb923c", to: "#dc2626" },
  { name: "Monochrome", from: "#ffffff", via: "#a1a1aa", to: "#27272a" },
  { name: "Prism", from: "#38bdf8", via: "#818cf8", to: "#c084fc" },
  { name: "Rose Gold", from: "#ffe4e6", via: "#f43f5e", to: "#881337" },
  { name: "Cosmic", from: "#67e8f9", via: "#a855f7", to: "#ec4899" },
];

export const BACKGROUND_GRADIENT_PRESETS: GradientPresetOption[] = [
  { name: "Dark Velvet", from: "#27272a", via: "#18181b", to: "#09090b" },
  { name: "Slate Glass", from: "#475569", via: "#1e293b", to: "#0f172a" },
  { name: "Midnight", from: "#312e81", via: "#1e1b4b", to: "#0f172a" },
  { name: "Crimson Glow", from: "#881337", via: "#4c0519", to: "#1c0a00" },
  { name: "Emerald Depth", from: "#065f46", via: "#064e3b", to: "#022c22" },
  { name: "Purple Twilight", from: "#581c87", via: "#3b0764", to: "#110726" },
  { name: "Cyber Dusk", from: "#1e1b4b", via: "#0f172a", to: "#3b0764" },
  { name: "Deep Amber", from: "#78350f", via: "#451a03", to: "#180a02" },
  { name: "Abyss Noir", from: "#18181b", via: "#09090b", to: "#000000" },
  { name: "Ocean Deep", from: "#0f3460", via: "#16213e", to: "#1a1a2e" },
];

export interface DitherColorPreset {
  name: string;
  front: string;
  back: string;
}

export const DITHER_COLOR_PRESETS: DitherColorPreset[] = [
  { name: "Mono", front: "#ffffff", back: "#000000" },
  { name: "GameBoy", front: "#9bbc0f", back: "#0f380f" },
  { name: "Cyber", front: "#00f0ff", back: "#ff007f" },
  { name: "Matrix", front: "#00ff66", back: "#041508" },
  { name: "Amber", front: "#ffb300", back: "#180b00" },
  { name: "Sepia", front: "#f6ecd4", back: "#2d1e16" },
  { name: "Blueprint", front: "#d6f5ff", back: "#0a1936" },
  { name: "Solar", front: "#ffd000", back: "#2d0606" },
  { name: "Vaporwave", front: "#d8b4fe", back: "#1e0b36" },
  { name: "Emerald", front: "#a7f3d0", back: "#062b1b" },
  { name: "Crimson", front: "#ff4d6d", back: "#1c0409" },
  { name: "Nordic", front: "#e0f2fe", back: "#0f172a" },
  { name: "Champagne", front: "#fde68a", back: "#18181b" },
  { name: "Bubblegum", front: "#f472b6", back: "#2e0821" },
  { name: "Risograph", front: "#0077c8", back: "#fff8f0" },
];