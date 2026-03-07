# MoodScape — AI Wallpaper Generator

MoodScape is a polished Next.js starter for an AI wallpaper product that turns moods, lyrics, and visual vibe into wallpaper-ready art direction.

## What ships today

- Cinematic landing page with a premium product narrative
- Interactive generator panel for:
	- mood text
	- song or lyric references
	- visual mood board style input
	- photo-inspired vibe prompts
- Style presets for cinematic, lofi, cyberpunk, minimalist, dark academia, and cottagecore moods
- Color locking, aspect ratio selection, variation control, and a `Surprise Me` flow
- Demo `/api/generate` route that builds a production-ready prompt package and visual concept preview

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- TypeScript
- Lucide React icons

## Getting started

1. Install dependencies
2. Start the development server

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Environment

Copy `.env.example` to `.env.local` when you are ready to wire external services.

Planned integrations:

- `REPLICATE_API_TOKEN` for FLUX or SDXL generation
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for auth and gallery
- `SUPABASE_SERVICE_ROLE_KEY` for secure backend writes

## Suggested next steps

1. Replace the demo generator response with a real Replicate call
2. Save generations and remixes in Supabase
3. Add background upscale jobs for true 4K and ultrawide exports
4. Introduce moderation, quotas, and public gallery curation
