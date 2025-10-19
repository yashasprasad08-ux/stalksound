import { NextRequest } from 'next/server'
import { isValidSocialUrl, extractAudioFromUrl, ERROR_MESSAGES } from '@/lib/audio-utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const url = String(body?.url || '')
    if (!isValidSocialUrl(url)) {
      return Response.json({ error: ERROR_MESSAGES.invalid_url }, { status: 400 })
    }
    const { seedAudioUrl } = await extractAudioFromUrl(url)
    return Response.json({ seedAudioUrl })
  } catch (e) {
    return Response.json({ error: ERROR_MESSAGES.api_error }, { status: 500 })
  }
}
