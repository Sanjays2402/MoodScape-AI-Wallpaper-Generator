import { NextResponse } from "next/server";
import {
  aspectRatios,
  buildDemoWallpaper,
  inputMethods,
  paletteOptions,
  stylePresets,
  type GeneratePayload,
} from "@/lib/moodscape";
import { parseSpotifyUrl, resolveSpotifyReference } from "@/lib/spotify";

function isValidPayload(payload: Partial<GeneratePayload>): payload is GeneratePayload {
  return (
    typeof payload.prompt === "string" &&
    typeof payload.variation === "number" &&
    Array.isArray(payload.lockedColors) &&
    (!payload.photoAnalysis ||
      (Array.isArray(payload.photoAnalysis.palette) &&
        typeof payload.photoAnalysis.lighting === "string" &&
        typeof payload.photoAnalysis.contrast === "string" &&
        Array.isArray(payload.photoAnalysis.moodTags) &&
        typeof payload.photoAnalysis.summary === "string")) &&
    inputMethods.some((item) => item.id === payload.inputMethod) &&
    stylePresets.some((item) => item.id === payload.stylePreset) &&
    paletteOptions.some((item) => item.id === payload.paletteKey) &&
    aspectRatios.some((item) => item.id === payload.aspectRatio)
  );
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<GeneratePayload>;

    if (!isValidPayload(payload)) {
      return NextResponse.json(
        {
          error: "Invalid generation request.",
        },
        { status: 400 },
      );
    }

    const spotifyLink = payload.songReference ? parseSpotifyUrl(payload.songReference) : null;
    const resolvedSongReference = await resolveSpotifyReference(payload.songReference);
    const result = buildDemoWallpaper({
      ...payload,
      songReference: resolvedSongReference,
    });

    return NextResponse.json({
      success: true,
      result,
      provider: process.env.REPLICATE_API_TOKEN ? "demo-ready" : "demo",
      note:
        spotifyLink
          ? "Spotify URL detected and converted into richer music context for the wallpaper prompt. This starter still returns a prompt package and visual concept preview."
          : "This starter currently returns a prompt package and visual concept preview. Connect Replicate in this route for real image generation.",
    });
  } catch {
    return NextResponse.json(
      {
        error: "Unable to generate wallpaper concept right now.",
      },
      { status: 500 },
    );
  }
}
