// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let redis: Redis | null = null
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = Redis.fromEnv()
  } catch (e) {
    console.warn('[RateLimit] Failed to initialize Upstash Redis from env, using in-memory fallback.')
  }
}

const upstashLimiters = new Map<string, Ratelimit>()

// In-memory sliding window fallback for environments without Upstash configured
interface MemoryWindowEntry {
  timestamps: number[]
}
const memoryStore = new Map<string, MemoryWindowEntry>()

export function getClientIp(req: Request): string {
  return (
    req.headers.get('x-real-ip')?.trim() ||
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown'
  )
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/** NOTE: async. Always `await checkRateLimit(...)`. */
export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  if (redis) {
    const k = `${limit}:${windowSeconds}`
    let rl = upstashLimiters.get(k)
    if (!rl) {
      rl = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
        prefix: `rl:${k}`,
      })
      upstashLimiters.set(k, rl)
    }
    const r = await rl.limit(identifier)
    return {
      success: r.success,
      limit: r.limit,
      remaining: r.remaining,
      reset: Math.max(1, Math.ceil((r.reset - Date.now()) / 1000)),
    }
  }

  // Fallback in-memory rate limiter
  const now = Date.now()
  const windowMs = windowSeconds * 1000
  const key = `${limit}:${windowSeconds}:${identifier}`
  
  let entry = memoryStore.get(key)
  if (!entry) {
    entry = { timestamps: [] }
    memoryStore.set(key, entry)
  }

  // Filter out timestamps outside the sliding window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs)

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0]
    const resetSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000))
    return {
      success: false,
      limit,
      remaining: 0,
      reset: resetSeconds,
    }
  }

  entry.timestamps.push(now)
  return {
    success: true,
    limit,
    remaining: limit - entry.timestamps.length,
    reset: windowSeconds,
  }
}

export function rateLimitExceededResponse(result: RateLimitResult): Response {
  return Response.json(
    {
      error: `Too many requests. Please wait ${result.reset} seconds before trying again.`,
      retryAfter: result.reset,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(result.reset),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.reset),
      },
    }
  )
}
