import {
  AudioLines,
  Sparkles,
} from "lucide-react";
import { GeneratorForm } from "@/components/generator-form";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="hero-grid absolute inset-0 opacity-20" />
      <section className="relative mx-auto flex min-h-screen max-w-7xl items-start px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
        <div className="w-full space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white/80">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              MoodScape — AI Wallpaper Generator
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60">
              <AudioLines className="h-4 w-4 text-fuchsia-300" />
              Spotify Wrapped energy × generative art workflow
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.72fr)_minmax(620px,1.28fr)] xl:items-start xl:gap-8">
            <div className="space-y-5">
              <div className="space-y-4">
                <h1 className="font-display max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl 2xl:text-6xl">
                  Wallpapers that feel like your <span className="text-gradient">inner soundtrack</span>.
                </h1>
                <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                  Describe how the night feels, paste a lyric, lock your favorite colors,
                  and let MoodScape shape a wallpaper concept that matches the exact emotion.
                </p>
              </div>
            </div>

            <GeneratorForm />
          </div>
        </div>
      </section>
    </main>
  );
}
