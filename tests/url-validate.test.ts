import { describe, expect, it } from 'vitest'
import { isValidSocialUrl } from '@/lib/audio-utils'

describe('isValidSocialUrl', () => {
  it('validates TikTok URLs', () => {
    expect(isValidSocialUrl('https://www.tiktok.com/@user/video/123')).toBe(true)
  })
  it('validates YouTube URLs', () => {
    expect(isValidSocialUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(true)
  })
  it('rejects invalid URLs', () => {
    expect(isValidSocialUrl('https://example.com')).toBe(false)
  })
})
