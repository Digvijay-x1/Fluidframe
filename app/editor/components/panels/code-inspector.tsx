"use client";

import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StudioSlider } from "@/components/ui/studio-slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "../../store/use-store";
import { CodeElement, DEFAULT_CODE_STYLE, WindowFrameStyle } from "../../types";
import {
  CODE_THEMES,
  TRANSFORM_3D_PRESETS,
  WINDOW_FRAME_PRESETS,
} from "../../values";

export function CodeInspector() {
  const {
    elements,
    selectedElementId,
    updateElement,
    addElement,
    selectElement,
  } = useStore();

  const selectedElement = elements.find((el) => el.id === selectedElementId);
  const existingCode = elements.find((e) => e.type === "code") as CodeElement | undefined;
  const isCode = selectedElement?.type === "code";
  const codeEl = (isCode ? (selectedElement as CodeElement) : existingCode) || null;
  const style = codeEl?.style || DEFAULT_CODE_STYLE;

  const updateCode = (updates: any) => {
    if (!codeEl) return;
    if (selectedElementId !== codeEl.id) {
      selectElement(codeEl.id);
    }
    updateElement(codeEl.id, updates);
  };

  const handleAddCode = () => {
    if (existingCode) {
      selectElement(existingCode.id);
      return;
    }
    const newId = `code_${Date.now()}`;
    addElement({
      id: newId,
      type: "code",
      name: "Code Snippet",
      code: `// Sample TypeScript\nimport { Studio } from "@fluidframe/core";\n\nexport async function showcase() {\n  return Studio.render3D({\n    theme: "cyberpunk",\n    fps: 60,\n  });\n}`,
      language: "typescript",
      position: { x: 80, y: 120 },
      style: { ...DEFAULT_CODE_STYLE },
      isVisible: true,
      isLocked: false,
      width: 500,
    });
    selectElement(newId);
  };

  return (
    <div
      className="space-y-4 w-full min-w-0 max-w-full overflow-hidden box-border"
      onClickCapture={() => {
        if (codeEl && selectedElementId !== codeEl.id) {
          selectElement(codeEl.id);
        }
      }}
    >
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold uppercase tracking-wider">
          Code Snippet
        </Label>
      </div>

      {codeEl ? (
        <div className="space-y-4 w-full min-w-0 max-w-full">
          {/* Code Input with Fixed Width */}
          <div className="space-y-1.5 w-full min-w-0 max-w-full">
            <Label className="text-xs font-medium text-muted-foreground">
              Code Content
            </Label>
            <div className="w-full min-w-0 max-w-full overflow-hidden">
              <Textarea
                value={codeEl.code}
                onChange={(e) => updateCode({ code: e.target.value })}
                rows={5}
                className="w-full max-w-full min-w-0 box-border [field-sizing:fixed] font-mono text-xs leading-relaxed bg-neutral-100 dark:bg-neutral-900 resize-y rounded-md border-2 border-neutral-300 dark:border-neutral-700 whitespace-pre-wrap break-words [overflow-wrap:anywhere] overflow-y-auto overflow-x-hidden"
                placeholder="Paste or type code here..."
              />
            </div>
          </div>

          <div className="space-y-1.5 min-w-0 pr-1">
            <div className="flex items-center justify-between pr-1">
              <Label className="text-xs text-muted-foreground cursor-pointer select-none">
                Frame 
              </Label>
              <Switch
                checked={style.showWindowControls}
                onCheckedChange={(checked) =>
                  updateCode({ showWindowControls: checked })
                }
              />
            </div>
            <div className="flex justify-center">
            {style.showWindowControls && (
              <Input
                value={style.windowTitle || ""}
                onChange={(e) => updateCode({ windowTitle: e.target.value })}
                placeholder="e.g. index.ts"
                className="h-8 text-xs rounded-md font-inter w-full "
              />
            )}
            </div>
          </div>

          {/* 2x2 Dropdown Grid: Frame Style, Language, Color Theme, Orientation */}
          <div className="grid grid-cols-2 gap-4 font-manrope font-semibold *:pr-1">
            {/* Row 1, Col 1: Frame Style */}
            <div className="space-y-1.5 min-w-0">
              <Label className="text-xs font-medium text-muted-foreground">
                Frame Style
              </Label>
              <Select
                value={style.windowFrame || "macos"}
                onValueChange={(val) =>
                  updateCode({ windowFrame: val as WindowFrameStyle })
                }
                disabled={!style.showWindowControls}
              >
                <SelectTrigger className="h-8 w-full text-xs cursor-pointer">
                  <SelectValue placeholder="Frame Style" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  {WINDOW_FRAME_PRESETS.map((frame) => (
                    <SelectItem
                      key={frame.id}
                      value={frame.id}
                      className="text-xs py-1.5 cursor-pointer"
                    >
                      {frame.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 min-w-0">
              <Label className="text-xs font-medium text-muted-foreground">
                Language
              </Label>
              <Select
                value={codeEl.language === "python" || codeEl.language === "py" ? "python" : "typescript"}
                onValueChange={(val) => updateCode({ language: val })}
              >
                <SelectTrigger className="h-8 w-full text-xs cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="typescript" className="text-xs py-1.5 cursor-pointer">
                    TypeScript
                  </SelectItem>
                  <SelectItem value="python" className="text-xs py-1.5 cursor-pointer">
                    Python
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 min-w-0">
              <Label className="text-xs font-medium text-muted-foreground">
                Color Theme
              </Label>
              <Select
                value={style.theme}
                onValueChange={(val: any) => updateCode({ theme: val })}
              >
                <SelectTrigger className="h-8 w-full text-xs cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  {CODE_THEMES.map((theme) => (
                    <SelectItem key={theme.id} value={theme.id} className="text-xs py-1.5 cursor-pointer">
                      <div className="flex">
                        <div
                          style={{ backgroundColor: theme.bg }}
                        />
                        {theme.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 min-w-0">
              <Label className="text-xs font-medium text-muted-foreground">
                Orientation
              </Label>
              <Select
                value={
                  TRANSFORM_3D_PRESETS.find(
                    (p) =>
                      p.id !== "custom" &&
                      p.rotateX === style.rotateX &&
                      p.rotateY === style.rotateY &&
                      p.rotate === style.rotate
                  )?.id || "custom"
                }
                onValueChange={(presetId) => {
                  const preset = TRANSFORM_3D_PRESETS.find(
                    (p) => p.id === presetId
                  );
                  if (preset && preset.id !== "custom") {
                    updateCode({
                      rotateX: preset.rotateX,
                      rotateY: preset.rotateY,
                      rotate: preset.rotate,
                    });
                  }
                }}
              >
                <SelectTrigger className="h-8 w-full text-xs cursor-pointer">
                  <SelectValue placeholder="Orientation" />
                </SelectTrigger>
                <SelectContent className="text-xs max-h-56">
                  <SelectItem
                    value="custom"
                    className="text-xs py-1.5 cursor-pointer text-muted-foreground"
                    disabled
                  >
                    Custom
                  </SelectItem>
                  {TRANSFORM_3D_PRESETS.map((preset) => (
                    <SelectItem
                      key={preset.id}
                      value={preset.id}
                      className="text-xs py-1.5 cursor-pointer"
                    >
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 font-manrope font-semibold *:pr-1">
            <StudioSlider
              label="Font Size"
              value={style.fontSize}
              onChange={(val) => updateCode({ fontSize: val })}
              min={10}
              max={28}
              step={1}
              defaultValue={14}
              unit="px"
              compact
            />

            <StudioSlider
              label="Padding"
              value={style.padding}
              onChange={(val) => updateCode({ padding: val })}
              min={8}
              max={40}
              step={1}
              defaultValue={16}
              unit="px"
              compact
            />

            <StudioSlider
              label="Roundness"
              value={style.borderRadius}
              onChange={(val) => updateCode({ borderRadius: val })}
              min={0}
              max={32}
              step={1}
              defaultValue={12}
              unit="px"
              compact
            />

            <StudioSlider
              label="Scale"
              value={style.scale}
              onChange={(val) => updateCode({ scale: val })}
              min={30}
              max={200}
              step={1}
              defaultValue={100}
              unit="%"
              compact
            />

            <StudioSlider
              label="Glass Blur"
              value={style.glassBlur ?? 0}
              onChange={(val) =>
                updateCode({
                  glassBlur: val,
                  glassmorphism: val > 0,
                })
              }
              min={0}
              max={40}
              step={1}
              defaultValue={0}
              unit="px"
              compact
            />

            <StudioSlider
              label="Width"
              value={codeEl.width || style.width || 500}
              onChange={(val) =>
                updateCode({
                  width: val,
                  style: { ...style, width: val },
                })
              }
              min={200}
              max={800}
              step={10}
              defaultValue={500}
              unit="px"
              compact
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <Button
            onClick={handleAddCode}
            variant="outline"
            size="sm"
            className="w-full bg-transparent border-dashed rounded-sm border-neutral-400 dark:border-neutral-600 hover:bg-muted/50 text-xs font-semibold cursor-pointer"
          >
            <PlusIcon className="w-3.5 h-3.5 mr-2" /> Add Code Layer
          </Button>
          <div className="text-center p-6 text-muted-foreground font-inter text-xs border-2 border-dashed rounded-lg">
            Add a code snippet to customize syntax, window frames, and 3D perspectives.
          </div>
        </div>
      )}
    </div>
  );
}
