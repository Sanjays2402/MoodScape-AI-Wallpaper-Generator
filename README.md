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

## Terms & Disclaimer

By using this project you agree to the following.

- **No warranty.** This software is provided "as is", without warranty of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.
- **No liability.** To the maximum extent permitted by law, the author and contributors are not liable for any claim, loss, or damage (direct, indirect, incidental, or consequential, including lost data or profits) arising from its use.
- **Your responsibility.** You use it at your own risk and are responsible for complying with the laws that apply to you.
- **AI output.** Generated content can be inaccurate, biased, or offensive. Review it before relying on or sharing it. Third-party AI providers or models you use process your input under their own terms.
- **Third parties.** Names, logos, APIs, and services of others belong to their owners and are used for identification only; no affiliation or endorsement is implied.
- **Your statutory rights.** Nothing here limits rights that cannot be waived by agreement, including under consumer-protection laws in the USA, Canada (including Quebec), and India (Consumer Protection Act, 2019).
- **License.** Use, copying, and distribution are governed by the [LICENSE](LICENSE) file; if anything here conflicts with it, the license controls.

## Content, Assets & Fair Use

- **Original work.** Unless noted otherwise (including below), the code, text, design, and images in this repository were created by the author.
- **Libraries, fonts, and icons.** Third-party libraries, fonts (for example Google Fonts), and icon sets belong to their creators and are used under their own licenses; see the dependency manifests and each source for terms.
- **Logos, brands, and screenshots.** Third-party names, logos, and screenshots appear only to identify or describe their products (nominative use). They remain the property of their owners and do not imply affiliation or endorsement.
- **Ideas and inspiration.** Where this project is inspired by another product, game, or idea, it is an independent implementation. It borrows only general ideas, mechanics, or styles, which are not anyone's exclusive property, and is meant to contain no third-party code or artwork used without permission.
- **AI-generated content.** Some outputs are produced by AI models. They may resemble existing works by chance; check them before any public or commercial use.
- **Fair use and fair dealing.** Any third-party material is used in limited ways for purposes such as education, research, review, commentary, or identification, relying on fair use in the USA (17 U.S.C. § 107), fair dealing in Canada (Copyright Act, ss. 29–29.2), and fair dealing in India (Copyright Act, 1957, s. 52), where they apply.
- **Concerns and takedown requests.** If you own rights in something here and believe it is used improperly, [open an issue](https://github.com/Sanjays2402/MoodScape-AI-Wallpaper-Generator/issues) or contact the author through their GitHub profile with a link to the material and your claim. It will be reviewed promptly and credited, changed, or removed as appropriate. You may also use GitHub's DMCA process.
- **Contributions.** By contributing, you confirm you have the right to submit your contribution and agree it is licensed under this repository's license.
