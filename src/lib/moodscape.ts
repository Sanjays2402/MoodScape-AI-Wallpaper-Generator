export type InputMethod = "feeling" | "lyrics" | "mood-board" | "photo";

export type StylePreset =
  | "cinematic"
  | "lofi"
  | "cyberpunk"
  | "minimalist"
  | "dark-academia"
  | "cottagecore";

export type AspectRatio =
  | "4k-landscape"
  | "ultrawide"
  | "mobile"
  | "dual-monitor";

export type PaletteKey =
  | "aurora"
  | "midnight"
  | "sunset"
  | "mono"
  | "forest";

export type PhotoAnalysis = {
  palette: string[];
  lighting: string;
  contrast: string;
  moodTags: string[];
  summary: string;
};

export type GeneratePayload = {
  inputMethod: InputMethod;
  prompt: string;
  songReference?: string;
  sourceImageName?: string;
  photoAnalysis?: PhotoAnalysis;
  stylePreset: StylePreset;
  paletteKey: PaletteKey;
  lockedColors: string[];
  aspectRatio: AspectRatio;
  variation: number;
};

export const inputMethods = [
  {
    id: "feeling",
    label: "Type a feeling",
    description: "Describe a mood like 'anxious but hopeful at 2am'.",
  },
  {
    id: "lyrics",
    label: "Paste lyrics",
    description: "Use a lyric fragment, song title, or album reference.",
  },
  {
    id: "mood-board",
    label: "Visual mood board",
    description: "Select the overall aesthetic direction from curated vibes.",
  },
  {
    id: "photo",
    label: "Upload a photo vibe",
    description: "Reference a photo and let MoodScape echo the same energy.",
  },
] as const;

export const stylePresets = [
  {
    id: "cinematic",
    label: "Cinematic / Photorealistic",
    promptFragment: "cinematic lighting, photorealistic environment detail, emotionally charged composition",
  },
  {
    id: "lofi",
    label: "Lofi / Dreamy / Grainy Film",
    promptFragment: "dreamy haze, soft bloom, lo-fi grain, nostalgic texture",
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk / Neon",
    promptFragment: "high contrast neon, wet reflections, futuristic city glow",
  },
  {
    id: "minimalist",
    label: "Minimalist / Abstract",
    promptFragment: "clean shapes, abstract atmosphere, restrained composition, elegant geometry",
  },
  {
    id: "dark-academia",
    label: "Dark Academia",
    promptFragment: "velvet shadows, aged paper tones, poetic interiors, moody amber light",
  },
  {
    id: "cottagecore",
    label: "Cottagecore",
    promptFragment: "gentle daylight, soft botanicals, whimsical countryside warmth",
  },
] as const;

export const paletteOptions = [
  {
    id: "aurora",
    label: "Aurora Glow",
    colors: ["#81E6FF", "#8B5CF6", "#F8FAFC"],
  },
  {
    id: "midnight",
    label: "Midnight Pulse",
    colors: ["#0F172A", "#1D4ED8", "#22D3EE"],
  },
  {
    id: "sunset",
    label: "Afterglow Sunset",
    colors: ["#7C3AED", "#FB7185", "#F59E0B"],
  },
  {
    id: "mono",
    label: "Monochrome Luxe",
    colors: ["#F8FAFC", "#94A3B8", "#0F172A"],
  },
  {
    id: "forest",
    label: "Moss & Mist",
    colors: ["#D9F99D", "#34D399", "#064E3B"],
  },
] as const;

export const aspectRatios = [
  {
    id: "4k-landscape",
    label: "4K Desktop",
    resolution: "3840×2160",
    aspectClassName: "aspect-[16/9]",
  },
  {
    id: "ultrawide",
    label: "Ultrawide",
    resolution: "5120×2160",
    aspectClassName: "aspect-[21/9]",
  },
  {
    id: "mobile",
    label: "Mobile",
    resolution: "1440×2560",
    aspectClassName: "aspect-[9/16]",
  },
  {
    id: "dual-monitor",
    label: "Dual Monitor",
    resolution: "7680×2160",
    aspectClassName: "aspect-[32/9]",
  },
] as const;

export const randomPrompts = [
  {
    inputMethod: "feeling" as InputMethod,
    prompt: "quiet victory after a week that almost broke me",
    songReference: "",
  },
  {
    inputMethod: "lyrics" as InputMethod,
    prompt: "we'll be alright by sunrise",
    songReference: "Late-night indie synth",
  },
  {
    inputMethod: "mood-board" as InputMethod,
    prompt: "silver rain, fluorescent signs, passing trains, hopeful insomnia",
    songReference: "",
  },
  {
    inputMethod: "photo" as InputMethod,
    prompt: "extract the calm from a foggy mountain lake at blue hour",
    songReference: "",
  },
] as const;

type DemoResult = {
  id: string;
  title: string;
  summary: string;
  prompt: string;
  gradient: string;
  palette: string[];
  resolution: string;
  styleLabel: string;
  aspectLabel: string;
  previewUrl: string;
  downloadName: string;
  suggestions: string[];
  mode: "demo";
};

const fallbackPrompt = "hopeful midnight city haze";

function parseResolution(resolution: string) {
  const [width, height] = resolution.split("×").map((value) => Number(value.trim()));

  return {
    width: Number.isFinite(width) ? width : 3840,
    height: Number.isFinite(height) ? height : 2160,
  };
}

function createDemoPreviewSvg({
  title,
  styleLabel,
  colors,
  prompt,
  resolution,
  variation,
}: {
  title: string;
  styleLabel: string;
  colors: string[];
  prompt: string;
  resolution: string;
  variation: number;
}) {
  const { width, height } = parseResolution(resolution);
  const [c1, c2, c3] = [colors[0] ?? "#0F172A", colors[1] ?? colors[0] ?? "#4338CA", colors[2] ?? colors[1] ?? colors[0] ?? "#F8FAFC"];
  const safePrompt = prompt.length > 120 ? `${prompt.slice(0, 117)}...` : prompt;
  const orbScale = 240 + variation * 3;
  const blurScale = 110 + variation * 1.4;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="55%" stop-color="${c2}" />
          <stop offset="100%" stop-color="${c3}" />
        </linearGradient>
        <radialGradient id="glowA" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${width * 0.22} ${height * 0.28}) rotate(24) scale(${orbScale} ${orbScale * 0.78})">
          <stop stop-color="#FFFFFF" stop-opacity="0.72" />
          <stop offset="1" stop-color="#FFFFFF" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="glowB" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${width * 0.78} ${height * 0.34}) rotate(12) scale(${orbScale * 0.9} ${orbScale * 0.68})">
          <stop stop-color="${c3}" stop-opacity="0.65" />
          <stop offset="1" stop-color="${c3}" stop-opacity="0" />
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="${blurScale}" />
        </filter>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.045"/>
          </feComponentTransfer>
        </filter>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="rgba(255,255,255,0.18)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0.06)" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)" />
      <ellipse cx="${width * 0.22}" cy="${height * 0.32}" rx="${orbScale}" ry="${orbScale * 0.72}" fill="url(#glowA)" filter="url(#blur)" />
      <ellipse cx="${width * 0.75}" cy="${height * 0.34}" rx="${orbScale * 0.82}" ry="${orbScale * 0.58}" fill="url(#glowB)" filter="url(#blur)" />
      <path d="M ${width * 0.08} ${height * 0.75} C ${width * 0.24} ${height * (0.52 - variation / 500)}, ${width * 0.43} ${height * 0.92}, ${width * 0.61} ${height * 0.71} S ${width * 0.88} ${height * 0.45}, ${width * 0.96} ${height * 0.67}" stroke="rgba(255,255,255,0.24)" stroke-width="${Math.max(6, width / 240)}" stroke-linecap="round" opacity="0.55" />
      <path d="M ${width * 0.12} ${height * 0.84} C ${width * 0.29} ${height * 0.69}, ${width * 0.46} ${height * 1.02}, ${width * 0.67} ${height * 0.83} S ${width * 0.91} ${height * 0.61}, ${width * 1.02} ${height * 0.84}" stroke="rgba(255,255,255,0.14)" stroke-width="${Math.max(4, width / 320)}" stroke-linecap="round" opacity="0.5" />
      <rect x="${width * 0.06}" y="${height * 0.07}" width="${width * 0.33}" height="${height * 0.06}" rx="${height * 0.03}" fill="rgba(255,255,255,0.12)" />
      <rect x="${width * 0.06}" y="${height * 0.68}" width="${width * 0.45}" height="${height * 0.21}" rx="${height * 0.03}" fill="rgba(5,10,24,0.24)" stroke="rgba(255,255,255,0.14)" />
      <text x="${width * 0.085}" y="${height * 0.77}" fill="#FFFFFF" font-family="Inter, Arial, sans-serif" font-size="${Math.max(42, width / 28)}" font-weight="700">${title}</text>
      <text x="${width * 0.085}" y="${height * 0.815}" fill="rgba(255,255,255,0.76)" font-family="Inter, Arial, sans-serif" font-size="${Math.max(18, width / 62)}" font-weight="500">${styleLabel}</text>
      <text x="${width * 0.085}" y="${height * 0.855}" fill="rgba(255,255,255,0.62)" font-family="Inter, Arial, sans-serif" font-size="${Math.max(16, width / 82)}">${safePrompt.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</text>
      <rect width="${width}" height="${height}" filter="url(#grain)" opacity="0.3" />
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function buildDemoWallpaper(payload: GeneratePayload): DemoResult {
  const style = stylePresets.find((item) => item.id === payload.stylePreset) ?? stylePresets[0];
  const palette = paletteOptions.find((item) => item.id === payload.paletteKey) ?? paletteOptions[0];
  const aspect = aspectRatios.find((item) => item.id === payload.aspectRatio) ?? aspectRatios[0];
  const colors =
    payload.lockedColors.length > 0
      ? payload.lockedColors
      : payload.photoAnalysis?.palette?.length
        ? payload.photoAnalysis.palette.slice(0, 3)
        : [...palette.colors];
  const emotionalSeed = payload.prompt.trim() || payload.songReference?.trim() || fallbackPrompt;
  const intensity = payload.variation > 70 ? "experimental" : payload.variation > 35 ? "balanced" : "grounded";
  const photoContext = payload.photoAnalysis
    ? `Photo analysis suggests ${payload.photoAnalysis.summary} Dominant tones: ${payload.photoAnalysis.palette.join(", ")}.`
    : "";

  const prompt = [
    `Create a ${style.label.toLowerCase()} wallpaper concept for the feeling: ${emotionalSeed}.`,
    `Visual language: ${style.promptFragment}.`,
    `Keep the palette focused on ${colors.join(", ")}.`,
    `Composition should fit ${aspect.label.toLowerCase()} format at ${aspect.resolution}.`,
    `Output style should feel ${intensity}, premium, atmospheric, and wallpaper-safe with room for desktop icons.`,
    payload.songReference ? `Music reference: ${payload.songReference}.` : "",
    payload.sourceImageName ? `Photo inspiration source: ${payload.sourceImageName}.` : "",
    photoContext,
  ]
    .filter(Boolean)
    .join(" ");

  const titleSeed = emotionalSeed
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  const gradient = `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1] ?? colors[0]} 52%, ${colors[2] ?? colors[1] ?? colors[0]} 100%)`;
  const title = titleSeed || "Midnight Bloom";
  const previewUrl = createDemoPreviewSvg({
    title,
    styleLabel: style.label,
    colors,
    prompt: emotionalSeed,
    resolution: aspect.resolution,
    variation: payload.variation,
  });

  return {
    id: crypto.randomUUID(),
    title,
    summary: `A ${intensity} ${style.label.toLowerCase()} wallpaper direction shaped from ${payload.inputMethod.replace("-", " ")} input.`,
    prompt,
    gradient,
    palette: [...colors],
    resolution: aspect.resolution,
    styleLabel: style.label,
    aspectLabel: aspect.label,
    previewUrl,
    downloadName: `${title.toLowerCase().replace(/\s+/g, "-")}-moodscape-demo.svg`,
    suggestions: [
      "Try a darker locked color to create stronger depth behind desktop icons.",
      "Increase variation for wilder shapes, stranger skies, and more stylized lighting.",
      "Switch to ultrawide when the scene needs extra breathing room and panoramic storytelling.",
    ],
    mode: "demo",
  };
}
