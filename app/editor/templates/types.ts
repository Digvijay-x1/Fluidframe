import { AspectRatioPreset } from "../values";
import {
  CanvasElement,
  MeshGradientConfig,
  OverlayConfig,
} from "../types";

export type TemplateCategory =
  | "all"
  | "presentation"
  | "cards"
  | "mobile"
  | "minimal";

export type TemplateLayoutType =
  | "triptych-3d"
  | "isometric-trio"
  | "mobile-showcase"
  | "stagger-cascade"
  | "dual-perspective"
  | "floating-stack";

export interface TemplateItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  layoutType: TemplateLayoutType;
  tags?: string[];
  thumbnailUrl?: string;
  aspectRatio: AspectRatioPreset;
  canvasBackground?: string;
  meshConfig?: MeshGradientConfig;
  overlayConfig?: OverlayConfig;
  elements: CanvasElement[];
}

export interface UserPreset {
  id: string;
  name: string;
  createdAt: number;
  category?: string;
  aspectRatio: AspectRatioPreset;
  canvasBackground: string;
  meshConfig: MeshGradientConfig;
  overlayConfig: OverlayConfig;
  elements: CanvasElement[];
}
