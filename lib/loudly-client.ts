import { LOUDLYRequest, LOUDLYResponse } from '@/types'

const LOUDLY_CONFIG = {
  endpoint: 'https://api.loudly.com/api/v1/ai/music/generate',
}

export async function generateWithLoudly(params: LOUDLYRequest): Promise<LOUDLYResponse> {
  const key = process.env.LOUDLY_API_KEY
  if (!key) {
    // Demo mode: pretend to generate and return a placeholder audio
    return {
      id: 'demo-track',
      status: 'succeeded',
      audioUrl:
        'https://upload.wikimedia.org/wikipedia/commons/transcoded/4/45/Serenade_No.10_in_B_flat_Major%2C_KV_361_%28K_370a%29_Gran_Partita_-_I._Largo_-_Molto_allegro.ogg/Serenade_No.10_in_B_flat_Major%2C_KV_361_%28K_370a%29_Gran_Partita_-_I._Largo_-_Molto_allegro.ogg.mp3',
      duration: params.duration ?? 120,
      meta: { provider: 'demo' },
    }
  }

  const res = await fetch(LOUDLY_CONFIG.endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      duration: params.duration ?? 120,
      genre: params.genre ?? ['trap'],
      mood: params.mood ?? 'energetic',
      seedAudioUrl: params.seedAudioUrl,
    }),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => 'Unknown error')
    throw new Error(`LOUDLY_ERROR: ${res.status} ${errText}`)
  }

  const json = (await res.json()) as any
  // Normalize response
  const audioUrl = json?.audio_url || json?.audioUrl || json?.result?.audioUrl
  return {
    id: String(json?.id ?? Date.now()),
    status: 'succeeded',
    audioUrl,
    duration: params.duration ?? 120,
    meta: { provider: 'loudly', raw: json },
  }
}
