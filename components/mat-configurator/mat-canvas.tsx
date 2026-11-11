"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { MAT_COLORS, type MatConfig } from "@/lib/mat-config";
import { PRINTGRASS_COLORS } from "@/lib/printgrass-colors";
import { SIGNATURE_COLORS } from "@/lib/signature-colors";
import { Button } from "@/components/ui/button";
import { RotateCw, ZoomIn, Move, Trash2, Crosshair } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface MatCanvasProps {
  config: MatConfig;
  onLogoUpdate: (updates: Partial<MatConfig["logo"]>) => void;
}

type TextureSource = HTMLImageElement | HTMLCanvasElement;

type TextureSet = {
  base: TextureSource | null;
  soft: TextureSource | null;
  noise: TextureSource | null;
};

type CanvasLayout = {
  frameThickness: number;
  borderPx: number;
  canvasOuterRadius: number;
  matOuterRadius: number;
  innerRadius: number;
  outerX: number;
  outerY: number;
  outerW: number;
  outerH: number;
  innerX: number;
  innerY: number;
  innerW: number;
  innerH: number;
};

const STANDARD_TEXTURES = {
  base: "/textures/mat-base.webp",
  soft: "/textures/mat-soft.webp",
};

const PRINTGRASS_TEXTURES = {
  base: "/textures/printgrass-base.webp",
  soft: "/textures/printgrass-soft.webp",
};

/**
 * Fijne korrel voor het tapijteffect, in de browser gegenereerd.
 * Vervangt noise.webp (2,6 MB): wordt toch maar op 3–5% doorzichtigheid gebruikt.
 */
let noiseTexture: HTMLCanvasElement | null = null;
function getNoiseTexture(): HTMLCanvasElement | null {
  if (noiseTexture) return noiseTexture;
  const canvas = document.createElement("canvas");
  canvas.width = 3000;
  canvas.height = 2000;
  // Kleine tegel genereren en uitrekken is goedkoop en geeft dezelfde schaal als de oude afbeelding.
  const tile = document.createElement("canvas");
  tile.width = 600;
  tile.height = 400;
  const tileCtx = tile.getContext("2d");
  const ctx = canvas.getContext("2d");
  if (!tileCtx || !ctx) return null;
  const data = tileCtx.createImageData(tile.width, tile.height);
  for (let i = 0; i < data.data.length; i += 4) {
    const v = Math.random() * 255;
    data.data[i] = v;
    data.data[i + 1] = v;
    data.data[i + 2] = v;
    data.data[i + 3] = 255;
  }
  tileCtx.putImageData(data, 0, 0);
  ctx.drawImage(tile, 0, 0, canvas.width, canvas.height);
  noiseTexture = canvas;
  return canvas;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const normalized =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;

  const bigint = parseInt(normalized, 16);

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0"))
    .join("")}`;
}

function mixHex(colorA: string, colorB: string, amount: number) {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);

  return rgbToHex(
    a.r + (b.r - a.r) * amount,
    a.g + (b.g - a.g) * amount,
    a.b + (b.b - a.b) * amount
  );
}

function darkenHex(color: string, amount = 0.12) {
  return mixHex(color, "#000000", amount);
}

function lightenHex(color: string, amount = 0.12) {
  return mixHex(color, "#ffffff", amount);
}

function muteHex(color: string) {
  return mixHex(mixHex(color, "#707070", 0.06), "#000000", 0.03);
}

function straightRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.closePath();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

const scaledTextureCache = new WeakMap<TextureSource, Map<number, HTMLCanvasElement>>();

function createScaledPattern(
  ctx: CanvasRenderingContext2D,
  image: TextureSource,
  scale = 1
) {
  let byScale = scaledTextureCache.get(image);
  if (!byScale) {
    byScale = new Map();
    scaledTextureCache.set(image, byScale);
  }

  let offscreen = byScale.get(scale);
  if (!offscreen) {
    offscreen = document.createElement("canvas");
    offscreen.width = Math.max(8, Math.round(image.width * scale));
    offscreen.height = Math.max(8, Math.round(image.height * scale));

    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return null;

    offCtx.imageSmoothingEnabled = true;
    offCtx.imageSmoothingQuality = "high";
    offCtx.drawImage(image, 0, 0, offscreen.width, offscreen.height);
    byScale.set(scale, offscreen);
  }

  return ctx.createPattern(offscreen, "repeat");
}

function getRenderedLogoSize(
  image: HTMLImageElement | HTMLCanvasElement,
  scale: number,
  innerWidth: number,
  innerHeight: number
) {
  const aspect = image.width / image.height;
  const baseSize = Math.min(innerWidth, innerHeight) * 0.42 * scale;

  let width: number;
  let height: number;

  if (aspect >= 1) {
    width = baseSize;
    height = baseSize / aspect;
  } else {
    height = baseSize;
    width = baseSize * aspect;
  }

  const maxWidth = innerWidth * 0.88;
  const maxHeight = innerHeight * 0.88;

  if (width > maxWidth) {
    const ratio = maxWidth / width;
    width *= ratio;
    height *= ratio;
  }

  if (height > maxHeight) {
    const ratio = maxHeight / height;
    width *= ratio;
    height *= ratio;
  }

  return { width, height };
}

function isNearWhite(r: number, g: number, b: number, threshold = 245) {
  return r >= threshold && g >= threshold && b >= threshold;
}

function findOpaqueBounds(
  imageData: ImageData,
  alphaThreshold = 8
): { left: number; top: number; right: number; bottom: number } | null {
  const { data, width, height } = imageData;

  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const a = data[i + 3];
      if (a > alphaThreshold) {
        if (x < left) left = x;
        if (y < top) top = y;
        if (x > right) right = x;
        if (y > bottom) bottom = y;
      }
    }
  }

  if (right === -1 || bottom === -1) return null;
  return { left, top, right, bottom };
}

function hasLikelyWhiteBackground(image: HTMLImageElement) {
  const sampleCanvas = document.createElement("canvas");
  sampleCanvas.width = Math.min(32, image.width);
  sampleCanvas.height = Math.min(32, image.height);

  const ctx = sampleCanvas.getContext("2d");
  if (!ctx) return false;

  ctx.drawImage(image, 0, 0, sampleCanvas.width, sampleCanvas.height);
  const { data, width, height } = ctx.getImageData(
    0,
    0,
    sampleCanvas.width,
    sampleCanvas.height
  );

  const points: [number, number][] = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
    [Math.floor(width / 2), 0],
    [0, Math.floor(height / 2)],
    [width - 1, Math.floor(height / 2)],
    [Math.floor(width / 2), height - 1],
  ];

  let whiteHits = 0;

  for (const [x, y] of points) {
    const i = (y * width + x) * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a > 200 && isNearWhite(r, g, b, 245)) {
      whiteHits++;
    }
  }

  return whiteHits >= 5;
}

function applyCanvasNoise(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount = 6
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha < 8) continue;

    const noise = (Math.random() - 0.5) * amount;
    data[i] = clamp(data[i] + noise, 0, 255);
    data[i + 1] = clamp(data[i + 1] + noise, 0, 255);
    data[i + 2] = clamp(data[i + 2] + noise, 0, 255);
  }

  ctx.putImageData(imageData, 0, 0);
}

function softenPureWhites(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 8) continue;

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (r > 235 && g > 235 && b > 235) {
      data[i] = 228;
      data[i + 1] = 228;
      data[i + 2] = 228;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

const preparedLogoCache = new WeakMap<HTMLImageElement, HTMLCanvasElement | null>();
/** Max. afmeting van het logo in het voorbeeld (de productie gebruikt altijd het originele bestand). */
const PREVIEW_LOGO_MAX = 1600;

/** Verwerkt logo (witte achtergrond weg, bijgesneden), één keer berekend per afbeelding. */
function createPreparedLogoCanvas(image: HTMLImageElement) {
  if (!preparedLogoCache.has(image)) preparedLogoCache.set(image, buildPreparedLogoCanvas(image));
  return preparedLogoCache.get(image) ?? null;
}

function buildPreparedLogoCanvas(image: HTMLImageElement) {
  const offscreen = document.createElement("canvas");
  const downscale = Math.min(1, PREVIEW_LOGO_MAX / Math.max(image.width, image.height));
  offscreen.width = Math.max(1, Math.round(image.width * downscale));
  offscreen.height = Math.max(1, Math.round(image.height * downscale));

  const ctx = offscreen.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, offscreen.width, offscreen.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, offscreen.width, offscreen.height);

  const removeWhiteBg = hasLikelyWhiteBackground(image);

  const imageData = ctx.getImageData(0, 0, offscreen.width, offscreen.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 8) {
      data[i + 3] = 0;
      continue;
    }

    if (removeWhiteBg && isNearWhite(r, g, b, 245)) {
      data[i + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  softenPureWhites(ctx, offscreen.width, offscreen.height);

  const bounds = findOpaqueBounds(
    ctx.getImageData(0, 0, offscreen.width, offscreen.height),
    8
  );
  if (!bounds) return offscreen;

  const pad = 2;
  const sx = Math.max(0, bounds.left - pad);
  const sy = Math.max(0, bounds.top - pad);
  const sw = Math.min(
    offscreen.width - sx,
    bounds.right - bounds.left + 1 + pad * 2
  );
  const sh = Math.min(
    offscreen.height - sy,
    bounds.bottom - bounds.top + 1 + pad * 2
  );

  const cropped = document.createElement("canvas");
  cropped.width = sw;
  cropped.height = sh;

  const croppedCtx = cropped.getContext("2d");
  if (!croppedCtx) return offscreen;

  croppedCtx.clearRect(0, 0, sw, sh);
  croppedCtx.imageSmoothingEnabled = true;
  croppedCtx.imageSmoothingQuality = "high";
  croppedCtx.drawImage(offscreen, sx, sy, sw, sh, 0, 0, sw, sh);

  return cropped;
}

type PrintedLogoCacheEntry = {
  base: TextureSource | null;
  soft: TextureSource | null;
  noise: TextureSource | null;
  result: HTMLCanvasElement;
};
const printedLogoCache = new WeakMap<HTMLCanvasElement, PrintedLogoCacheEntry>();

/** Logo met tapijtstructuur; hergebruikt zolang logo en texturen gelijk blijven (vlot slepen op mobiel). */
function createPrintedLogoCanvas(
  source: HTMLCanvasElement,
  textureBase: TextureSource | null,
  textureSoft: TextureSource | null,
  textureNoise: TextureSource | null
) {
  const cached = printedLogoCache.get(source);
  if (cached && cached.base === textureBase && cached.soft === textureSoft && cached.noise === textureNoise) {
    return cached.result;
  }
  const result = buildPrintedLogoCanvas(source, textureBase, textureSoft, textureNoise);
  printedLogoCache.set(source, { base: textureBase, soft: textureSoft, noise: textureNoise, result });
  return result;
}

function buildPrintedLogoCanvas(
  source: HTMLCanvasElement,
  textureBase: TextureSource | null,
  textureSoft: TextureSource | null,
  textureNoise: TextureSource | null
) {
  const printed = document.createElement("canvas");
  printed.width = source.width;
  printed.height = source.height;

  const ctx = printed.getContext("2d");
  if (!ctx) return source;

  ctx.clearRect(0, 0, printed.width, printed.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.globalAlpha = 0.96;
  ctx.drawImage(source, 0, 0);

  const mask = document.createElement("canvas");
  mask.width = source.width;
  mask.height = source.height;
  const maskCtx = mask.getContext("2d");
  if (!maskCtx) return source;

  maskCtx.clearRect(0, 0, mask.width, mask.height);
  maskCtx.drawImage(source, 0, 0);

  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fillRect(0, 0, printed.width, printed.height);
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, printed.width, printed.height);
  ctx.restore();

  if (textureBase) {
    const overlay = document.createElement("canvas");
    overlay.width = source.width;
    overlay.height = source.height;
    const overlayCtx = overlay.getContext("2d");

    if (overlayCtx) {
      const pattern = createScaledPattern(overlayCtx, textureBase, 0.24);
      if (pattern) {
        overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
        overlayCtx.fillStyle = pattern;
        overlayCtx.fillRect(0, 0, overlay.width, overlay.height);

        overlayCtx.globalCompositeOperation = "destination-in";
        overlayCtx.drawImage(mask, 0, 0);

        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.globalCompositeOperation = "multiply";
        ctx.drawImage(overlay, 0, 0);
        ctx.restore();
      }
    }
  }

  if (textureSoft) {
    const overlay = document.createElement("canvas");
    overlay.width = source.width;
    overlay.height = source.height;
    const overlayCtx = overlay.getContext("2d");

    if (overlayCtx) {
      const pattern = createScaledPattern(overlayCtx, textureSoft, 0.28);
      if (pattern) {
        overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
        overlayCtx.fillStyle = pattern;
        overlayCtx.fillRect(0, 0, overlay.width, overlay.height);

        overlayCtx.globalCompositeOperation = "destination-in";
        overlayCtx.drawImage(mask, 0, 0);

        ctx.save();
        ctx.globalAlpha = 0.14;
        ctx.globalCompositeOperation = "multiply";
        ctx.drawImage(overlay, 0, 0);
        ctx.restore();
      }
    }
  }

  if (textureNoise) {
    const overlay = document.createElement("canvas");
    overlay.width = source.width;
    overlay.height = source.height;
    const overlayCtx = overlay.getContext("2d");

    if (overlayCtx) {
      const pattern = createScaledPattern(overlayCtx, textureNoise, 0.16);
      if (pattern) {
        overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
        overlayCtx.fillStyle = pattern;
        overlayCtx.fillRect(0, 0, overlay.width, overlay.height);

        overlayCtx.globalCompositeOperation = "destination-in";
        overlayCtx.drawImage(mask, 0, 0);

        ctx.save();
        ctx.globalAlpha = 0.05;
        ctx.globalCompositeOperation = "multiply";
        ctx.drawImage(overlay, 0, 0);
        ctx.restore();
      }
    }
  }

  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  const fade = ctx.createLinearGradient(0, 0, 0, printed.height);
  fade.addColorStop(0, "rgba(255,255,255,0.03)");
  fade.addColorStop(0.45, "rgba(255,255,255,0)");
  fade.addColorStop(1, "rgba(0,0,0,0.08)");
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, printed.width, printed.height);
  ctx.restore();

  applyCanvasNoise(ctx, printed.width, printed.height, 6);

  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";

  return printed;
}

function getFrameThickness(
  canvasWidth: number,
  canvasHeight: number,
  isFramePlacement: boolean
) {
  return isFramePlacement
    ? clamp(Math.min(canvasWidth, canvasHeight) * 0.035, 12, 24)
    : 0;
}

function getCanvasLayout(params: {
  canvasWidth: number;
  canvasHeight: number;
  displayWidth: number;
  borderThickness: number;
  isFramePlacement: boolean;
}): CanvasLayout {
  const {
    canvasWidth,
    canvasHeight,
    displayWidth,
    borderThickness,
    isFramePlacement,
  } = params;

  const frameThickness = getFrameThickness(
    canvasWidth,
    canvasHeight,
    isFramePlacement
  );

  const matAreaWidth = canvasWidth - frameThickness * 2;
  const scale = matAreaWidth / displayWidth;
  const rawBorderPx = borderThickness * scale;

  const outerX = frameThickness;
  const outerY = frameThickness;
  const outerW = canvasWidth - frameThickness * 2;
  const outerH = canvasHeight - frameThickness * 2;

  const maxAllowedBorder = Math.min(outerW, outerH) * 0.24;
  const borderPx = clamp(rawBorderPx, 0, maxAllowedBorder);

  const innerX = outerX + borderPx;
  const innerY = outerY + borderPx;
  const innerW = outerW - borderPx * 2;
  const innerH = outerH - borderPx * 2;

  const canvasOuterRadius = isFramePlacement
    ? 0
    : Math.max(8, Math.min(canvasWidth, canvasHeight) * 0.018);

  const matOuterRadius = isFramePlacement ? 0 : Math.max(6, canvasOuterRadius - 2);
  const innerRadius = isFramePlacement ? 0 : Math.max(5, matOuterRadius - 2);

  return {
    frameThickness,
    borderPx,
    canvasOuterRadius,
    matOuterRadius,
    innerRadius,
    outerX,
    outerY,
    outerW,
    outerH,
    innerX,
    innerY,
    innerW,
    innerH,
  };
}

export function MatCanvas({ config, onLogoUpdate }: MatCanvasProps) {
  const t = useTranslations("MatCanvas");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });
  const [pixelRatio, setPixelRatio] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [textures, setTextures] = useState<TextureSet>({
    base: null,
    soft: null,
    noise: null,
  });

  const { width: matWidth, height: matHeight } = config.size;
  const isLandscape = config.orientation === "landscape";
  const isFramePlacement = config.placement === "frame";

  const displayWidth = isLandscape
    ? Math.max(matWidth, matHeight)
    : Math.min(matWidth, matHeight);

  const displayHeight = isLandscape
    ? Math.min(matWidth, matHeight)
    : Math.max(matWidth, matHeight);

  const borderThickness = config.rubberBorder ? 2 : 0;

           const selectedMatColor = useMemo(() => {
    const activeColors =
      config.type === "outdoor" && config.outdoorSubtype === "printgrass"
        ? PRINTGRASS_COLORS
        : config.type === "outdoor" && config.outdoorSubtype === "signature"
        ? SIGNATURE_COLORS
        : MAT_COLORS;

    return activeColors.find((c) => c.code === config.colorCode)?.hex || "#4a4a4a";
  }, [config.colorCode, config.type, config.outdoorSubtype]);

  const isPrintGrass = config.type === "outdoor" && config.outdoorSubtype === "printgrass";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    }
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      // Op smartphones max. ~45% van de schermhoogte, zodat de stappen in beeld blijven.
      const maxHeight = window.innerWidth < 640 ? Math.max(220, window.innerHeight * 0.45) : 700;
      const aspectRatio = displayWidth / displayHeight;

      let matWidthPx = containerWidth - 32;
      let matHeightPx = matWidthPx / aspectRatio;

      if (matHeightPx > maxHeight) {
        matHeightPx = maxHeight;
        matWidthPx = matHeightPx * aspectRatio;
      }

      const estimatedFrameThickness = isFramePlacement
        ? clamp(Math.min(matWidthPx, matHeightPx) * 0.035, 12, 24)
        : 0;

      const totalWidth = matWidthPx + estimatedFrameThickness * 2;
      const totalHeight = matHeightPx + estimatedFrameThickness * 2;

      setCanvasSize({
        width: Math.max(280, Math.round(totalWidth)),
        height: Math.max(180, Math.round(totalHeight)),
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [displayWidth, displayHeight, isFramePlacement]);

  useEffect(() => {
    let mounted = true;

    if (config.logo.dataUrl) {
      loadImage(config.logo.dataUrl)
        .then((img) => {
          if (mounted) setLogoImage(img);
        })
        .catch(() => {
          if (mounted) setLogoImage(null);
        });
    } else {
      setLogoImage(null);
    }

    return () => {
      mounted = false;
    };
  }, [config.logo.dataUrl]);

   useEffect(() => {
    let mounted = true;
    const activeTextures = isPrintGrass ? PRINTGRASS_TEXTURES : STANDARD_TEXTURES;

    Promise.all([
      loadImage(activeTextures.base).catch(() => null),
      loadImage(activeTextures.soft).catch(() => null),
    ]).then(([base, soft]) => {
      if (!mounted) return;
      setTextures({ base, soft, noise: getNoiseTexture() });
    });

    return () => {
      mounted = false;
    };
  }, [isPrintGrass]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvasSize.width;
    const height = canvasSize.height;

    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const layout = getCanvasLayout({
      canvasWidth: width,
      canvasHeight: height,
      displayWidth,
      borderThickness,
      isFramePlacement,
    });

    // Voor de 3D/AR-weergave: hoe breed het inbouwframe rond de mat is (in CSS-pixels).
    canvas.dataset.matInset = String(layout.frameThickness);

    const {
      frameThickness,
      canvasOuterRadius,
      matOuterRadius,
      innerRadius,
      outerX,
      outerY,
      outerW,
      outerH,
      innerX,
      innerY,
      innerW,
      innerH,
    } = layout;

    const baseColor = muteHex(selectedMatColor);
    const topColor = lightenHex(baseColor, 0.14);
    const bottomColor = darkenHex(baseColor, 0.20);

    if (!isFramePlacement) {
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.18)";
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      straightRectPath(
        ctx,
        outerX + 4,
        outerY + 4,
        outerW - 8,
        outerH - 8
      );
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.08)";
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = "rgba(0,0,0,0.025)";
      straightRectPath(
        ctx,
        outerX + 10,
        outerY + 10,
        outerW - 20,
        outerH - 20
      );
      ctx.fill();
      ctx.restore();
    }

    if (isFramePlacement) {
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.14)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      straightRectPath(ctx, 1, 1, width - 2, height - 2);
      ctx.fill();
      ctx.restore();

      const frameGradient = ctx.createLinearGradient(0, 0, width, height);
      frameGradient.addColorStop(0, "#f2f2f2");
      frameGradient.addColorStop(0.16, "#d6d6d6");
      frameGradient.addColorStop(0.5, "#a3a3a3");
      frameGradient.addColorStop(0.82, "#d9d9d9");
      frameGradient.addColorStop(1, "#f7f7f7");

      ctx.save();
      straightRectPath(ctx, 0, 0, width, height);
      ctx.fillStyle = frameGradient;
      ctx.fill();

      if (textures.noise) {
        const metalNoise = createScaledPattern(ctx, textures.noise, 0.22);
        if (metalNoise) {
          ctx.globalAlpha = 0.03;
          ctx.fillStyle = metalNoise;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = 1;
      straightRectPath(ctx, 0.5, 0.5, width - 1, height - 1);
      ctx.stroke();

      ctx.strokeStyle = "rgba(90,90,90,0.45)";
      ctx.lineWidth = 1;
      straightRectPath(ctx, 1.5, 1.5, width - 3, height - 3);
      ctx.stroke();
      ctx.restore();

      const recessInset = clamp(frameThickness * 0.14, 2, 4);
      const recessX = outerX - recessInset;
      const recessY = outerY - recessInset;
      const recessW = outerW + recessInset * 2;
      const recessH = outerH + recessInset * 2;

      const recessGradient = ctx.createLinearGradient(
        recessX,
        recessY,
        recessX,
        recessY + recessH
      );
      recessGradient.addColorStop(0, "rgba(55,55,55,0.34)");
      recessGradient.addColorStop(0.35, "rgba(25,25,25,0.12)");
      recessGradient.addColorStop(1, "rgba(0,0,0,0.24)");

      ctx.save();
      straightRectPath(ctx, recessX, recessY, recessW, recessH);
      ctx.fillStyle = recessGradient;
      ctx.fill();
      ctx.restore();

      ctx.save();
      straightRectPath(
        ctx,
        recessX + 0.5,
        recessY + 0.5,
        recessW - 1,
        recessH - 1
      );
      ctx.strokeStyle = "rgba(255,255,255,0.10)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    if (config.rubberBorder) {
      const rubberGradient = ctx.createLinearGradient(0, outerY, 0, outerY + outerH);
      rubberGradient.addColorStop(0, "#2a2a2a");
      rubberGradient.addColorStop(0.5, "#161616");
      rubberGradient.addColorStop(1, "#101010");

      ctx.save();
      straightRectPath(ctx, outerX, outerY, outerW, outerH);
      ctx.fillStyle = rubberGradient;
      ctx.fill();

      if (textures.noise) {
        const noisePattern = createScaledPattern(ctx, textures.noise, 0.25);
        if (noisePattern) {
          ctx.globalAlpha = 0.05;
          ctx.fillStyle = noisePattern;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      straightRectPath(
        ctx,
        outerX + 0.5,
        outerY + 0.5,
        outerW - 1,
        outerH - 1
      );
      ctx.stroke();

      ctx.restore();
    }

    ctx.save();
    straightRectPath(ctx, innerX, innerY, innerW, innerH);
    ctx.clip();

    const matGradient = ctx.createLinearGradient(innerX, innerY, innerX, innerY + innerH);
    matGradient.addColorStop(0, topColor);
    matGradient.addColorStop(0.5, baseColor);
    matGradient.addColorStop(1, bottomColor);
    ctx.fillStyle = matGradient;
    ctx.fillRect(innerX, innerY, innerW, innerH);

    const sideLight = ctx.createLinearGradient(innerX, innerY, innerX + innerW, innerY);
    sideLight.addColorStop(0, "rgba(255,255,255,0.03)");
    sideLight.addColorStop(0.4, "rgba(255,255,255,0.01)");
    sideLight.addColorStop(1, "rgba(0,0,0,0.04)");
    ctx.fillStyle = sideLight;
    ctx.fillRect(innerX, innerY, innerW, innerH);

        if (textures.base) {
      const scale = isPrintGrass ? 0.5 : 0.35;
      const pattern = createScaledPattern(ctx, textures.base, scale);
      if (pattern) {
        ctx.save();
        ctx.globalAlpha = isPrintGrass ? 0.55 : 0.16;
        ctx.globalCompositeOperation = isPrintGrass ? "multiply" : "source-over";
        ctx.fillStyle = pattern;
        ctx.fillRect(innerX, innerY, innerW, innerH);
        ctx.restore();
      }
    }

    if (textures.soft) {
      const scale = isPrintGrass ? 0.6 : 0.42;
      const pattern = createScaledPattern(ctx, textures.soft, scale);
      if (pattern) {
        ctx.save();
        ctx.globalAlpha = isPrintGrass ? 0.35 : 0.15;
        ctx.globalCompositeOperation = isPrintGrass ? "multiply" : "source-over";
        ctx.fillStyle = pattern;
        ctx.fillRect(innerX, innerY, innerW, innerH);
        ctx.restore();
      }
    }

    if (textures.noise) {
      const pattern = createScaledPattern(ctx, textures.noise, 0.18);
      if (pattern) {
        ctx.globalAlpha = 0.03;
        ctx.fillStyle = pattern;
        ctx.fillRect(innerX, innerY, innerW, innerH);
        ctx.globalAlpha = 1;
      }
    }

    const pileGradient = ctx.createLinearGradient(innerX, innerY, innerX, innerY + innerH);
    pileGradient.addColorStop(0, "rgba(255,255,255,0.03)");
    pileGradient.addColorStop(0.2, "rgba(255,255,255,0.01)");
    pileGradient.addColorStop(1, "rgba(0,0,0,0.05)");
    ctx.fillStyle = pileGradient;
    ctx.fillRect(innerX, innerY, innerW, innerH);

    if (logoImage && config.logo.dataUrl) {
      const preparedLogo = createPreparedLogoCanvas(logoImage);

      if (preparedLogo) {
        const printedLogo = createPrintedLogoCanvas(
          preparedLogo,
          textures.base,
          textures.soft,
          textures.noise
        );

        const { width: logoWidth, height: logoHeight } = getRenderedLogoSize(
          printedLogo,
          config.logo.scale,
          innerW,
          innerH
        );

        const logoCenterX = innerX + innerW * config.logo.position.x;
        const logoCenterY = innerY + innerH * config.logo.position.y;

        ctx.save();
        ctx.translate(logoCenterX, logoCenterY);
        ctx.rotate((config.logo.rotation * Math.PI) / 180);
        ctx.globalAlpha = 0.96;
        ctx.filter = "none";
        ctx.globalCompositeOperation = "source-over";
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
          printedLogo,
          -logoWidth / 2,
          -logoHeight / 2,
          logoWidth,
          logoHeight
        );

        ctx.restore();
      }
    }

    ctx.restore();

    ctx.save();
    straightRectPath(ctx, innerX, innerY, innerW, innerH);
    ctx.clip();

    const edgeSize = Math.max(10, Math.min(innerW, innerH) * 0.035);

    const topEdge = ctx.createLinearGradient(0, innerY, 0, innerY + edgeSize);
    topEdge.addColorStop(0, "rgba(255,255,255,0.05)");
    topEdge.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = topEdge;
    ctx.fillRect(innerX, innerY, innerW, edgeSize);

    const bottomEdge = ctx.createLinearGradient(
      0,
      innerY + innerH - edgeSize,
      0,
      innerY + innerH
    );
    bottomEdge.addColorStop(0, "rgba(0,0,0,0)");
    bottomEdge.addColorStop(1, "rgba(0,0,0,0.10)");
    ctx.fillStyle = bottomEdge;
    ctx.fillRect(innerX, innerY + innerH - edgeSize, innerW, edgeSize);

    const rightEdge = ctx.createLinearGradient(
      innerX + innerW - edgeSize,
      0,
      innerX + innerW,
      0
    );
    rightEdge.addColorStop(0, "rgba(0,0,0,0)");
    rightEdge.addColorStop(1, "rgba(0,0,0,0.06)");
    ctx.fillStyle = rightEdge;
    ctx.fillRect(innerX + innerW - edgeSize, innerY, edgeSize, innerH);

    ctx.restore();

    ctx.save();
    ctx.strokeStyle = isFramePlacement
      ? "rgba(255,255,255,0.02)"
      : "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    straightRectPath(ctx, innerX + 0.5, innerY + 0.5, innerW - 1, innerH - 1);
    ctx.stroke();
    ctx.restore();

    if (isFramePlacement) {
      ctx.save();
      straightRectPath(ctx, outerX, outerY, outerW, outerH);
      ctx.clip();

      const insetShade = ctx.createLinearGradient(
        0,
        outerY,
        0,
        outerY + Math.max(12, frameThickness)
      );
      insetShade.addColorStop(0, "rgba(0,0,0,0.12)");
      insetShade.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = insetShade;
      ctx.fillRect(outerX, outerY, outerW, Math.max(12, frameThickness));

      ctx.restore();
    }
  }, [
    canvasSize,
    pixelRatio,
    displayWidth,
    borderThickness,
    selectedMatColor,
    textures,
    logoImage,
    config,
    isFramePlacement,
  ]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleMouseDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!logoImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    const layout = getCanvasLayout({
      canvasWidth: canvasSize.width,
      canvasHeight: canvasSize.height,
      displayWidth,
      borderThickness,
      isFramePlacement,
    });

    const { innerX, innerY, innerW, innerH } = layout;

    const relX = (localX - innerX) / innerW;
    const relY = (localY - innerY) / innerH;

    if (relX < 0 || relX > 1 || relY < 0 || relY > 1) return;

    const preparedLogo = createPreparedLogoCanvas(logoImage);
    if (!preparedLogo) return;

    const { width: logoWidth, height: logoHeight } = getRenderedLogoSize(
      preparedLogo,
      config.logo.scale,
      innerW,
      innerH
    );

    const logoNormW = logoWidth / innerW;
    const logoNormH = logoHeight / innerH;

    const isInsideLogo =
      Math.abs(relX - config.logo.position.x) <= logoNormW / 2 &&
      Math.abs(relY - config.logo.position.y) <= logoNormH / 2;

    if (!isInsideLogo) return;

    // Vinger blijft "vast" aan het logo, ook als hij even buiten het canvas komt.
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    setDragStart({
      x: relX - config.logo.position.x,
      y: relY - config.logo.position.y,
    });
  };

  const handleMouseMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging || !logoImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    const layout = getCanvasLayout({
      canvasWidth: canvasSize.width,
      canvasHeight: canvasSize.height,
      displayWidth,
      borderThickness,
      isFramePlacement,
    });

    const { innerX, innerY, innerW, innerH } = layout;

    const relX = (localX - innerX) / innerW;
    const relY = (localY - innerY) / innerH;

    const preparedLogo = createPreparedLogoCanvas(logoImage);
    if (!preparedLogo) return;

    const { width: logoWidth, height: logoHeight } = getRenderedLogoSize(
      preparedLogo,
      config.logo.scale,
      innerW,
      innerH
    );

    const halfNormW = logoWidth / innerW / 2;
    const halfNormH = logoHeight / innerH / 2;

    const newX = clamp(relX - dragStart.x, halfNormW, 1 - halfNormW);
    const newY = clamp(relY - dragStart.y, halfNormH, 1 - halfNormH);

    onLogoUpdate({
      position: { x: newX, y: newY },
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCenterLogo = () => {
    onLogoUpdate({ position: { x: 0.5, y: 0.5 } });
  };

  const handleDeleteLogo = () => {
    onLogoUpdate({
      file: null,
      dataUrl: null,
      position: { x: 0.5, y: 0.5 },
      scale: 1,
      rotation: 0,
    });
  };

  return (
    <div ref={containerRef} className="space-y-4">
      <div className="relative flex items-center justify-center">
        <canvas
  id="carpetz-mat-preview-canvas"
  ref={canvasRef}
  data-mat-canvas="true"
  className={cn(
    "cursor-crosshair",
    isDragging && "cursor-grabbing",
    // Met logo: vinger-slepen verplaatst het logo i.p.v. de pagina te scrollen.
    config.logo.dataUrl ? "touch-none" : "touch-pan-y"
  )}
  onPointerDown={handleMouseDown}
  onPointerMove={handleMouseMove}
  onPointerUp={handleMouseUp}
  onPointerCancel={handleMouseUp}
/>
      </div>

      {config.logo.dataUrl && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <Button size="sm" variant="outline" onClick={handleCenterLogo}>
              <Crosshair className="w-4 h-4 mr-1" />
              {t("center")}
            </Button>

            <Button size="sm" variant="destructive" onClick={handleDeleteLogo}>
              <Trash2 className="w-4 h-4 mr-1" />
              {t("delete")}
            </Button>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-1">
                  <ZoomIn className="w-4 h-4" />
                  {t("scale")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(config.logo.scale * 100)}%
                </span>
              </div>

              <Slider
                value={[config.logo.scale * 100]}
                onValueChange={(values) => {
                  const newValue = Array.isArray(values) ? values[0] : values;
                  onLogoUpdate({ scale: newValue / 100 });
                }}
                min={10}
                max={300}
                step={5}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-1">
                  <RotateCw className="w-4 h-4" />
                  {t("rotation")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {config.logo.rotation}°
                </span>
              </div>

              <Slider
                value={[config.logo.rotation]}
                onValueChange={(values) => {
                  const newValue = Array.isArray(values) ? values[0] : values;
                  onLogoUpdate({ rotation: newValue });
                }}
                min={0}
                max={360}
                step={5}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Move className="w-3 h-3" />
            {t("dragHint")}
          </p>
        </div>
      )}
    </div>
  );
}
