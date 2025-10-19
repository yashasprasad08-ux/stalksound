'use client'
import { useMemo } from 'react'
import Button from '@/components/ui/Button'

export default function ShareModal({ audioUrl, onClose }: { audioUrl: string; onClose: () => void }) {
  const shareUrl = useMemo(() => {
    const base = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || '')
    const url = new URL(base)
    url.searchParams.set('t', 'soundstalker')
    return url.toString()
  }, [])

  const text = encodeURIComponent('This AI turned my TikTok into a full 2‑minute track. 🤯🎵 #SoundStalker')
  const tweet = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="mb-2 text-lg font-semibold">Share the magic</h3>
        <p className="mb-4 text-sm text-slate-400">
          Your split-screen video is being prepared. Meanwhile, share your track.
        </p>
        <div className="flex items-center gap-3">
          <a href={tweet} target="_blank" rel="noreferrer">
            <Button variant="primary">Share on X</Button>
          </a>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}
