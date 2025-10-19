export const PROGRESS_STAGES: { stage: 'analyzing' | 'composing' | 'mastering'; message: string; duration: number }[] = [
  { stage: 'analyzing', message: 'Decoding the viral DNA...', duration: 2000 },
  { stage: 'composing', message: 'Cooking up the drop...', duration: 5000 },
  { stage: 'mastering', message: 'Adding final magic...', duration: 3000 },
]

export const GENRES = [
  { id: 'trap', name: 'Trap Banger', color: 'text-emerald-400', description: 'Hard 808s + hi-hats' },
  { id: 'lofi', name: 'Lo‑Fi Chill', color: 'text-violet-400', description: 'Relaxing beats' },
  { id: 'synthwave', name: 'Synthwave', color: 'text-cyan-400', description: 'Retro future vibes' },
] as const

export const ERROR_MESSAGES = {
  rate_limit: "🎵 You've reached your daily jam limit! Come back tomorrow.",
  api_error: '🎹 Our AI musicians are taking a break. Try again in a moment.',
  invalid_url: "🔗 That link doesn't look right. Try a TikTok/YouTube URL.",
}

export function isValidSocialUrl(url: string): boolean {
  return [
    /^(https?:\/\/)?(www\.)?tiktok\.com\/.+/i,
    /^(https?:\/\/)?(www\.)?youtube\.com\/.+|^(https?:\/\/)?(www\.)?youtu\.be\/.+/i,
    /^(https?:\/\/)?(www\.)?instagram\.com\/.+/i,
  ].some((rx) => rx.test(url))
}

// Server-side demo extractor: returns the same URL as a seedAudioUrl for providers that accept it
export async function extractAudioFromUrl(url: string): Promise<{ seedAudioUrl: string }> {
  // In a production build, implement FFmpeg-based extraction or a third-party fetcher.
  // For demo: just return the URL as-is.
  return { seedAudioUrl: url }
}
