type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

const DEEPSEEK_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'

export async function deepseekChat(messages: ChatMessage[], opts?: { model?: string; maxTokens?: number }) {
  const key = process.env.DEEPSEEK_API_KEY
  if (!key) {
    // Return a harmless default
    return {
      content: 'Demo mode: AI commentary is sleeping. 💤',
    }
  }

  const res = await fetch(DEEPSEEK_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'SoundStalker AI',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: opts?.model ?? 'deepseek/deepseek-r1',
      messages,
      max_tokens: opts?.maxTokens ?? 512,
    }),
  })

  if (!res.ok) {
    throw new Error(`DEEPSEEK_ERROR: ${res.status}`)
  }

  const data = await res.json()
  const content: string = data?.choices?.[0]?.message?.content ?? ''
  return { content }
}
