import { create } from "zustand";
import { EditorState, CanvasElement, CanvasDocument } from "../types";
import {
  ASPECT_RATIOS,
  DEFAULT_MESH_CONFIG,
  DEFAULT_OVERLAY_CONFIG,
} from "../values";

const DEFAULT_BG = "mesh";

const commitLayerToggle = (state: EditorState, elements: CanvasElement[]) => {
  const history = state.history.slice(0, state.historyIndex + 1);
  const currentDocument: CanvasDocument = {
    elements: state.elements,
    canvasBackground: state.canvasBackground,
    meshConfig: state.meshConfig,
    overlayConfig: state.overlayConfig,
    aspectRatio: state.aspectRatio,
  };
  const activeSnapshot = history[state.historyIndex];
  // Live edits such as keyboard nudges replace elements without recording history.
  // Preserve them as a separate step so undoing the toggle only reverts the toggle.
  if (
    currentDocument.elements !== activeSnapshot.elements ||
    currentDocument.canvasBackground !== activeSnapshot.canvasBackground ||
    currentDocument.meshConfig !== activeSnapshot.meshConfig ||
    currentDocument.overlayConfig !== activeSnapshot.overlayConfig ||
    currentDocument.aspectRatio !== activeSnapshot.aspectRatio
  ) {
    history.push(currentDocument);
  }
  history.push({ ...currentDocument, elements });
  return { elements, history, historyIndex: history.length - 1 };
};

const loadSavedPresets = (): EditorState["userPresets"] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("fluidframe_user_presets");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const createDefaultDocument = (): CanvasDocument => ({
  aspectRatio: {
    ...(ASPECT_RATIOS.find((r) => r.name === "16:9") || ASPECT_RATIOS[0]),
  },
  canvasBackground: DEFAULT_BG,
  meshConfig: {
    ...DEFAULT_MESH_CONFIG,
    colors: [...DEFAULT_MESH_CONFIG.colors],
  },
  overlayConfig: { ...DEFAULT_OVERLAY_CONFIG },
  elements: [],
});

export const useStore = create<EditorState>((set, get) => ({
  aspectRatio: ASPECT_RATIOS.find((r) => r.name === "16:9") || ASPECT_RATIOS[0],
  canvasBackground: DEFAULT_BG,
  meshConfig: { ...DEFAULT_MESH_CONFIG },
  overlayConfig: { ...DEFAULT_OVERLAY_CONFIG },
  elements: [],
  documentGeneration: 0,
  selectedElementId: null,
  isCropping: false,
  activeTab: "image",
  lastSelectedTextId: null,
  lastSelectedImageId: null,
  lastSelectedCodeId: null,
  userPresets: [],
  exportFormat: "mp4",
  exportQuality: "2",
  exportDuration: 3,
  exportFps: 60,
  history: [
    {
      elements: [],
      canvasBackground: DEFAULT_BG,
      meshConfig: { ...DEFAULT_MESH_CONFIG },
      overlayConfig: { ...DEFAULT_OVERLAY_CONFIG },
      aspectRatio:
        ASPECT_RATIOS.find((r) => r.name === "16:9") || ASPECT_RATIOS[0],
    },
  ],
  historyIndex: 0,

  setAspectRatio: (name) => {
    const ratio = ASPECT_RATIOS.find((r) => r.name === name);
    if (!ratio) return;
    set((state) => {
      const oldRatio = state.aspectRatio;
      if (oldRatio.width === ratio.width && oldRatio.height === ratio.height) {
        return { aspectRatio: ratio };
      }
      const deltaX = (ratio.width - oldRatio.width) / 2;
      const deltaY = (ratio.height - oldRatio.height) / 2;

      const newElements = state.elements.map((el) => ({
        ...el,
        position: {
          x: Math.round(el.position.x + deltaX),
          y: Math.round(el.position.y + deltaY),
        },
      }));

      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          elements: newElements,
          canvasBackground: state.canvasBackground,
          meshConfig: state.meshConfig,
          overlayConfig: state.overlayConfig,
          aspectRatio: ratio,
        },
      ];

      return {
        aspectRatio: ratio,
        elements: newElements,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  setCustomSize: (width, height) => {
    set((state) => {
      const oldRatio = state.aspectRatio;
      if (oldRatio.width === width && oldRatio.height === height) {
        return {};
      }
      const deltaX = (width - oldRatio.width) / 2;
      const deltaY = (height - oldRatio.height) / 2;

      const newElements = state.elements.map((el) => ({
        ...el,
        position: {
          x: Math.round(el.position.x + deltaX),
          y: Math.round(el.position.y + deltaY),
        },
      }));

      const newRatio = {
        name: "Custom",
        label: "Custom",
        category: "Custom" as const,
        width,
        height,
        previewClass: "aspect-auto",
      };

      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          elements: newElements,
          canvasBackground: state.canvasBackground,
          meshConfig: state.meshConfig,
          overlayConfig: state.overlayConfig,
          aspectRatio: newRatio,
        },
      ];

      return {
        aspectRatio: newRatio,
        elements: newElements,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  setBackground: (bg) => {
    set((state) => {
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          elements: state.elements,
          canvasBackground: bg,
          meshConfig: state.meshConfig,
          overlayConfig: state.overlayConfig,
          aspectRatio: state.aspectRatio,
        },
      ];
      return {
        canvasBackground: bg,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  setMeshConfig: (config) => {
    set((state) => {
      const newConfig = { ...state.meshConfig, ...config };
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          elements: state.elements,
          canvasBackground: state.canvasBackground,
          meshConfig: newConfig,
          overlayConfig: state.overlayConfig,
          aspectRatio: state.aspectRatio,
        },
      ];
      return {
        meshConfig: newConfig,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  setOverlayConfig: (config) => {
    set((state) => {
      const newConfig = { ...state.overlayConfig, ...config };
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          elements: state.elements,
          canvasBackground: state.canvasBackground,
          meshConfig: state.meshConfig,
          overlayConfig: newConfig,
          aspectRatio: state.aspectRatio,
        },
      ];
      return {
        overlayConfig: newConfig,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  setElements: (elements) => {
    set((state) => {
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          elements,
          canvasBackground: state.canvasBackground,
          meshConfig: state.meshConfig,
          overlayConfig: state.overlayConfig,
          aspectRatio: state.aspectRatio,
        },
      ];
      return {
        elements,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  setExportFormat: (format) =>
    set((state) => ({
      exportFormat: format,
      exportFps: format === "gif" ? 30 : state.exportFps,
    })),
  setExportQuality: (quality) => set({ exportQuality: quality }),
  setExportDuration: (duration) => set({ exportDuration: duration }),
  setExportFps: (fps) => set({ exportFps: fps }),

  setActiveTab: (tab) => {
    set((state) => {
      let newSelectedId = state.selectedElementId;

      if (tab === "text") {
        const currentEl = state.elements.find(
          (el) => el.id === state.selectedElementId,
        );
        const currentIsTextOrCode =
          currentEl?.type === "text" || currentEl?.type === "code";
        if (!currentIsTextOrCode) {
          if (
            state.lastSelectedCodeId &&
            state.elements.find((el) => el.id === state.lastSelectedCodeId)
          ) {
            newSelectedId = state.lastSelectedCodeId;
          } else if (
            state.lastSelectedTextId &&
            state.elements.find((el) => el.id === state.lastSelectedTextId)
          ) {
            newSelectedId = state.lastSelectedTextId;
          } else {
            const codeEl = state.elements.find((el) => el.type === "code");
            if (codeEl) newSelectedId = codeEl.id;
          }
        }
      }

      if (tab === "image") {
        const currentIsImage =
          state.elements.find((el) => el.id === state.selectedElementId)
            ?.type === "image";
        if (!currentIsImage && state.lastSelectedImageId) {
          if (
            state.elements.find((el) => el.id === state.lastSelectedImageId)
          ) {
            newSelectedId = state.lastSelectedImageId;
          }
        }
      }

      return { activeTab: tab, selectedElementId: newSelectedId };
    });
  },

  addElement: (element) => {
    set((state) => {
      if (element.type === "code") {
        const existingCode = state.elements.find((e) => e.type === "code");
        if (existingCode) {
          return {
            selectedElementId: existingCode.id,
            activeTab: "text",
            lastSelectedCodeId: existingCode.id,
          };
        }
      }
      const newElements = [...state.elements, element];
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          elements: newElements,
          canvasBackground: state.canvasBackground,
          meshConfig: state.meshConfig,
          overlayConfig: state.overlayConfig,
          aspectRatio: state.aspectRatio,
        },
      ];
      return {
        elements: newElements,
        selectedElementId: element.id,
        activeTab:
          element.type === "text" || element.type === "code" ? "text" : "image",
        lastSelectedTextId:
          element.type === "text" ? element.id : state.lastSelectedTextId,
        lastSelectedImageId:
          element.type === "image" ? element.id : state.lastSelectedImageId,
        lastSelectedCodeId:
          element.type === "code" ? element.id : state.lastSelectedCodeId,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  updateElement: (id, updates) => {
    set((state) => {
      const newElements = state.elements.map((el) => {
        if (el.id !== id) return el;

        if (
          "style" in updates &&
          typeof updates.style === "object" &&
          updates.style !== null
        ) {
          const { style: styleObj, ...rest } = updates as any;
          return {
            ...el,
            ...rest,
            style: { ...(el as any).style, ...styleObj },
          };
        }

        const topLevelKeys = [
          "id",
          "type",
          "name",
          "content",
          "code",
          "language",
          "position",
          "isVisible",
          "isLocked",
          "src",
          "dither",
          "crop",
          "isPlaceholder",
          "placeholderLabel",
          "width",
          "height",
          "aspectRatio",
        ];

        if ("style" in el && !("type" in updates)) {
          const rootUpdates: Record<string, any> = {};
          const styleUpdates: Record<string, any> = {};

          for (const [key, val] of Object.entries(updates)) {
            if (el.type === "code" && key === "width") {
              rootUpdates[key] = val;
              styleUpdates[key] = val;
            } else if (topLevelKeys.includes(key)) {
              rootUpdates[key] = val;
            } else {
              styleUpdates[key] = val;
            }
          }

          return {
            ...el,
            ...rootUpdates,
            style: { ...(el as any).style, ...styleUpdates },
          };
        }

        return { ...el, ...updates };
      });

      return { elements: newElements as CanvasElement[] };
    });
  },

  removeElement: (id) => {
    set((state) => {
      const newElements = state.elements.filter((el) => el.id !== id);
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          elements: newElements,
          canvasBackground: state.canvasBackground,
          meshConfig: state.meshConfig,
          overlayConfig: state.overlayConfig,
          aspectRatio: state.aspectRatio,
        },
      ];
      return {
        elements: newElements,
        selectedElementId: null,
        isCropping: false,
        lastSelectedTextId:
          state.lastSelectedTextId === id ? null : state.lastSelectedTextId,
        lastSelectedImageId:
          state.lastSelectedImageId === id ? null : state.lastSelectedImageId,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  toggleVisibility: (id) => {
    set((state) => {
      if (!state.elements.some((el) => el.id === id)) return state;
      const elements = state.elements.map((el) =>
        el.id === id ? { ...el, isVisible: !el.isVisible } : el,
      );
      return commitLayerToggle(state, elements);
    });
  },

  toggleLock: (id) => {
    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      if (!element) return state;
      const isNowLocked = !element.isLocked;
      const elements = state.elements.map((el) =>
        el.id === id ? { ...el, isLocked: isNowLocked } : el,
      );
      return {
        ...commitLayerToggle(state, elements),
        isCropping:
          isNowLocked && state.selectedElementId === id
            ? false
            : state.isCropping,
      };
    });
  },

  selectElement: (id) => {
    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      let newTab = state.activeTab;

      if (element && state.activeTab !== "layers") {
        newTab =
          element.type === "text" || element.type === "code" ? "text" : "image";
      }

      return {
        selectedElementId: id,
        isCropping: false,
        lastSelectedTextId:
          element?.type === "text" ? id : state.lastSelectedTextId,
        lastSelectedImageId:
          element?.type === "image" ? id : state.lastSelectedImageId,
        lastSelectedCodeId:
          element?.type === "code" ? id : state.lastSelectedCodeId,
        activeTab: newTab,
      };
    });
  },

  setCropping: (val) => set({ isCropping: val }),

  undo: () => {
    set((state) => {
      if (state.historyIndex <= 0) return {};
      const newIndex = state.historyIndex - 1;
      const historyState = state.history[newIndex];
      return {
        elements: historyState.elements,
        canvasBackground: historyState.canvasBackground,
        meshConfig: historyState.meshConfig,
        overlayConfig: historyState.overlayConfig,
        aspectRatio: historyState.aspectRatio || state.aspectRatio,
        historyIndex: newIndex,
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return {};
      const newIndex = state.historyIndex + 1;
      const historyState = state.history[newIndex];
      return {
        elements: historyState.elements,
        canvasBackground: historyState.canvasBackground,
        meshConfig: historyState.meshConfig,
        overlayConfig: historyState.overlayConfig,
        aspectRatio: historyState.aspectRatio || state.aspectRatio,
        historyIndex: newIndex,
      };
    });
  },

  replaceDocument: (document) =>
    set((state) => ({
      ...document,
      documentGeneration: state.documentGeneration + 1,
      history: [{ ...document }],
      historyIndex: 0,
      selectedElementId: null,
      lastSelectedImageId: null,
      lastSelectedTextId: null,
      lastSelectedCodeId: null,
      isCropping: false,
      activeTab: "image",
      exportFormat: "mp4",
      exportQuality: "2",
      exportDuration: 3,
      exportFps: 60,
    })),

  reset: () => get().replaceDocument(createDefaultDocument()),

  setDitherConfig: (layerId, config) => {
    set((state) => {
      const newElements = state.elements.map((el) => {
        if (el.id !== layerId) return el;
        if (el.type !== "image") return el;

        const currentDither = el.dither || {
          enabled: false,
          ditherType: 1,
          pixelSize: 4,
          colorSteps: 4,
          colorFront: "#ffffff",
          colorBack: "#000000",
        };
        const newDither = { ...currentDither, ...config };

        return { ...el, dither: newDither };
      });

      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          elements: newElements,
          canvasBackground: state.canvasBackground,
          meshConfig: state.meshConfig,
          overlayConfig: state.overlayConfig,
          aspectRatio: state.aspectRatio,
        },
      ];

      return {
        elements: newElements as CanvasElement[],
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  saveCustomPreset: (name) => {
    set((state) => {
      const newPreset = {
        id: `preset_${Date.now()}`,
        name: name.trim() || `Preset ${state.userPresets.length + 1}`,
        createdAt: Date.now(),
        aspectRatio: state.aspectRatio,
        canvasBackground: state.canvasBackground,
        meshConfig: { ...state.meshConfig },
        overlayConfig: { ...state.overlayConfig },
        elements: JSON.parse(JSON.stringify(state.elements)),
      };
      const updated = [newPreset, ...state.userPresets];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "fluidframe_user_presets",
            JSON.stringify(updated),
          );
        } catch (e) {}
      }
      return { userPresets: updated };
    });
  },

  deleteCustomPreset: (id) => {
    set((state) => {
      const updated = state.userPresets.filter((p) => p.id !== id);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "fluidframe_user_presets",
            JSON.stringify(updated),
          );
        } catch (e) {}
      }
      return { userPresets: updated };
    });
  },

  loadTemplateOrPreset: (preset) => {
    set((state) => {
      const targetRatio = preset.aspectRatio || state.aspectRatio;
      const clonedElements = JSON.parse(JSON.stringify(preset.elements));

      // Templates strictly manage image layout and formations; user's custom shader/background settings are preserved
      const isCustomUserPreset = "createdAt" in preset;
      const canvasBg =
        isCustomUserPreset && preset.canvasBackground
          ? preset.canvasBackground
          : state.canvasBackground;
      const meshCfg =
        isCustomUserPreset && preset.meshConfig
          ? { ...preset.meshConfig }
          : state.meshConfig;
      const overlayCfg =
        isCustomUserPreset && preset.overlayConfig
          ? { ...preset.overlayConfig }
          : state.overlayConfig;

      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          elements: clonedElements,
          canvasBackground: canvasBg,
          meshConfig: meshCfg,
          overlayConfig: overlayCfg,
          aspectRatio: targetRatio,
        },
      ];
      return {
        elements: clonedElements,
        canvasBackground: canvasBg,
        meshConfig: meshCfg,
        overlayConfig: overlayCfg,
        aspectRatio: targetRatio,
        selectedElementId: null,
        documentGeneration: state.documentGeneration + 1,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  exportPresetsAsJson: () => {
    const presets = get().userPresets;
    return JSON.stringify(presets, null, 2);
  },

  importPresetsFromJson: (jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!Array.isArray(parsed)) return false;
      set((state) => {
        const merged = [...parsed, ...state.userPresets];
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(
              "fluidframe_user_presets",
              JSON.stringify(merged),
            );
          } catch (e) {}
        }
        return { userPresets: merged };
      });
      return true;
    } catch (e) {
      return false;
    }
  },

  loadUserPresets: () => {
    set({ userPresets: loadSavedPresets() });
  },
}));
