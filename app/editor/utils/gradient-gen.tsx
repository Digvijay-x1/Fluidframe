import { MESH_PALETTES, COLOR_PALETTES } from "../values";

// Curated library of 30+ stunning artistic 5-color mesh schemes
const CURATED_RANDOM_MESH_PALETTES: string[][] = [
  ["#ff007f", "#7928ca", "#0070f3", "#00dfd8", "#ffbe0b"], // Cyberpunk
  ["#ff416c", "#ff4b2b", "#ffb347", "#f72585", "#7209b7"], // Sunset Silk
  ["#0575e6", "#00f260", "#059669", "#10b981", "#022c22"], // Aurora
  ["#090a0f", "#18132e", "#241a4a", "#3b1e70", "#120a21"], // Velvet Noir
  ["#ff71ce", "#01cdfe", "#05ffa1", "#b967ff", "#fffb96"], // Vaporwave
  ["#ffcbf2", "#f3c4fb", "#c8b6ff", "#b8c0ff", "#ffd6a5"], // Pastel Dream
  ["#ff0844", "#ffb199", "#f12711", "#f5af19", "#ff4e50"], // Solar Flare
  ["#020b14", "#0a2540", "#004b79", "#0077b6", "#00f2fe"], // Deep Ocean
  ["#2b1055", "#7597de", "#b537f2", "#f72585", "#ffbe0b"], // Synthwave
  ["#00ff87", "#60efff", "#0061ff", "#0e0728", "#120a21"], // Electric Mint
  ["#080114", "#2e0854", "#8c1bab", "#f72585", "#ffd166"], // Tokyo Midnight
  ["#03071e", "#370617", "#6a040f", "#9d0208", "#dc2f02"], // Inferno
  ["#0f172a", "#1e293b", "#334155", "#475569", "#94a3b8"], // Slate Obsidian
  ["#22577a", "#38a3a5", "#57cc99", "#80ed99", "#c7f9cc"], // Emerald Coast
  ["#f72585", "#b5179e", "#7209b7", "#560bad", "#480ca8"], // Purple Velvet
  ["#ff9a9e", "#fecfef", "#a1c4fd", "#c2e9fb", "#fdcbf1"], // Cotton Candy
  ["#11998e", "#38ef7d", "#10b981", "#047857", "#064e3b"], // Matrix Bio
  ["#fd746c", "#ff9068", "#ffbe0b", "#fb5607", "#ff006e"], // Warm Horizon
  ["#4158d0", "#c850c0", "#ffcc70", "#8ec5fc", "#e0c3fc"], // Prism Aurora
  ["#1f1c2c", "#928dab", "#e2d4f0", "#493240", "#000000"], // Metallic Dark
  ["#3a1c71", "#d76d77", "#ffaf7b", "#e056fd", "#686de0"], // Twilight
  ["#0f2027", "#203a43", "#2c5364", "#00c9ff", "#92fe9d"], // Deep Sea Glow
  ["#ff4e50", "#f9d423", "#ff6b6b", "#4ecdc4", "#ffe66d"], // Miami Punch
  ["#240046", "#3c096c", "#5a189a", "#7b2cbf", "#9d4edd"], // Nebula Royal
];

// Helper: HSL to Hex
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Generate procedurally harmonic 5-color palette
function generateProceduralPalette(): string[] {
  const baseHue = Math.floor(Math.random() * 360);
  const schemeType = Math.floor(Math.random() * 5);
  const colors: string[] = [];

  switch (schemeType) {
    case 0: {
      for (let i = 0; i < 5; i++) {
        const hue = (baseHue + i * 28) % 360;
        const sat = 70 + (i % 3) * 12;
        const lit = 25 + i * 14;
        colors.push(hslToHex(hue, sat, lit));
      }
      break;
    }
    case 1: {
      const h1 = baseHue;
      const h2 = (baseHue + 120) % 360;
      const h3 = (baseHue + 240) % 360;
      colors.push(hslToHex(h1, 85, 30));
      colors.push(hslToHex(h1, 90, 55));
      colors.push(hslToHex(h2, 85, 60));
      colors.push(hslToHex(h3, 95, 65));
      colors.push(hslToHex(h2, 80, 85));
      break;
    }
    case 2: {
      const h1 = baseHue;
      const h2 = (baseHue + 150) % 360;
      const h3 = (baseHue + 210) % 360;
      colors.push(hslToHex(h1, 90, 20));
      colors.push(hslToHex(h1, 80, 50));
      colors.push(hslToHex(h2, 85, 60));
      colors.push(hslToHex(h3, 90, 70));
      colors.push(hslToHex(baseHue, 95, 85));
      break;
    }
    case 3: {
      const sat = 95;
      for (let i = 0; i < 5; i++) {
        const hue = (baseHue + i * 72) % 360;
        const lit = 45 + (i % 2) * 20;
        colors.push(hslToHex(hue, sat, lit));
      }
      break;
    }
    case 4:
    default: {
      colors.push(hslToHex(baseHue, 80, 10));
      colors.push(hslToHex((baseHue + 40) % 360, 85, 25));
      colors.push(hslToHex((baseHue + 120) % 360, 90, 50));
      colors.push(hslToHex((baseHue + 180) % 360, 95, 65));
      colors.push(hslToHex((baseHue + 240) % 360, 90, 80));
      break;
    }
  }

  return colors;
}

export function generateRandomMeshColors(): string[] {
  if (Math.random() > 0.4) {
    const palette =
      CURATED_RANDOM_MESH_PALETTES[
        Math.floor(Math.random() * CURATED_RANDOM_MESH_PALETTES.length)
      ];
    return [...palette];
  }
  return generateProceduralPalette();
}

export function generateRandomGradient(): string {
  const paletteNames = Object.keys(COLOR_PALETTES) as Array<
    keyof typeof COLOR_PALETTES
  >;

  const randomPalette =
    paletteNames[Math.floor(Math.random() * paletteNames.length)];
  const colors = COLOR_PALETTES[randomPalette];

  const numColors = 3 + Math.floor(Math.random() * 2);
  const selectedColors = [];

  for (let i = 0; i < numColors; i++) {
    selectedColors.push(colors[Math.floor(Math.random() * colors.length)]);
  }

  return createMeshGradient(selectedColors);
}

export function createMeshGradient(colors: string[]): string {
  const positions = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 0, y: 100 },
    { x: 100, y: 100 },
  ];

  const gradientStops = colors.map((color, index) => {
    const pos = positions[index % positions.length];
    return `radial-gradient(at ${pos.x}% ${pos.y}%, ${color} 0px, transparent 70%)`;
  });

  return gradientStops.join(", ");
}
