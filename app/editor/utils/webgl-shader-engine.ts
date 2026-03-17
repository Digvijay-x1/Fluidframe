export interface MeshShaderUniforms {
  colors: [
    [number, number, number],
    [number, number, number],
    [number, number, number],
    [number, number, number],
    [number, number, number]
  ];
  speed: number;
  noiseIntensity: number;
  noiseScale: number;
  noiseGrain: number;
  isAnimating: boolean;
  ditherEnabled: boolean;
  ditherType: number; // 0: Bayer 2x2, 1: Bayer 4x4, 2: Bayer 8x8, 3: Random
  ditherPixelSize: number;
  ditherColorSteps: number;
  ditherStrength?: number;
}

export const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

export const FRAGMENT_SHADER = `
  precision highp float;
  varying vec2 v_uv;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform vec3 u_color4;
  uniform vec3 u_color5;
  uniform float u_speed;
  uniform float u_noiseIntensity;
  uniform float u_noiseScale;
  uniform float u_noiseGrain;
  uniform int u_isAnimating;
  uniform int u_ditherEnabled;
  uniform int u_ditherType;
  uniform float u_ditherPixelSize;
  uniform float u_ditherSteps;
  uniform float u_ditherStrength;

  // Ashima Arts Simplex 2D noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Bayer Dither Matrices
  float bayer2(vec2 uv) {
    int x = int(mod(uv.x, 2.0));
    int y = int(mod(uv.y, 2.0));
    int idx = x + y * 2;
    if (idx == 0) return 0.0 / 4.0;
    if (idx == 1) return 2.0 / 4.0;
    if (idx == 2) return 3.0 / 4.0;
    return 1.0 / 4.0;
  }

  float bayer4(vec2 uv) {
    int x = int(mod(uv.x, 4.0));
    int y = int(mod(uv.y, 4.0));
    int idx = x + y * 4;
    if (idx == 0) return 0.0 / 16.0;
    if (idx == 1) return 8.0 / 16.0;
    if (idx == 2) return 2.0 / 16.0;
    if (idx == 3) return 10.0 / 16.0;
    if (idx == 4) return 12.0 / 16.0;
    if (idx == 5) return 4.0 / 16.0;
    if (idx == 6) return 14.0 / 16.0;
    if (idx == 7) return 6.0 / 16.0;
    if (idx == 8) return 3.0 / 16.0;
    if (idx == 9) return 11.0 / 16.0;
    if (idx == 10) return 1.0 / 16.0;
    if (idx == 11) return 9.0 / 16.0;
    if (idx == 12) return 15.0 / 16.0;
    if (idx == 13) return 7.0 / 16.0;
    if (idx == 14) return 13.0 / 16.0;
    return 5.0 / 16.0;
  }

  float bayer8(vec2 uv) {
    vec2 p4 = mod(uv, 4.0);
    vec2 p2 = floor(mod(uv, 8.0) / 4.0);
    return (bayer4(p4) * 64.0 + bayer2(p2) * 4.0) / 64.0;
  }

  float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 st = vec2(uv.x * aspect, uv.y);

    float t = (u_isAnimating == 1) ? u_time * u_speed * 0.4 : 0.0;
    float scale = max(u_noiseScale, 0.2);

    // Dynamic mesh anchor points with fluid motion
    vec2 p1 = vec2(0.15 * aspect, 0.15) + (u_isAnimating == 1 ? vec2(sin(t * 0.7) * 0.18, cos(t * 0.6) * 0.18) : vec2(0.0));
    vec2 p2 = vec2(0.85 * aspect, 0.15) + (u_isAnimating == 1 ? vec2(cos(t * 0.5 + 2.0) * 0.18, sin(t * 0.8 + 0.5) * 0.18) : vec2(0.0));
    vec2 p3 = vec2(0.85 * aspect, 0.85) + (u_isAnimating == 1 ? vec2(sin(t * 0.6 + 4.0) * 0.18, cos(t * 0.7 + 2.5) * 0.18) : vec2(0.0));
    vec2 p4 = vec2(0.15 * aspect, 0.85) + (u_isAnimating == 1 ? vec2(cos(t * 0.8 + 1.2) * 0.18, sin(t * 0.5 + 3.7) * 0.18) : vec2(0.0));
    vec2 p5 = vec2(0.50 * aspect, 0.50) + (u_isAnimating == 1 ? vec2(sin(t * 0.9 + 5.0) * 0.22, cos(t * 0.4 + 4.2) * 0.22) : vec2(0.0));

    // Controlled Simplex domain warping
    float warpIntensity = (u_noiseIntensity / 100.0) * 0.35;
    vec2 warp = vec2(
      snoise(st * scale + vec2(t * 0.25, t * 0.35)),
      snoise(st * scale + vec2(t * 0.35 + 4.2, t * 0.25 + 1.8))
    ) * warpIntensity;

    vec2 warpedSt = st + warp;

    // Smooth inverse distance weighting
    float w1 = 1.0 / (pow(length(warpedSt - p1) * 1.6, 2.2) + 0.06);
    float w2 = 1.0 / (pow(length(warpedSt - p2) * 1.6, 2.2) + 0.06);
    float w3 = 1.0 / (pow(length(warpedSt - p3) * 1.6, 2.2) + 0.06);
    float w4 = 1.0 / (pow(length(warpedSt - p4) * 1.6, 2.2) + 0.06);
    float w5 = 1.0 / (pow(length(warpedSt - p5) * 1.3, 1.9) + 0.06);

    float sum = w1 + w2 + w3 + w4 + w5;
    vec3 blendedColor = (u_color1 * w1 + u_color2 * w2 + u_color3 * w3 + u_color4 * w4 + u_color5 * w5) / sum;

    // Subtle micro-film noise if requested
    if (u_noiseGrain > 0.0) {
      blendedColor += (rand(gl_FragCoord.xy) - 0.5) * (u_noiseGrain * 0.002);
    }

    blendedColor = clamp(blendedColor, 0.0, 1.0);

    // Real-Time Bayer Dithering
    if (u_ditherEnabled == 1) {
      float pxSize = max(u_ditherPixelSize, 1.0);
      vec2 ditherPixelPos = floor(gl_FragCoord.xy / pxSize);
      float threshold = 0.5;

      if (u_ditherType == 0) {
        threshold = bayer2(ditherPixelPos);
      } else if (u_ditherType == 1) {
        threshold = bayer4(ditherPixelPos);
      } else if (u_ditherType == 2) {
        threshold = bayer8(ditherPixelPos);
      } else if (u_ditherType == 3) {
        threshold = rand(ditherPixelPos);
      }

      float steps = max(u_ditherSteps, 2.0);
      vec3 ditheredColor = blendedColor + (threshold - 0.5) / steps;
      ditheredColor = floor(ditheredColor * (steps - 1.0) + 0.5) / (steps - 1.0);
      ditheredColor = clamp(ditheredColor, 0.0, 1.0);

      float strength = clamp(u_ditherStrength, 0.0, 1.0);
      blendedColor = mix(blendedColor, ditheredColor, strength);
    }

    gl_FragColor = vec4(blendedColor, 1.0);
  }
`;

export function hexToRgb01(hex: string): [number, number, number] {
  if (!hex) return [1, 1, 1];
  const clean = hex.replace("#", "").trim();
  const num = parseInt(clean, 16);
  if (isNaN(num)) return [1, 1, 1];

  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16) / 255;
    const g = parseInt(clean[1] + clean[1], 16) / 255;
    const b = parseInt(clean[2] + clean[2], 16) / 255;
    return [r, g, b];
  }
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

export class WebGLMeshRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private animFrameId: number | null = null;
  private startTime: number = performance.now();
  private lastRenderTime: number = 0;
  private uniforms: MeshShaderUniforms;
  private isRunning: boolean = false;

  // Cached uniform locations
  private uResLoc: WebGLUniformLocation | null = null;
  private uTimeLoc: WebGLUniformLocation | null = null;
  private uC1Loc: WebGLUniformLocation | null = null;
  private uC2Loc: WebGLUniformLocation | null = null;
  private uC3Loc: WebGLUniformLocation | null = null;
  private uC4Loc: WebGLUniformLocation | null = null;
  private uC5Loc: WebGLUniformLocation | null = null;
  private uSpeedLoc: WebGLUniformLocation | null = null;
  private uNoiseIntLoc: WebGLUniformLocation | null = null;
  private uNoiseScaleLoc: WebGLUniformLocation | null = null;
  private uNoiseGrainLoc: WebGLUniformLocation | null = null;
  private uIsAnimLoc: WebGLUniformLocation | null = null;
  private uDitherEnLoc: WebGLUniformLocation | null = null;
  private uDitherTypeLoc: WebGLUniformLocation | null = null;
  private uDitherPxLoc: WebGLUniformLocation | null = null;
  private uDitherStepsLoc: WebGLUniformLocation | null = null;
  private uDitherStrengthLoc: WebGLUniformLocation | null = null;

  constructor(canvas: HTMLCanvasElement, initialUniforms: MeshShaderUniforms) {
    this.canvas = canvas;
    this.uniforms = initialUniforms;
    this.initGL();
  }

  private initGL() {
    this.gl = this.canvas.getContext("webgl", {
      preserveDrawingBuffer: true,
      antialias: true,
      alpha: false,
    });
    if (!this.gl) {
      console.warn("WebGL not supported");
      return;
    }

    const gl = this.gl;
    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation failed:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link failed:", gl.getProgramInfoLog(program));
      return;
    }

    this.program = program;
    gl.useProgram(program);

    // Cache locations
    this.uResLoc = gl.getUniformLocation(program, "u_resolution");
    this.uTimeLoc = gl.getUniformLocation(program, "u_time");
    this.uC1Loc = gl.getUniformLocation(program, "u_color1");
    this.uC2Loc = gl.getUniformLocation(program, "u_color2");
    this.uC3Loc = gl.getUniformLocation(program, "u_color3");
    this.uC4Loc = gl.getUniformLocation(program, "u_color4");
    this.uC5Loc = gl.getUniformLocation(program, "u_color5");
    this.uSpeedLoc = gl.getUniformLocation(program, "u_speed");
    this.uNoiseIntLoc = gl.getUniformLocation(program, "u_noiseIntensity");
    this.uNoiseScaleLoc = gl.getUniformLocation(program, "u_noiseScale");
    this.uNoiseGrainLoc = gl.getUniformLocation(program, "u_noiseGrain");
    this.uIsAnimLoc = gl.getUniformLocation(program, "u_isAnimating");
    this.uDitherEnLoc = gl.getUniformLocation(program, "u_ditherEnabled");
    this.uDitherTypeLoc = gl.getUniformLocation(program, "u_ditherType");
    this.uDitherPxLoc = gl.getUniformLocation(program, "u_ditherPixelSize");
    this.uDitherStepsLoc = gl.getUniformLocation(program, "u_ditherSteps");
    this.uDitherStrengthLoc = gl.getUniformLocation(program, "u_ditherStrength");

    // Fullscreen quad buffer [-1, -1] to [1, 1]
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Initial render pass
    this.render();
  }

  public updateUniforms(newUniforms: Partial<MeshShaderUniforms>) {
    this.uniforms = { ...this.uniforms, ...newUniforms };
    // Trigger immediate render on uniform change
    this.render();
  }

  public render(timestamp?: number) {
    if (!this.gl || !this.program) return;
    const gl = this.gl;
    gl.useProgram(this.program);

    const width = this.canvas.width;
    const height = this.canvas.height;
    gl.viewport(0, 0, width, height);

    if (this.uniforms.isAnimating) {
      this.lastRenderTime = ((timestamp ?? performance.now()) - this.startTime) / 1000.0;
    }

    if (this.uResLoc) gl.uniform2f(this.uResLoc, width, height);
    if (this.uTimeLoc) gl.uniform1f(this.uTimeLoc, this.lastRenderTime);

    const c = this.uniforms.colors;
    if (this.uC1Loc) gl.uniform3f(this.uC1Loc, c[0][0], c[0][1], c[0][2]);
    if (this.uC2Loc) gl.uniform3f(this.uC2Loc, c[1][0], c[1][1], c[1][2]);
    if (this.uC3Loc) gl.uniform3f(this.uC3Loc, c[2][0], c[2][1], c[2][2]);
    if (this.uC4Loc) gl.uniform3f(this.uC4Loc, c[3][0], c[3][1], c[3][2]);
    if (this.uC5Loc) gl.uniform3f(this.uC5Loc, c[4][0], c[4][1], c[4][2]);

    if (this.uSpeedLoc) gl.uniform1f(this.uSpeedLoc, this.uniforms.speed);
    if (this.uNoiseIntLoc) gl.uniform1f(this.uNoiseIntLoc, this.uniforms.noiseIntensity);
    if (this.uNoiseScaleLoc) gl.uniform1f(this.uNoiseScaleLoc, this.uniforms.noiseScale);
    if (this.uNoiseGrainLoc) gl.uniform1f(this.uNoiseGrainLoc, this.uniforms.noiseGrain || 0.0);
    if (this.uIsAnimLoc) gl.uniform1i(this.uIsAnimLoc, this.uniforms.isAnimating ? 1 : 0);
    if (this.uDitherEnLoc) gl.uniform1i(this.uDitherEnLoc, this.uniforms.ditherEnabled ? 1 : 0);
    if (this.uDitherTypeLoc) gl.uniform1i(this.uDitherTypeLoc, this.uniforms.ditherType);
    if (this.uDitherPxLoc) gl.uniform1f(this.uDitherPxLoc, this.uniforms.ditherPixelSize);
    if (this.uDitherStepsLoc) gl.uniform1f(this.uDitherStepsLoc, this.uniforms.ditherColorSteps);
    if (this.uDitherStrengthLoc) gl.uniform1f(this.uDitherStrengthLoc, (this.uniforms.ditherStrength ?? 100) / 100.0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  public renderTime(timeInSeconds: number) {
    if (!this.gl || !this.program) return;
    const gl = this.gl;
    gl.useProgram(this.program);

    const width = this.canvas.width;
    const height = this.canvas.height;
    gl.viewport(0, 0, width, height);

    this.lastRenderTime = timeInSeconds;

    if (this.uResLoc) gl.uniform2f(this.uResLoc, width, height);
    if (this.uTimeLoc) gl.uniform1f(this.uTimeLoc, timeInSeconds);

    const c = this.uniforms.colors;
    if (this.uC1Loc) gl.uniform3f(this.uC1Loc, c[0][0], c[0][1], c[0][2]);
    if (this.uC2Loc) gl.uniform3f(this.uC2Loc, c[1][0], c[1][1], c[1][2]);
    if (this.uC3Loc) gl.uniform3f(this.uC3Loc, c[2][0], c[2][1], c[2][2]);
    if (this.uC4Loc) gl.uniform3f(this.uC4Loc, c[3][0], c[3][1], c[3][2]);
    if (this.uC5Loc) gl.uniform3f(this.uC5Loc, c[4][0], c[4][1], c[4][2]);

    if (this.uSpeedLoc) gl.uniform1f(this.uSpeedLoc, this.uniforms.speed);
    if (this.uNoiseIntLoc) gl.uniform1f(this.uNoiseIntLoc, this.uniforms.noiseIntensity);
    if (this.uNoiseScaleLoc) gl.uniform1f(this.uNoiseScaleLoc, this.uniforms.noiseScale);
    if (this.uNoiseGrainLoc) gl.uniform1f(this.uNoiseGrainLoc, this.uniforms.noiseGrain || 0.0);
    if (this.uIsAnimLoc) gl.uniform1i(this.uIsAnimLoc, this.uniforms.isAnimating ? 1 : 0);
    if (this.uDitherEnLoc) gl.uniform1i(this.uDitherEnLoc, this.uniforms.ditherEnabled ? 1 : 0);
    if (this.uDitherTypeLoc) gl.uniform1i(this.uDitherTypeLoc, this.uniforms.ditherType);
    if (this.uDitherPxLoc) gl.uniform1f(this.uDitherPxLoc, this.uniforms.ditherPixelSize);
    if (this.uDitherStepsLoc) gl.uniform1f(this.uDitherStepsLoc, this.uniforms.ditherColorSteps);
    if (this.uDitherStrengthLoc) gl.uniform1f(this.uDitherStrengthLoc, (this.uniforms.ditherStrength ?? 100) / 100.0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    const loop = (time: number) => {
      if (this.uniforms.isAnimating) {
        this.render(time);
      }
      if (this.isRunning) {
        this.animFrameId = requestAnimationFrame(loop);
      }
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  public stop() {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public getLastRenderTime(): number {
    return this.lastRenderTime;
  }

  public destroy() {
    this.stop();
    this.gl = null;
    this.program = null;
  }
}

export function buildMeshUniforms(meshConfig: {
  colors: string[];
  speed: number;
  noiseIntensity: number;
  noiseScale: number;
  noiseGrain?: number;
  isAnimating?: boolean;
  ditherEnabled: boolean;
  ditherType: number;
  ditherPixelSize: number;
  ditherColorSteps: number;
  ditherStrength?: number;
}): MeshShaderUniforms {
  const colorsRGB: [
    [number, number, number],
    [number, number, number],
    [number, number, number],
    [number, number, number],
    [number, number, number]
  ] = [
    hexToRgb01(meshConfig.colors[0] || "#09090b"),
    hexToRgb01(meshConfig.colors[1] || "#18181b"),
    hexToRgb01(meshConfig.colors[2] || "#3f3f46"),
    hexToRgb01(meshConfig.colors[3] || "#71717a"),
    hexToRgb01(meshConfig.colors[4] || "#e4e4e7"),
  ];

  return {
    colors: colorsRGB,
    speed: meshConfig.speed,
    noiseIntensity: meshConfig.noiseIntensity,
    noiseScale: meshConfig.noiseScale,
    noiseGrain: meshConfig.noiseGrain || 0,
    isAnimating: meshConfig.isAnimating ?? true,
    ditherEnabled: meshConfig.ditherEnabled,
    ditherType: meshConfig.ditherType,
    ditherPixelSize: meshConfig.ditherPixelSize,
    ditherColorSteps: meshConfig.ditherColorSteps,
    ditherStrength: meshConfig.ditherStrength ?? 100,
  };
}
