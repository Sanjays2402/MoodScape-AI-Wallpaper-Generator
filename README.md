# 🎨 MoodScape — AI Wallpaper Generator

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

MoodScape turns **moods, lyrics, and visual vibes** into wallpaper-ready art direction. A polished Next.js app with a cinematic landing page and interactive generator panel.

## ✨ Features

- 🎬 **Cinematic landing page** with premium product narrative
- 🎛️ **Interactive generator panel** for:
  - Mood text input
  - Song or lyric references
  - Visual mood board style input
  - Photo-inspired vibe prompts
- 🎨 **Style presets** — cinematic, lofi, cyberpunk, minimalist, dark academia, cottagecore
- 🔒 **Color locking**, aspect ratio selection, variation control
- 🎲 **Surprise Me** flow for random inspiration
- 🔌 Demo `/api/generate` route with production-ready prompt builder and visual concept preview

## 🛠️ Tech Stack

- **Next.js 16** App Router
- **React 19**
- **Tailwind CSS 4**
- **TypeScript**
- **Lucide React** icons

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Sanjays2402/MoodScape-AI-Wallpaper-Generator.git
cd MoodScape-AI-Wallpaper-Generator

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## ⚙️ Environment

Copy `.env.example` to `.env.local` when ready to wire external services:

| Variable | Purpose |
|----------|---------|
| `REPLICATE_API_TOKEN` | FLUX or SDXL image generation |
| `NEXT_PUBLIC_SUPABASE_URL` | Auth and gallery |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client-side Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Secure backend writes |

## 🗺️ Roadmap

1. Replace demo generator with real Replicate calls
2. Save generations and remixes in Supabase
3. Background upscale jobs for 4K and ultrawide exports
4. Moderation, quotas, and public gallery curation

## 👤 Author

**Sanjay Santhanam**
