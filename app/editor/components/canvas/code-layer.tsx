"use client";

import React, { memo } from "react";
import { CodeElement } from "../../types";
import { CODE_THEMES } from "../../values";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface ThemePalette {
  id: string;
  name: string;
  bg: string;
  text: string;
  keyword: string;
  string: string;
  comment: string;
  number?: string;
  function?: string;
  border: string;
}

// Language-aware single-pass highlighter with inline CSS for 100% reliable rendering
function highlightLine(line: string, language: string, theme: ThemePalette): string {
  const isPython = language === "python" || language === "py";

  const numColor = theme.number || "#ff9e64";
  const funcColor = theme.function || "#7aa2f7";

  // Regex patterns tailored to TypeScript vs Python
  const tokenRegex = isPython
    ? /(#.*$)|("""[\s\S]*?"""|'''[\s\S]*?'''|f?(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'))|(@[a-zA-Z_]\w*)|(\b(?:def|class|import|from|as|return|if|elif|else|while|for|in|try|except|finally|raise|with|pass|lambda|yield|assert|async|await|and|or|not|is|global|nonlocal|True|False|None|self)\b)|(\b(?:print|len|range|dict|list|set|str|int|float|bool|super|enumerate|zip|isinstance|open|type|iter|next)\b)|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_]\w*(?=\s*\())/g
    : /(\/\/.*$|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b(?:import|export|from|as|default|const|let|var|function|return|async|await|if|else|switch|case|break|continue|for|while|do|try|catch|finally|throw|new|typeof|instanceof|interface|type|class|extends|implements|public|private|protected|readonly|static|is|keyof|void|any|never|unknown|null|undefined|true|false|this|super)\b)|(\b(?:string|number|boolean|symbol|bigint|Record|Partial|Promise|Array|Map|Set|React)\b)|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\())/g;

  let lastIndex = 0;
  let result = "";
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(line.slice(lastIndex, match.index));
    }

    if (isPython) {
      const [, comment, str, decorator, keyword, builtin, num, func] = match;
      if (comment) {
        result += `<span style="color: ${theme.comment}; font-style: italic;">${escapeHtml(comment)}</span>`;
      } else if (str) {
        result += `<span style="color: ${theme.string};">${escapeHtml(str)}</span>`;
      } else if (decorator) {
        result += `<span style="color: ${funcColor}; font-weight: 600;">${escapeHtml(decorator)}</span>`;
      } else if (keyword) {
        result += `<span style="color: ${theme.keyword}; font-weight: 600;">${escapeHtml(keyword)}</span>`;
      } else if (builtin) {
        result += `<span style="color: ${theme.keyword}; opacity: 0.9;">${escapeHtml(builtin)}</span>`;
      } else if (num) {
        result += `<span style="color: ${numColor};">${escapeHtml(num)}</span>`;
      } else if (func) {
        result += `<span style="color: ${funcColor};">${escapeHtml(func)}</span>`;
      }
    } else {
      const [, comment, str, keyword, builtin, num, func] = match;
      if (comment) {
        result += `<span style="color: ${theme.comment}; font-style: italic;">${escapeHtml(comment)}</span>`;
      } else if (str) {
        result += `<span style="color: ${theme.string};">${escapeHtml(str)}</span>`;
      } else if (keyword) {
        result += `<span style="color: ${theme.keyword}; font-weight: 600;">${escapeHtml(keyword)}</span>`;
      } else if (builtin) {
        result += `<span style="color: ${theme.keyword}; opacity: 0.9;">${escapeHtml(builtin)}</span>`;
      } else if (num) {
        result += `<span style="color: ${numColor};">${escapeHtml(num)}</span>`;
      } else if (func) {
        result += `<span style="color: ${funcColor};">${escapeHtml(func)}</span>`;
      }
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    result += escapeHtml(line.slice(lastIndex));
  }

  return result || "&nbsp;";
}

function highlightCode(code: string, language: string, theme: ThemePalette) {
  const lines = code.split("\n");
  return lines.map((line, idx) => ({
    lineIndex: idx + 1,
    html: highlightLine(line, language, theme),
  }));
}

export const CodeLayer = memo(
  ({
    element,
    isSelected,
    isDragging,
    onPointerDown,
    isLocked,
  }: {
    element: CodeElement;
    isSelected: boolean;
    isDragging: boolean;
    onPointerDown?: (e: React.PointerEvent, id: string) => void;
    isLocked: boolean;
  }) => {
    const { style } = element;
    const theme =
      CODE_THEMES.find((t) => t.id === style.theme) || CODE_THEMES[0];

    const has3D = (style.rotateX || 0) !== 0 || (style.rotateY || 0) !== 0;
    const hasRotate = (style.rotate || 0) !== 0;
    const hasScale = (style.scale || 100) !== 100;

    let transformValue: string | undefined = undefined;
    if (has3D) {
      transformValue = `perspective(2000px) rotateZ(${style.rotate || 0}deg) rotateX(${style.rotateX || 0}deg) rotateY(${style.rotateY || 0}deg) scale(${(style.scale || 100) / 100})`;
    } else if (hasRotate && hasScale) {
      transformValue = `rotate(${style.rotate}deg) scale(${style.scale / 100})`;
    } else if (hasRotate) {
      transformValue = `rotate(${style.rotate}deg)`;
    } else if (hasScale) {
      transformValue = `scale(${style.scale / 100})`;
    }

    const codeFontFamily =
      style.fontFamily || "var(--font-mono), monospace";

    const language = element.language || "typescript";
    const tokenized = highlightCode(element.code || "", language, theme);

    const windowWidth = element.width || style.width || 500;
    const isGlassActive = (style.glassBlur !== undefined && style.glassBlur > 0) || Boolean(style.glassmorphism);

    return (
      <div
        className={`absolute select-none touch-none ${
          isLocked ? "cursor-default" : "cursor-move"
        }`}
        style={{
          left: element.position.x,
          top: element.position.y,
          zIndex: isSelected ? 40 : 20,
          pointerEvents: isLocked ? "none" : "auto",
          transformStyle: has3D ? "preserve-3d" : undefined,
          transformOrigin: "center center",
          willChange: isSelected || isDragging ? "left, top" : undefined,
          transform: transformValue,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "geometricPrecision",
        }}
        onPointerDown={(e) => {
          if (!isLocked && onPointerDown) {
            onPointerDown(e, element.id);
          }
        }}
      >
        <div
          className={`relative select-none pointer-events-auto touch-none transition-shadow ${
            isSelected
              ? "ring-2 ring-primary ring-offset-2 ring-offset-transparent shadow-2xl"
              : "hover:ring-1 hover:ring-white/40"
          }`}
          style={{
            width: `${windowWidth}px`,
            maxWidth: "100%",
            boxSizing: "border-box",
            overflow: "hidden",
            borderRadius: `${style.borderRadius}px`,
            boxShadow: style.shadow,
            background: isGlassActive
              ? theme.bg.startsWith("#")
                ? `${theme.bg}a6`
                : "rgba(24, 24, 27, 0.65)"
              : theme.bg,
            backdropFilter: isGlassActive
              ? `blur(${style.glassBlur || 16}px) saturate(180%)`
              : undefined,
            WebkitBackdropFilter: isGlassActive
              ? `blur(${style.glassBlur || 16}px) saturate(180%)`
              : undefined,
            border: `1px solid ${isGlassActive ? "rgba(255,255,255,0.2)" : theme.border}`,
            opacity: (style.opacity ?? 100) / 100,
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            textRendering: "geometricPrecision",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {style.showWindowControls && (
            <div
              className="flex items-center justify-between px-3.5 py-2.5 border-b select-none min-h-8"
              style={{
                borderColor: theme.border,
                backgroundColor: isGlassActive
                  ? "transparent"
                  : style.windowFrame === "classic"
                  ? "rgba(0,0,128,0.25)"
                  : "rgba(0,0,0,0.15)",
              }}
            >
              {/* Frame 1: macOS (Traffic Lights) */}
              {(style.windowFrame === "macos" || !style.windowFrame) && (
                <>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="size-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]/40 shadow-xs" />
                    <div className="size-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]/40 shadow-xs" />
                    <div className="size-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]/40 shadow-xs" />
                  </div>

                  {style.windowTitle && (
                    <div
                      className="text-[11px] font-mono tracking-tight font-medium opacity-75 truncate max-w-[200px]"
                      style={{
                        color: theme.text,
                        fontFamily: codeFontFamily,
                      }}
                    >
                      {style.windowTitle}
                    </div>
                  )}

                  <div className="w-10 shrink-0" />
                </>
              )}

              {style.windowFrame === "windows" && (
                <>
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="size-3.5 flex items-center justify-center opacity-70 text-xs font-mono font-bold"
                      style={{ color: theme.keyword || theme.text }}
                    >
                      &lt;/&gt;
                    </div>
                    {style.windowTitle && (
                      <div
                        className="text-[11px] font-sans tracking-tight font-medium opacity-80 truncate max-w-[220px]"
                        style={{ color: theme.text }}
                      >
                        {style.windowTitle}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0 opacity-70">
                    <div className="w-2.5 h-[1.5px] bg-current" style={{ color: theme.text }} />
                    <div className="size-2.5 border border-current rounded-[1px]" style={{ color: theme.text }} />
                    <span className="text-xs leading-none select-none font-mono" style={{ color: theme.text }}>✕</span>
                  </div>
                </>
              )}

              {style.windowFrame === "classic" && (
                <>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="size-3.5 bg-[#000080] text-white flex items-center justify-center text-[8px] font-bold font-mono border border-black/40 shadow-2xs">
                      &gt;_
                    </div>
                    {style.windowTitle && (
                      <div
                        className="text-[11px] font-mono font-bold tracking-wider truncate max-w-[200px]"
                        style={{ color: theme.text }}
                      >
                        {style.windowTitle}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 font-mono text-[9px] font-bold select-none">
                    <div className="size-3.5 flex items-center justify-center bg-[#c0c0c0] text-black border-t border-l border-t-white border-l-white border-b border-r border-b-black border-r-black shadow-2xs leading-none">
                      _
                    </div>
                    <div className="size-3.5 flex items-center justify-center bg-[#c0c0c0] text-black border-t border-l border-t-white border-l-white border-b border-r border-b-black border-r-black shadow-2xs leading-none">
                      □
                    </div>
                    <div className="size-3.5 flex items-center justify-center bg-[#c0c0c0] text-black border-t border-l border-t-white border-l-white border-b border-r border-b-black border-r-black shadow-2xs leading-none">
                      ✕
                    </div>
                  </div>
                </>
              )}

              {style.windowFrame === "browser" && (
         
                  <div
                    className="flex justify-center items-center w-fit mx-2 px-2.5 py-0.5 rounded-full border gap-1.5 text-[10px] truncate shadow-2xs"
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      borderColor: theme.border,
                      color: theme.text,
                    }}
                  >
                    <span className="size-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="font-mono truncate opacity-85 font-medium">
                      {style.windowTitle || "localhost:3000"}
                    </span>
                  </div>
              )}

              {style.windowFrame === "minimal" && (
                <>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-emerald-400 font-mono text-xs font-bold leading-none">$</span>
                    {style.windowTitle && (
                      <div
                        className="text-[11px] font-mono tracking-tight font-medium opacity-85 truncate"
                        style={{ color: theme.text, fontFamily: codeFontFamily }}
                      >
                        {style.windowTitle}
                      </div>
                    )}
                  </div>
                  <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                </>
              )}
            </div>
          )}

          <div
            className="font-mono overflow-hidden relative"
            style={{
              padding: `${style.padding}px`,
              fontSize: `${style.fontSize}px`,
              lineHeight: 1.6,
              color: theme.text,
              fontFamily: codeFontFamily,
              width: "100%",
              boxSizing: "border-box",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              textRendering: "geometricPrecision",
            }}
          >
            <table
              className="border-collapse w-full"
              style={{ width: "100%" }}
            >
              <tbody>
                {tokenized.map(({ lineIndex, html }) => (
                  <tr key={lineIndex} className="hover:bg-white/5 transition-colors">
                    {style.lineNumbers !== false && (
                      <td
                        className="pr-4 select-none text-right opacity-35 font-mono align-top"
                        style={{
                          color: theme.text,
                          width: "1%",
                          fontSize: `${style.fontSize}px`,
                          lineHeight: 1.6,
                          fontFamily: codeFontFamily,
                          fontVariantNumeric: "tabular-nums",
                          whiteSpace: "nowrap",
                          WebkitFontSmoothing: "antialiased",
                          MozOsxFontSmoothing: "grayscale",
                          textRendering: "geometricPrecision",
                        }}
                      >
                        {lineIndex}
                      </td>
                    )}
                    <td
                      className="whitespace-pre-wrap break-words align-top font-mono"
                      style={{
                        fontSize: `${style.fontSize}px`,
                        lineHeight: 1.6,
                        fontFamily: codeFontFamily,
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                        WebkitFontSmoothing: "antialiased",
                        MozOsxFontSmoothing: "grayscale",
                        textRendering: "geometricPrecision",
                      }}
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
);

CodeLayer.displayName = "CodeLayer";
