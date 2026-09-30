<div align="center">

# 🎨 Fluidframe

### **The Web-First Visual Studio for Modern Creators**

Design high-impact 3D device mockups, real-time WebGL fluid mesh gradients, retro Bayer dither shaders, and render studio-grade 60 FPS MP4 videos & 4K snapshots directly in your browser — with zero server lag and 100% privacy.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![WebGL](https://img.shields.io/badge/WebGL-GLSL_Shaders-990000?style=flat-square&logo=webgl)](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
[![FFmpeg](https://img.shields.io/badge/FFmpeg-WASM_Client--Side-007808?style=flat-square&logo=ffmpeg)](https://ffmpegwasm.netlify.app/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=flat-square)](LICENSE)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/Digvijay-x1/Fluidframe?utm_source=oss&utm_medium=github&utm_campaign=Digvijay-x1%2FFluidframe&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
[![Live Demo](https://img.shields.io/badge/Live_Demo-fluidframe.vercel.app-emerald?style=flat-square&logo=vercel)](https://fluidframe.vercel.app)

[**Explore Live Demo (fluidframe.vercel.app)**](https://fluidframe.vercel.app) • [**Launch Editor**](https://fluidframe.vercel.app/editor) • [**Report Bug**](https://github.com/Digvijay-x1/fluidframe/issues)

<br/>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/editor-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="public/editor-light.png">
  <img alt="Fluidframe Visual Studio Workspace" src="public/editor-dark.png" width="100%" style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.4);" />
</picture>

</div>

---

## 🌟 Why Fluidframe?

Most graphic design tools are either too basic or weighed down by bulky timelines, expensive subscriptions, and slow cloud rendering queues.

**Fluidframe** brings GPU-accelerated graphic design and video rendering straight into the browser:

- 🚀 **100% Client-Side & Private**: All WebGL rendering, dither calculations, and video transcoding happen directly on your machine via WebAssembly. Your images never leave your browser.
- ⚡ **Instant Workflow**: Zero setup, no account barrier, no paywalls. Open the editor and start crafting immediately.
- 🎬 **Broadcast-Quality Exports**: Export crisp **60 FPS MP4** videos, optimized **GIFs**, and Retina **PNG / JPEG / SVG** graphics in seconds.

---

## ✨ Core Features & Superpowers

### 🌊 1. Fluid WebGL Mesh Gradient Engine

- **Hardware-Accelerated GLSL Shaders**: Real-time multi-color fluid gradient synthesis running on custom vertex & fragment shaders.
- **5-Point Fluid Color Mixing**: Blend rich color harmonies with dynamic wave speed, frequency, noise intensity, and grain controls.
- **Curated Palette Library**: One-click presets (_Chrome_, _Sunset Silk_, _Aurora_, _Velvet Noir_, _Vaporwave_, _Solar Flare_, _Deep Ocean_).
- **Interactive Shader Animation**: Play, pause, or adjust animation speed on the fly with live canvas playback.

### 👾 2. Multi-Algorithm Dithering & Pixel Studio

- **Retro Shader Pipeline**: Transform any image layer or canvas background into stylized retro computer graphics.
- **Multiple Dither Modes**: Ordered Bayer matrices (**2x2**, **4x4**, **8x8**), Floyd-Steinberg, Atkinson, and Halftone / Noise dithering.
- **Custom Dual-Tone Color Mapping**: Map shadows and highlights to custom foreground and background colors with adjustable color steps and pixel scale.

### 📱 3. 3D Perspective Device Mockup Studio

- **True 3D Transforms**: Full 3-axis rotation (`rotateX`, `rotateY`, `rotateZ`) to create isometric and perspective product showcases.
- **Device Clip Paths & Mockups**: One-click device frames (Mobile Screen, Browser Window, Pill, Diamond, Hexagon, Polygon).
- **Studio Glassmorphism**: Realistic frosted glass backdrops with customizable blur radii and translucent specular borders.
- **Studio Lighting & Shadows**: Layer shadow presets (Soft, Floating, 3D Elevation, Dramatic Neon Glow) with custom color, offset, and spread.

### ✍️ 4. Advanced Typography & Vector Overlays

- **13+ Premium Google Fonts**: Curated modern typography (_Inter_, _Manrope_, _Geist_, _Space Grotesk_, _Instrument Serif_, _Poppins_, _Playfair Display_, _Oswald_, _Montserrat_).
- **Multi-Stop Text Gradients**: Linear gradient typography with customizable directions (`to right`, `to bottom`, `to bottom right`, etc.) and multi-stop color accents.
- **Text Box Embellishments**: Pill background badges, glassmorphic labels, border strokes, and vertical text writing modes.
- **Vector Pattern Overlays**: Crisp vector patterns (Isometric Grid, Blueprint, Cross Grid, Dots, Diagonal Stripes) with custom color and opacity.
- **Studio Texture Overlays**: Realistic tactile overlays (Grain, Noise, Paper, Grunge, Scanlines, Dust).

### 🎞️ 5. In-Browser WASM FFmpeg Video & Animation Export

- **No Cloud Queue**: Utilizes client-side `@ffmpeg/ffmpeg` compiled to WebAssembly with dedicated Web Worker processing.
- **MP4 Video Export (H.264)**: Export smooth animated WebGL canvas videos with custom durations (3–10s) and frame rates (30 / 60 FPS).
- **Optimized GIF Export**: Generates high-quality animated GIFs with smart palette quantization.
- **Retina Image Snapshots**: Crisp static exports in **PNG**, **JPEG**, and **SVG** at 1x, 2x, or 4x pixel density.

### 🖼️ 6. Curated Asset Library (ImageKit Integration)

- **4K Wallpaper Hub**: High-definition abstract, dark, 3D, and minimal wallpapers available instantly inside the editor.
- **Meme & Sticker Vault**: Curated viral templates and stickers for fast social media content creation.

### ⚡ 7. Ergonomic Creator Experience

- **Smart Magnetic Snap Guides**: Automatic center and edge alignment guides for pixel-perfect positioning.
- **Multi-Layer Management**: Reorder layers with drag-and-drop, toggle visibility (show/hide), duplicate, and lock layers.
- **Canvas Zoom & Viewport**: Fit to screen, free zoom slider, and toggleable pixel grid background.
- **Full History Stack**: Instant undo (`Ctrl+Z`) and redo (`Ctrl+Y` / `Ctrl+Shift+Z`) for all canvas actions.
- **Dark & Light Mode**: Seamless theme switching with persistent user preference.

---

## ⌨️ Keyboard Shortcuts

| Shortcut                                                                          | Action                          |
| :-------------------------------------------------------------------------------- | :------------------------------ |
| <kbd>Ctrl</kbd> + <kbd>Z</kbd> / <kbd>Cmd</kbd> + <kbd>Z</kbd>                    | Undo last action                |
| <kbd>Ctrl</kbd> + <kbd>Y</kbd> / <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> | Redo action                     |
| <kbd>Ctrl</kbd> + <kbd>D</kbd> / <kbd>Cmd</kbd> + <kbd>D</kbd>                    | Duplicate selected layer        |
| <kbd>Delete</kbd> / <kbd>Backspace</kbd>                                          | Delete selected layer           |
| <kbd>Escape</kbd>                                                                 | Deselect active layer           |
| <kbd>S</kbd>                                                                      | Toggle magnetic snapping guides |
| <kbd>G</kbd>                                                                      | Toggle canvas alignment grid    |

---

## 🛠️ Architecture & Tech Stack

| Layer                    | Technology                                                                         | Description                                                |
| :----------------------- | :--------------------------------------------------------------------------------- | :--------------------------------------------------------- |
| **Framework**            | [Next.js 16 (App Router)](https://nextjs.org/)                                     | Turbo-packed React server components & client routing      |
| **UI Library**           | [React 19](https://react.dev/)                                                     | Concurrent UI rendering & state orchestration              |
| **Language**             | [TypeScript 5](https://www.typescriptlang.org/)                                    | Strict type safety across shaders, models, and stores      |
| **Styling**              | [Tailwind CSS v4](https://tailwindcss.com/)                                        | Modern CSS engine with `@tailwindcss/postcss`              |
| **Component Primitives** | [Radix UI](https://www.radix-ui.com/)                                              | Accessible tabs, popovers, dialogs, sliders, and switches  |
| **Animations**           | [Motion (Framer Motion)](https://motion.dev/)                                      | Smooth layout transitions, drawers, and gesture physics    |
| **State Management**     | [Zustand 5](https://github.com/pmndrs/zustand)                                     | Lightweight global canvas state with deep history tracking |
| **Graphics & Shaders**   | **WebGL (GLSL ES 1.0/3.0)**                                                        | High-performance custom shaders for fluid mesh gradients   |
| **Video Transcoding**    | [FFmpeg.wasm 0.12](https://ffmpegwasm.netlify.app/)                                | In-browser H.264 MP4 & GIF encoding via WebAssembly        |
| **Asset CDN**            | [ImageKit](https://imagekit.io/)                                                   | Fast cloud delivery of 4K wallpapers and meme assets       |
| **Database & ORM**       | [Prisma 7](https://www.prisma.io/) + [PostgreSQL](https://www.postgresql.org/)     | Ready for optional database integrations and presets       |
| **Icons**                | [Lucide React](https://lucide.dev/) & [Phosphor Icons](https://phosphoricons.com/) | Consistent, crisp iconography                              |

---

## 📂 Project Structure

```
fluidframe/
├── app/
│   ├── api/
│   │   └── imagekit/         # ImageKit asset endpoints (wallpapers, memes)
│   ├── editor/               # Visual Studio Editor
│   │   ├── components/
│   │   │   ├── canvas/       # WebGL canvas, image, text & vector layers
│   │   │   └── panels/       # Left sidebar, layer manager & right studio panel
│   │   ├── hooks/            # Selection, dragging & export hooks
│   │   ├── store/            # Zustand global canvas & history store
│   │   ├── utils/            # WebGL shader engine, dither engine & FFmpeg service
│   │   ├── types.ts          # Studio element & config interfaces
│   │   └── page.tsx          # Main editor workspace
│   ├── privacy/              # Privacy Policy page
│   ├── terms/                # Terms of Service page
│   ├── toc/                  # Terms & Conditions alias
│   ├── layout.tsx            # Root layout with Google Fonts & metadata
│   ├── manifest.ts           # Web App Manifest (PWA ready)
│   ├── robots.ts             # SEO robots rules
│   ├── sitemap.ts            # Dynamic XML sitemap
│   └── page.tsx              # High-conversion visual studio landing page
├── components/
│   ├── hero.tsx              # Hero showcase with live preview
│   ├── bentogrid.tsx         # Interactive feature demonstration cards
│   ├── landing/              # Interactive dither cursor & landing components
│   ├── navbar.tsx            # Smart scroll navbar
│   ├── footer.tsx            # Perspective grid footer
│   └── ui/                   # Accessible Radix UI components
├── lib/
│   ├── env.ts                # T3-OSS type-safe environment validator
│   └── utils.ts              # Class merging utilities
├── prisma/
│   ├── schema.prisma         # Prisma schema definition
│   └── migrations/           # Database migrations
└── public/
    ├── editor-dark.png       # Dark mode studio screenshot
    ├── editor-light.png      # Light mode studio screenshot
    └── ffmpeg/               # FFmpeg WebAssembly core binaries & worker
```

---

## 🚀 Getting Started

Use **Node 24.18.0** and **npm 11.16.0**. npm is the canonical package manager; commit `package-lock.json` when dependencies change. `.nvmrc` and `.node-version` pin the local/Actions runtime, and `package.json` restricts hosted builds to Node 24.

### 1. Clone and select the toolchain

```bash
git clone https://github.com/Digvijay-x1/fluidframe.git
cd fluidframe
nvm install
nvm use
npm install --global npm@11.16.0
```

An equivalent Node version manager can read `.node-version`. Vercel uses Node 24.x; its runtime patch is managed by the provider. The repository's `vercel.json` runs the pinned npm version with a frozen install. See [the toolchain guide](docs/toolchain.md) for Actions setup and hosted settings.

### 2. Install and validate

```bash
npm ci
npm run check
```

This is the clean-checkout CI sequence. `npm ci` rejects manifest/lockfile drift and generates Prisma's client without connecting to a database. `npm run check` runs lint, formatting, type generation/typecheck, unit tests, and the production build. The core editor needs no `.env`, database, or production credentials. Builds fetch Google Fonts over HTTPS.

Individual commands:

| Command                | Purpose                                                               |
| :--------------------- | :-------------------------------------------------------------------- |
| `npm run lint`         | Next.js, React, and TypeScript lint rules                             |
| `npm run format:check` | Check source and documentation formatting                             |
| `npm run format`       | Apply repository formatting                                           |
| `npm run typecheck`    | Generate Prisma and Next.js types, then run strict TypeScript         |
| `npm test`             | Run Vitest, including local draft recovery and environment validation |
| `npm run build`        | Compile and prerender the production app                              |

### 3. Configure optional integrations

For optional integrations, copy the template:

```bash
cp .env.example .env
```

| Variable                            | Requirement                                                                           |
| :---------------------------------- | :------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_APP_URL`               | Optional HTTP(S) application URL                                                      |
| `IMAGEKIT_ENABLED`                  | `true` to enable the wallpaper/meme APIs; defaults to `false`                         |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`   | Required when ImageKit is enabled                                                     |
| `IMAGEKIT_PRIVATE_KEY`              | Required when ImageKit is enabled; server only                                        |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | Required HTTP(S) endpoint when ImageKit is enabled                                    |
| `DATABASE_ENABLED`                  | `true` to validate configuration for optional future persistence; defaults to `false` |
| `DATABASE_URL`                      | Required PostgreSQL URL when database integration is enabled                          |
| `SKIP_ENV_VALIDATION`               | Only the exact value `true` bypasses validation; omit for normal builds               |

**Existing ImageKit deployments must add `IMAGEKIT_ENABLED=true`.** Disabled ImageKit endpoints return HTTP 503 without contacting the provider. The editor, local uploads, IndexedDB recovery, WebGL, and exports remain available without integrations. Database persistence is not currently used by any app route; `DATABASE_ENABLED` validates the intended configuration and does not add persistence.

An explicit environment check runs before development, type generation, and builds; API modules also validate on load. Missing credentials for enabled integrations and invalid URLs fail before deployment. Use separate preview credentials and set flags in the environment that builds the candidate; public variables are compiled into browser bundles.

### 4. Launch development or production

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), or [the editor](http://localhost:3000/editor).

```bash
npm run build
npm start
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Digvijay-x1/fluidframe/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **Apache 2.0 License**. See [`LICENSE`](LICENSE) for more information.

---

## 👨‍💻 Author & Acknowledgements

Created with ❤️ by **[Digvijay Rawat](https://github.com/Digvijay-x1)**

- Follow on X: [@DIGVIJAY__RAWAT](https://x.com/DIGVIJAY__RAWAT)
- GitHub: [Digvijay-x1](https://github.com/Digvijay-x1)

<div align="center">
  <sub>Built for creators, designers, and developers around the world.</sub>
</div>
