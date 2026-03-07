export type PhotoVibeAnalysis = {
  palette: string[];
  lighting: string;
  contrast: string;
  moodTags: string[];
  summary: string;
  previewDataUrl: string;
};

type Rgb = {
  r: number;
  g: number;
  b: number;
};

function rgbToHex({ r, g, b }: Rgb) {
  return `#${[r, g, b]
    .map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

function rgbToHsl({ r, g, b }: Rgb) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;

  if (delta === 0) {
    return { h: 0, s: 0, l: lightness };
  }

  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

  let hue = 0;

  switch (max) {
    case red:
      hue = (green - blue) / delta + (green < blue ? 6 : 0);
      break;
    case green:
      hue = (blue - red) / delta + 2;
      break;
    default:
      hue = (red - green) / delta + 4;
      break;
  }

  hue /= 6;

  return { h: hue * 360, s: saturation, l: lightness };
}

function loadImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to read image."));
    image.src = dataUrl;
  });
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to process file."));
    };
    reader.onerror = () => reject(new Error("Unable to process file."));
    reader.readAsDataURL(file);
  });
}

function getLighting(brightness: number) {
  if (brightness < 0.22) return "low-key and nocturnal";
  if (brightness < 0.42) return "soft and moody";
  if (brightness < 0.68) return "balanced and atmospheric";
  return "bright and airy";
}

function getContrast(spread: number) {
  if (spread < 0.18) return "low contrast";
  if (spread < 0.34) return "gentle contrast";
  if (spread < 0.5) return "balanced contrast";
  return "high contrast";
}

function getMoodTags({
  brightness,
  averageSaturation,
  warmth,
  dominantHue,
}: {
  brightness: number;
  averageSaturation: number;
  warmth: number;
  dominantHue: number;
}) {
  const tags = new Set<string>();

  tags.add(brightness < 0.35 ? "moody" : "open");
  tags.add(averageSaturation > 0.45 ? "vivid" : "muted");
  tags.add(warmth > 12 ? "warm glow" : warmth < -12 ? "cool haze" : "neutral tone");

  if (dominantHue >= 200 && dominantHue <= 260) tags.add("night-drive energy");
  if (dominantHue >= 120 && dominantHue <= 170) tags.add("organic calm");
  if (dominantHue >= 20 && dominantHue <= 60) tags.add("golden-hour warmth");
  if (dominantHue >= 300 || dominantHue <= 15) tags.add("dream-pop tint");

  return Array.from(tags).slice(0, 4);
}

export async function analyzePhotoVibe(file: File): Promise<PhotoVibeAnalysis> {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  const maxSize = 96;
  const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
  const width = Math.max(12, Math.round(image.width * scale));
  const height = Math.max(12, Math.round(image.height * scale));

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    throw new Error("Unable to inspect the uploaded image.");
  }

  context.drawImage(image, 0, 0, width, height);

  const { data } = context.getImageData(0, 0, width, height);
  const buckets = new Map<string, { count: number; color: Rgb }>();
  let totalBrightness = 0;
  let totalSaturation = 0;
  let totalWarmth = 0;
  let minBrightness = 1;
  let maxBrightness = 0;
  let weightedHue = 0;
  let hueWeight = 0;

  for (let index = 0; index < data.length; index += 4) {
    const alpha = data[index + 3];

    if (alpha < 200) continue;

    const color = {
      r: data[index],
      g: data[index + 1],
      b: data[index + 2],
    };

    const hsl = rgbToHsl(color);
    const brightness = (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255;
    const key = `${Math.round(color.r / 32)}-${Math.round(color.g / 32)}-${Math.round(color.b / 32)}`;
    const existing = buckets.get(key);

    totalBrightness += brightness;
    totalSaturation += hsl.s;
    totalWarmth += color.r - color.b;
    minBrightness = Math.min(minBrightness, brightness);
    maxBrightness = Math.max(maxBrightness, brightness);
    weightedHue += hsl.h * Math.max(hsl.s, 0.08);
    hueWeight += Math.max(hsl.s, 0.08);

    if (existing) {
      existing.count += 1;
      existing.color = {
        r: (existing.color.r + color.r) / 2,
        g: (existing.color.g + color.g) / 2,
        b: (existing.color.b + color.b) / 2,
      };
    } else {
      buckets.set(key, {
        count: 1,
        color,
      });
    }
  }

  const sampleCount = Math.max(1, Array.from(buckets.values()).reduce((sum, bucket) => sum + bucket.count, 0));
  const palette = Array.from(buckets.values())
    .sort((left, right) => right.count - left.count)
    .slice(0, 4)
    .map((bucket) => rgbToHex(bucket.color));

  const averageBrightness = totalBrightness / sampleCount;
  const averageSaturation = totalSaturation / sampleCount;
  const averageWarmth = totalWarmth / sampleCount;
  const dominantHue = hueWeight > 0 ? weightedHue / hueWeight : 0;
  const lighting = getLighting(averageBrightness);
  const contrast = getContrast(maxBrightness - minBrightness);
  const moodTags = getMoodTags({
    brightness: averageBrightness,
    averageSaturation,
    warmth: averageWarmth,
    dominantHue,
  });

  return {
    palette: palette.length > 0 ? palette : ["#0F172A", "#4338CA", "#22D3EE"],
    lighting,
    contrast,
    moodTags,
    summary: `Extracted ${lighting} lighting, ${contrast}, and a ${moodTags.join(", ")} vibe from the uploaded photo.`,
    previewDataUrl: dataUrl,
  };
}
