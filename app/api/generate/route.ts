import { NextRequest } from 'next/server'
import { checkLimit, increment } from '@/lib/rate-limit'
import { ERROR_MESSAGES, PROGRESS_STAGES, extractAudioFromUrl, isValidSocialUrl } from '@/lib/audio-utils'
import { generateWithLoudly } from '@/lib/loudly-client'

export const runtime = 'nodejs'

function sse(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`
}

// SSE flow for the wow factor (GET)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url') || ''
  const genre = (searchParams.get('genre') || 'trap').toLowerCase()

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon'
  const { allowed } = checkLimit(ip)
  if (!allowed) {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(sse({ type: 'error', data: { message: ERROR_MESSAGES.rate_limit } })))
        controller.close()
      },
    })
    return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } })
  }

  if (!isValidSocialUrl(url)) {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(sse({ type: 'error', data: { message: ERROR_MESSAGES.invalid_url } })))
        controller.close()
      },
    })
    return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let i = 0
        for (const stage of PROGRESS_STAGES) {
          const steps = Math.max(4, Math.floor(stage.duration / 400))
          for (let s = 0; s < steps; s++) {
            const progressBase = i * (100 / PROGRESS_STAGES.length)
            const progress = Math.min(99, Math.floor(progressBase + (s / steps) * (100 / PROGRESS_STAGES.length)))
            controller.enqueue(
              encoder.encode(
                sse({ type: 'progress', data: { stage: stage.stage, message: stage.message, progress } })
              )
            )
            await new Promise((r) => setTimeout(r, Math.floor(stage.duration / steps)))
          }
          i++
        }

        // Extraction step (placeholder)
        const { seedAudioUrl } = await extractAudioFromUrl(url)

        // Loudly generation
        const res = await generateWithLoudly({ duration: 120, genre: [genre], mood: 'energetic', seedAudioUrl })

        increment(ip)
        controller.enqueue(encoder.encode(sse({ type: 'complete', data: { audioUrl: res.audioUrl } })))
        controller.close()
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            sse({ type: 'error', data: { message: ERROR_MESSAGES.api_error, detail: (err as Error).message } })
          )
        )
        controller.close()
      }
    },
    cancel() {
      // client disconnected
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}

// JSON flow for programmatic use (POST)
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon'
    const { allowed } = checkLimit(ip)
    if (!allowed) {
      return Response.json({ success: false, error: ERROR_MESSAGES.rate_limit }, { status: 429 })
    }

    const { audioUrl, genre = 'trap' } = await req.json()
    if (!audioUrl || typeof audioUrl !== 'string') {
      return Response.json({ success: false, error: ERROR_MESSAGES.invalid_url }, { status: 400 })
    }

    // Call Loudly via wrapper (real if key present, demo fallback otherwise)
    const res = await generateWithLoudly({ duration: 120, genre: [String(genre)], mood: 'energetic', seedAudioUrl: audioUrl })

    increment(ip)
    return Response.json({ success: true, trackUrl: res.audioUrl, audioUrl: res.audioUrl, duration: res.duration, genre })
  } catch (error) {
    console.error('Generation error:', error)
    return Response.json(
      { success: false, error: 'Music generation failed. Try a different audio clip.' },
      { status: 500 }
    )
  }
}
