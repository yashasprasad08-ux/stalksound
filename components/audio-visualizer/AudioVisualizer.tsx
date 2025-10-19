'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export type VisualizerStatus =
  | { stage: 'idle' }
  | { stage: 'analyzing' | 'composing' | 'mastering'; message: string; progress: number }
  | { stage: 'done'; audioUrl: string; genre: string }
  | { stage: 'error'; message: string }

export default function AudioVisualizer({
  status,
  sourceUrl,
  onRetry,
}: {
  status: VisualizerStatus
  sourceUrl?: string
  onRetry: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number | null>(null)

  const [playing, setPlaying] = useState(false)

  const cleanupAudio = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (analyserRef.current) analyserRef.current.disconnect()
    if (ctxRef.current) {
      ctxRef.current.close().catch(() => {})
      ctxRef.current = null
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    if (!canvas || !analyser) return

    const dpr = Math.max(1, window.devicePixelRatio || 1)
    const width = canvas.clientWidth * dpr
    const height = canvas.clientHeight * dpr
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }
    const c = canvas.getContext('2d')!
    c.clearRect(0, 0, width, height)

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyser.getByteFrequencyData(dataArray)

    const barWidth = Math.max(2, Math.floor(width / bufferLength))
    let x = 0

    for (let i = 0; i < bufferLength; i++) {
      const value = dataArray[i] ?? 0
      const v = value / 255
      const barHeight = v * height
      const hue = 150 + v * 100 // emerald to violet spectrum
      c.fillStyle = `hsla(${hue}, 80%, ${40 + v * 35}%, 0.9)`
      c.fillRect(x, height - barHeight, barWidth * 0.9, barHeight)
      x += barWidth
    }

    rafRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    if (status.stage !== 'done') return

    const setup = async () => {
      cleanupAudio()
      const audioEl = audioRef.current
      if (!audioEl) return

      audioEl.crossOrigin = 'anonymous'

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      ctxRef.current = ctx
      const source = ctx.createMediaElementSource(audioEl)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyser.connect(ctx.destination)
      analyserRef.current = analyser

      audioEl.src = status.audioUrl
      await audioEl.play().catch(() => {})
      setPlaying(true)
      draw()
    }

    void setup()

    return () => {
      cleanupAudio()
    }
  }, [status, cleanupAudio, draw])

  const Stage = () => {
    if (status.stage === 'idle')
      return (
        <div className="text-center text-slate-400">Paste a URL to start the show.</div>
      )
    if (status.stage === 'error')
      return (
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="text-red-400">{status.message}</div>
          <Button variant="ghost" onClick={onRetry}>Try again</Button>
        </div>
      )
    if (status.stage === 'done')
      return (
        <div className="flex flex-col items-center gap-3">
          <audio ref={audioRef} controls className="w-full" />
          <div className="flex items-center gap-3">
            <div className="text-slate-400 text-sm">Genre: {status.genre}</div>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('This AI turned my TikTok into a full 2‑minute track. 🤯🎵 #SoundStalker')}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="secondary">Share on X</Button>
            </a>
          </div>
        </div>
      )

    // Progress stages
    const progress = Math.max(0, Math.min(100, status.progress ?? 0))
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-slate-300">{status.message}</div>
        <div className="h-2 w-full max-w-xl overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-violet-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="relative z-10 flex flex-col gap-6">
        <div className="aspect-video w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-900/60">
          <canvas ref={canvasRef} className="h-full w-full" />
        </div>
        <Stage />
      </div>
      {/* Subtle gradient glow */}
      <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.06),transparent_60%)]" />
    </Card>
  )
}
