'use client'
import { MotionConfig, motion } from 'framer-motion'
import UrlInput from '@/components/url-input/UrlInput'
import AudioVisualizer from '@/components/audio-visualizer/AudioVisualizer'
import { useCallback, useState } from 'react'

export default function DemoClient() {
  const [status, setStatus] = useState<
    | { stage: 'idle' }
    | { stage: 'analyzing' | 'composing' | 'mastering'; message: string; progress: number }
    | { stage: 'done'; audioUrl: string; genre: string }
    | { stage: 'error'; message: string }
  >({ stage: 'idle' })

  const [genre, setGenre] = useState<'trap' | 'lofi' | 'synthwave'>('trap')
  const [sourceUrl, setSourceUrl] = useState<string | null>(null)

  const startGeneration = useCallback(async (url: string, g: typeof genre) => {
    setSourceUrl(url)
    setStatus({ stage: 'analyzing', message: 'Decoding the viral DNA...', progress: 0 })

    const qs = new URLSearchParams({ url, genre: g })

    const res = await fetch(`/api/generate?${qs.toString()}`, {
      method: 'GET',
      headers: { Accept: 'text/event-stream' },
    })

    if (!res.ok || !res.body) {
      setStatus({ stage: 'error', message: '🎹 Our AI musicians are taking a break. Try again.' })
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const parts = buffer.split('\n\n')
      buffer = parts.pop() || ''

      for (const part of parts) {
        const line = part.trim()
        if (!line.startsWith('data:')) continue
        const payload = line.slice(5).trim()
        if (!payload) continue
        try {
          const evt = JSON.parse(payload) as { type: string; data?: any }
          if (evt.type === 'progress') {
            setStatus({
              stage: evt.data.stage,
              message: evt.data.message,
              progress: evt.data.progress,
            })
          } else if (evt.type === 'complete') {
            setStatus({ stage: 'done', audioUrl: evt.data.audioUrl, genre: g })
          } else if (evt.type === 'error') {
            setStatus({ stage: 'error', message: evt.data.message })
          }
        } catch (e) {
          // ignore parse errors
        }
      }
    }
  }, [])

  const onUrlSubmit = useCallback(
    (url: string) => {
      startGeneration(url, genre)
    },
    [genre, startGeneration]
  )

  const genrePills: { id: 'trap' | 'lofi' | 'synthwave'; name: string; color: string }[] = [
    { id: 'trap', name: 'Trap Banger', color: 'text-emerald-400' },
    { id: 'lofi', name: 'Lo‑Fi Chill', color: 'text-violet-400' },
    { id: 'synthwave', name: 'Synthwave', color: 'text-cyan-400' },
  ]

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            Paste a TikTok. Watch a full song appear.
          </h1>
          <p className="text-slate-400 max-w-2xl">
            SoundStalker transforms any short social audio into a 2‑minute track with a hypnotic
            visualizer. Built for instant wow and effortless sharing.
          </p>
          <div className="w-full max-w-2xl">
            <UrlInput onSubmit={onUrlSubmit} />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {genrePills.map((g) => (
              <button
                key={g.id}
                onClick={() => setGenre(g.id)}
                className={`rounded-full border border-slate-700 px-3 py-1 text-sm transition-colors ${
                  genre === g.id ? `${g.color} bg-slate-800` : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="">
          <AudioVisualizer
            status={status}
            onRetry={() => setStatus({ stage: 'idle' })}
            sourceUrl={sourceUrl || undefined}
          />
        </motion.div>
      </div>
    </MotionConfig>
  )
}
