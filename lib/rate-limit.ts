type Counter = { count: number; resetAt: number }

const DAY_MS = 24 * 60 * 60 * 1000
const LIMIT = Number(process.env.DAILY_LIMIT || 5)

const globalAny = globalThis as any

if (!globalAny.__RATE_LIMIT_MAP__) {
  globalAny.__RATE_LIMIT_MAP__ = new Map<string, Counter>()
}

const store: Map<string, Counter> = globalAny.__RATE_LIMIT_MAP__

export function checkLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const todayKey = `${ip}:${new Date().toISOString().slice(0, 10)}` // per day
  const entry = store.get(todayKey)
  if (!entry) {
    store.set(todayKey, { count: 0, resetAt: now + DAY_MS })
    return { allowed: true, remaining: LIMIT, resetAt: now + DAY_MS }
  }
  const remaining = Math.max(0, LIMIT - entry.count)
  return { allowed: entry.count < LIMIT, remaining, resetAt: entry.resetAt }
}

export function increment(ip: string) {
  const todayKey = `${ip}:${new Date().toISOString().slice(0, 10)}`
  const now = Date.now()
  const entry = store.get(todayKey)
  if (!entry) {
    store.set(todayKey, { count: 1, resetAt: now + DAY_MS })
  } else {
    entry.count += 1
    store.set(todayKey, entry)
  }
}
