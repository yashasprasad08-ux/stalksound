import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SoundStalker – Viral AI Music Generator',
  description: 'Turn a TikTok URL into a full-length track with a hypnotic visualizer.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'SoundStalker',
    description: 'Paste a TikTok. Get a full song. Share the split-screen magic.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SoundStalker',
    description: 'Paste a TikTok. Get a full song. Share the split-screen magic.'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[var(--bg)] antialiased">
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
          <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">{children}</main>
        </div>
      </body>
    </html>
  )
}
