export type GenerationStage = 'analyzing' | 'composing' | 'mastering'

export type LOUDLYRequest = {
  duration?: number
  genre?: string[]
  mood?: string
  seedAudioUrl?: string
}

export type LOUDLYResponse = {
  id: string
  status: 'succeeded' | 'queued' | 'failed'
  audioUrl: string
  duration: number
  meta?: Record<string, unknown>
}
