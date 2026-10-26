// src/lib/rate-limit.ts

interface RateLimitRecord {
  timestamps: number[]
}

// In-memory sliding window store
const rateLimitStore = new Map<string, RateLimitRecord>()

// Periodic garbage collection every 5 minutes to prevent memory leaks
let lastCleanup = Date.now()
function cleanupExpiredEntries(windowMs: number) {
  const now = Date.now()
  if (now - lastCleanup < 60_000) return // throttle cleanup calls to once a minute
  lastCleanup = now

  for (const [key, record] of rateLimitStore.entries()) {
    const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs)
    if (validTimestamps.length === 0) {
      rateLimitStore.delete(key)
    } else {
      record.timestamps = validTimestamps
    }
  }
}

/**
 * Extracts client IP from Request headers.
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim()
    if (firstIp) return firstIp
  }

  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  const cfConnectingIp = req.headers.get('cf-connecting-ip')
  if (cfConnectingIp) return cfConnectingIp.trim()

  return '127.0.0.1'
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Evaluates rate limit using sliding window algorithm.
 */
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now()
  const windowMs = windowSeconds * 1000
  cleanupExpiredEntries(windowMs)

  const record = rateLimitStore.get(identifier) || { timestamps: [] }
  const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs)

  if (validTimestamps.length >= limit) {
    const oldestTimestamp = validTimestamps[0]
    const resetTime = Math.ceil((oldestTimestamp + windowMs - now) / 1000)
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.max(1, resetTime),
    }
  }

  validTimestamps.push(now)
  rateLimitStore.set(identifier, { timestamps: validTimestamps })

  return {
    success: true,
    limit,
    remaining: Math.max(0, limit - validTimestamps.length),
    reset: windowSeconds,
  }
}

/**
 * Convenience helper to return standard 429 Too Many Requests response using standard Web API.
 */
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
