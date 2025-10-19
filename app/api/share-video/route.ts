import { NextRequest } from 'next/server'
import { generateSplitScreenVideo } from '@/lib/video-generator'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { leftVideoUrl, rightAudioUrl } = body || {}
    if (!leftVideoUrl || !rightAudioUrl) {
      return Response.json({ error: 'Missing inputs' }, { status: 400 })
    }
    const { videoUrl } = await generateSplitScreenVideo({ leftVideoUrl, rightAudioUrl })
    return Response.json({ videoUrl })
  } catch (e) {
    return Response.json({ error: 'Failed to generate video' }, { status: 500 })
  }
}
