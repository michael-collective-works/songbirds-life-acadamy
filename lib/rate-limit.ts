/**
 * Simple, reusable rate-limiter.
 * - Uses Upstash KV if KV_REST_API_URL and KV_REST_API_TOKEN are set.
 * - Falls back to an in-memory fixed window if not configured.
 */

const UP_URL = process.env.KV_REST_API_URL
const UP_TOKEN = process.env.KV_REST_API_TOKEN

type RateResult = {
  ok: boolean
  remaining: number
  reset: number // unix seconds when window resets
}

const memoryBuckets = new Map<string, { windowEnd: number; count: number }>()

async function upstashFetch(path: string, init?: RequestInit) {
  if (!UP_URL || !UP_TOKEN) return null
  const res = await fetch(`${UP_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${UP_TOKEN}`,
    },
  })
  if (!res.ok) throw new Error(`Upstash error: ${res.status}`)
  return res
}

/**
 * Upstash KV: INCR key; if ttl == -1, EXPIRE key windowSec
 * Returns current value and ttl
 */
async function upstashIncrWithTtl(key: string, windowSec: number): Promise<{ value: number; ttl: number }> {
  // INCR
  const incrRes = await upstashFetch(`/incr/${encodeURIComponent(key)}`, { method: 'POST' })
  if (!incrRes) throw new Error('Upstash not configured')
  const value = await incrRes.json()

  // TTL
  const ttlRes = await upstashFetch(`/ttl/${encodeURIComponent(key)}`, { method: 'GET' })
  const ttl = await ttlRes!.json()

  // If no expiry, set it
  if (ttl === -1) {
    await upstashFetch(`/expire/${encodeURIComponent(key)}/${windowSec}`, { method: 'POST' })
    return { value, ttl: windowSec }
  }

  return { value, ttl }
}

export async function rateLimit(key: string, windowSec: number, max: number): Promise<RateResult> {
  const nowSec = Math.floor(Date.now() / 1000)

  // Upstash path if configured
  if (UP_URL && UP_TOKEN) {
    try {
      const { value, ttl } = await upstashIncrWithTtl(`rl:${key}`, windowSec)
      const remaining = Math.max(0, max - value)
      const reset = nowSec + (typeof ttl === 'number' && ttl > 0 ? ttl : windowSec)
      return { ok: value <= max, remaining, reset }
    } catch {
      // fall through to memory if Upstash fails
    }
  }

  // Memory fallback (fixed window)
  const slot = memoryBuckets.get(key)
  if (!slot || slot.windowEnd <= nowSec) {
    memoryBuckets.set(key, { windowEnd: nowSec + windowSec, count: 1 })
    return { ok: true, remaining: max - 1, reset: nowSec + windowSec }
  }
  slot.count += 1
  const remaining = Math.max(0, max - slot.count)
  return { ok: slot.count <= max, remaining, reset: slot.windowEnd }
}
