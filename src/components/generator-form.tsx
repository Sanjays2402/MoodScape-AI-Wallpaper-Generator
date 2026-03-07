"use client";

import Image from "next/image";
import { useMemo, useState, type ChangeEvent } from "react";
import {
  ArrowRight,
  Download,
  ImagePlus,
  LoaderCircle,
  Lock,
  MonitorSmartphone,
  Music4,
  Palette,
  Shuffle,
  Sparkles,
} from "lucide-react";
import {
  aspectRatios,
  inputMethods,
  paletteOptions,
  randomPrompts,
  stylePresets,
  type AspectRatio,
  type GeneratePayload,
  type InputMethod,
  type PaletteKey,
  type StylePreset,
} from "@/lib/moodscape";
import { analyzePhotoVibe, type PhotoVibeAnalysis } from "@/lib/photo-vibe";
import { parseSpotifyUrl } from "@/lib/spotify";

type GenerationResponse = {
  success: boolean;
  result: {
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
  provider: string;
  note: string;
};

const defaultPalette = paletteOptions[0];

export function GeneratorForm() {
  const [inputMethod, setInputMethod] = useState<InputMethod>("feeling");
  const [prompt, setPrompt] = useState("anxious but hopeful at 2am");
  const [songReference, setSongReference] = useState("");
  const [sourceImageName, setSourceImageName] = useState("");
  const [stylePreset, setStylePreset] = useState<StylePreset>("lofi");
  const [paletteKey, setPaletteKey] = useState<PaletteKey>(defaultPalette.id);
  const [lockedColors, setLockedColors] = useState<string[]>([...defaultPalette.colors]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("4k-landscape");
  const [variation, setVariation] = useState(54);
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoAnalysis, setPhotoAnalysis] = useState<PhotoVibeAnalysis | null>(null);
  const [result, setResult] = useState<GenerationResponse["result"] | null>(null);
  const [note, setNote] = useState<string>("Demo mode builds a premium prompt package and visual concept preview.");

  const selectedAspect = useMemo(
    () => aspectRatios.find((item) => item.id === aspectRatio) ?? aspectRatios[0],
    [aspectRatio],
  );
  const spotifyLink = useMemo(() => parseSpotifyUrl(songReference), [songReference]);

  const handlePaletteChange = (nextPalette: PaletteKey) => {
    setPaletteKey(nextPalette);
    const option = paletteOptions.find((item) => item.id === nextPalette);
    setLockedColors([...(option?.colors ?? defaultPalette.colors)]);
  };

  const handleRandomize = () => {
    const promptPack = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    const nextStyle = stylePresets[Math.floor(Math.random() * stylePresets.length)];
    const nextPalette = paletteOptions[Math.floor(Math.random() * paletteOptions.length)];

    setInputMethod(promptPack.inputMethod);
    setPrompt(promptPack.prompt);
    setSongReference("");
    setSourceImageName("");
    setPhotoAnalysis(null);
    setPhotoError(null);
    setStylePreset(nextStyle.id);
    setPaletteKey(nextPalette.id);
    setLockedColors([...nextPalette.colors]);
    setVariation(Math.floor(Math.random() * 100));
    setError(null);
  };

  const handlePhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPhotoLoading(true);
    setPhotoError(null);

    try {
      const analysis = await analyzePhotoVibe(file);
      setInputMethod("photo");
      setSourceImageName(file.name);
      setPhotoAnalysis(analysis);
      setLockedColors(analysis.palette.slice(0, 3));
      setPrompt((currentPrompt) =>
        currentPrompt.trim().length > 0
          ? currentPrompt
          : `translate this uploaded photo into an emotional wallpaper with ${analysis.moodTags.join(", ")}`,
      );
      setNote("Uploaded photo analyzed locally. MoodScape is now blending real image vibe cues into the wallpaper prompt.");
    } catch (uploadError) {
      setPhotoError(uploadError instanceof Error ? uploadError.message : "Unable to analyze photo.");
    } finally {
      setPhotoLoading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload: GeneratePayload = {
      inputMethod,
      prompt,
      songReference,
      sourceImageName,
      photoAnalysis: photoAnalysis
        ? {
            palette: photoAnalysis.palette,
            lighting: photoAnalysis.lighting,
            contrast: photoAnalysis.contrast,
            moodTags: photoAnalysis.moodTags,
            summary: photoAnalysis.summary,
          }
        : undefined,
      stylePreset,
      paletteKey,
      lockedColors,
      aspectRatio,
      variation,
    };

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to build wallpaper concept.");
      }

      const data = (await response.json()) as GenerationResponse;
      setResult(data.result);
      setNote(data.note);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="glass-strong rounded-[2rem] p-4 sm:p-5 2xl:sticky 2xl:top-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">Generator</p>
          <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">Build a wallpaper direction</h2>
        </div>
        <button
          type="button"
          onClick={handleRandomize}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          <Shuffle className="h-4 w-4" />
          Surprise Me
        </button>
      </div>

      <div className="grid gap-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2 2xl:grid-cols-4">
            {inputMethods.map((method) => {
              const active = method.id === inputMethod;

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setInputMethod(method.id)}
                  className={`rounded-2xl border px-3 py-3 text-left transition ${
                    active
                      ? "border-cyan-300/40 bg-cyan-400/10"
                      : "border-white/10 bg-white/4 hover:bg-white/7"
                  }`}
                >
                  <p className="text-sm font-medium text-white">{method.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400 xl:hidden 2xl:block">{method.description}</p>
                </button>
              );
            })}
          </div>

          <label className="block">
            <span className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-white/90">
              {inputMethod === "lyrics" ? <Music4 className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              Mood or lyric input
            </span>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-[#09101f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/30"
              placeholder="Describe a feeling, lyric fragment, or the vibe you want to see on screen..."
            />
          </label>

          <div className="grid gap-3 2xl:grid-cols-2">
            <label className="block">
              <span className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-white/90">
                <Music4 className="h-4 w-4" />
                Song reference
              </span>
              <input
                value={songReference}
                onChange={(event) => setSongReference(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#09101f] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/30"
                placeholder="https://open.spotify.com/track/6qqrTXSdwiJaq8SO0X2lSe"
              />
              <div className="mt-2 min-h-5 text-xs text-slate-400">
                {spotifyLink
                  ? `Spotify ${spotifyLink.type} detected. MoodScape will extract link context automatically.`
                  : "Paste plain text or any Spotify track, album, playlist, artist, or show URL."}
              </div>
            </label>

            <div className="block">
              <span className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-white/90">
                <ImagePlus className="h-4 w-4" />
                Photo vibe upload
              </span>
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-white/15 bg-[#09101f] px-4 py-3 text-sm text-white transition hover:border-cyan-300/30 hover:bg-[#0b1528]">
                <div>
                  <p className="font-medium text-white">
                    {photoLoading ? "Analyzing uploaded photo..." : sourceImageName || "Choose an image"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Real upload. Mood, lighting, and palette are extracted locally.
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                  Browse
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="sr-only"
                />
              </label>
              {photoError ? <p className="mt-2 text-sm text-rose-300">{photoError}</p> : null}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            <label className="block">
              <span className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-white/90">
                <Sparkles className="h-4 w-4" />
                Style preset
              </span>
              <select
                value={stylePreset}
                onChange={(event) => setStylePreset(event.target.value as StylePreset)}
                className="w-full rounded-2xl border border-white/10 bg-[#09101f] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/30"
              >
                {stylePresets.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-white/90">
                <Palette className="h-4 w-4" />
                Palette lock
              </span>
              <select
                value={paletteKey}
                onChange={(event) => handlePaletteChange(event.target.value as PaletteKey)}
                className="w-full rounded-2xl border border-white/10 bg-[#09101f] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/30"
              >
                {paletteOptions.map((palette) => (
                  <option key={palette.id} value={palette.id}>
                    {palette.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-white/90">
                <MonitorSmartphone className="h-4 w-4" />
                Aspect ratio
              </span>
              <select
                value={aspectRatio}
                onChange={(event) => setAspectRatio(event.target.value as AspectRatio)}
                className="w-full rounded-2xl border border-white/10 bg-[#09101f] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/30"
              >
                {aspectRatios.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label} · {item.resolution}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <Lock className="h-3.5 w-3.5" />
              Locked colors follow selected palette
            </span>
            {(result?.palette ?? lockedColors).map((color) => (
              <span
                key={color}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
              >
                <span className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: color }} />
                {color}
              </span>
            ))}
            {photoAnalysis?.moodTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <label className="block">
              <div className="mb-2 flex items-center justify-between gap-3 text-sm text-white/90">
                <span>Variation slider</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                  {variation < 35 ? "Safe" : variation < 70 ? "Balanced" : "Experimental"}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={variation}
                onChange={(event) => setVariation(Number(event.target.value))}
                className="w-full accent-cyan-300"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 font-medium text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </form>

        <div className="rounded-[1.75rem] border border-white/10 bg-[#07111f]/85 p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">Preview</p>
              <h3 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                {result?.title ?? "Nocturne Signal"}
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                {result?.summary ??
                  "Compose a concept package first, then connect a real image model for final renders."}
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              {result?.resolution ?? selectedAspect.resolution}
            </span>
          </div>

          {photoAnalysis?.previewDataUrl ? (
            <div className="mb-3 grid gap-3 sm:grid-cols-[88px_minmax(0,1fr)] sm:items-center">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <Image
                  src={photoAnalysis.previewDataUrl}
                  alt={sourceImageName || "Uploaded reference"}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="88px"
                />
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/4 p-3">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Photo vibe extracted</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{photoAnalysis.summary}</p>
              </div>
            </div>
          ) : null}

          <div
            className={`noise relative mx-auto w-full overflow-hidden rounded-[1.5rem] border border-white/10 ${result ? (aspectRatios.find((item) => item.label === result.aspectLabel)?.aspectClassName ?? selectedAspect.aspectClassName) : selectedAspect.aspectClassName}`}
            style={{ backgroundImage: result?.gradient ?? "linear-gradient(135deg, #0f172a 0%, #4338ca 42%, #22d3ee 100%)" }}
          >
            {result?.previewUrl ? (
              <Image
                src={result.previewUrl}
                alt={result.title}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            ) : null}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_30%),linear-gradient(180deg,transparent_0%,rgba(3,7,18,0.35)_100%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-3 backdrop-blur-sm">
                <p className="text-xs text-white/70">Style</p>
                <p className="mt-1 text-sm font-medium text-white">{result?.styleLabel ?? "Lofi / Dreamy / Grainy Film"}</p>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-white/10 bg-white/4 p-3">
            <p className="text-sm font-medium text-white">Prompt package</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {result?.prompt ??
                "Create a dreamy lofi wallpaper concept from an emotionally rich late-night feeling, with soft bloom, restrained contrast, and room for desktop icons."}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {result?.previewUrl ? (
              <a
                href={result.previewUrl}
                download={result.downloadName}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
              >
                <Download className="h-4 w-4" />
                Download demo wallpaper
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70"
              >
                <Download className="h-4 w-4" />
                Generate to unlock download
              </button>
            )}
            <p className="text-xs leading-6 text-slate-400">{note}</p>
          </div>

          {result ? (
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {result.suggestions.slice(0, 2).map((suggestion) => (
                <li key={suggestion} className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
