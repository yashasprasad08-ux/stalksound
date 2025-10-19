# SoundStalker

Turn short social audio into full-length, genre-specific tracks with a hypnotic visualizer. Built for instant wow and effortless sharing.

## Viral Hook
"This AI turned my 10-second TikTok into a full 2-minute track."

## Tech Stack
- Next.js 15 (App Router)
- TypeScript + Tailwind CSS
- Framer Motion for animation
- Web Audio API visualizer
- Loudly API (primary), fallback-ready

## Getting Started
1. Install deps
```bash
pnpm i # or npm i / yarn
```
2. Copy env
```bash
cp .env.example .env.local
```
3. Run dev server
```bash
pnpm dev
```

## Environment Variables
See `.env.example`. Do not commit secrets.

## Project Structure
```
app/
  api/
    generate/route.ts      # SSE progress + music generation
    extract-audio/route.ts # Placeholder extractor
    share-video/route.ts   # Split-screen generator stub
components/
  audio-visualizer/
  url-input/
  share-modal/
  ui/
lib/
  loudly-client.ts
  deepseek-client.ts
  audio-utils.ts
  video-generator.ts
  rate-limit.ts
```

## Scripts
- `dev` – Next dev server
- `build` – Production build
- `start` – Start server
- `lint` – ESLint
- `type-check` – TypeScript
- `test` – Unit tests (Vitest)

## Notes
- Demo mode activates when API keys are not provided; a public-domain audio sample is used.
- Rate limit: 5 generations/day per IP (in-memory).
- Visualizer auto-cleans WebAudio contexts to prevent memory leaks.

## License
MIT
