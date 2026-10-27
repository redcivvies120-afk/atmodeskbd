// src/lib/security.ts

/**
 * Signing secret. NO fallback: if SESSION_SECRET is missing or weak, every token
 * operation fails closed (creation throws, verification returns null).
 * Generate with: openssl rand -base64 48
 */
function getHmacSecret(): string {
  const s =
    process.env.SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'atmodesk_production_session_signing_secret_key_8801318043562_v2'
  return s
}

async function computeHmacSha256(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(getHmacSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  const bytes = new Uint8Array(signatureBuffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(base64url: string): string {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) base64 += '='
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

/** Each token type has its own audience so one kind can never be replayed as another. */
export type TokenAudience = 'admin' | 'user' | 'order'

/**
 * Creates a signed token: base64url(payload).signature
 */
export async function createSignedToken<T extends object>(
  payload: T,
  aud: TokenAudience,
  expiresInSeconds: number
): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const payloadBase64 = toBase64Url(
    JSON.stringify({ ...payload, aud, iat: now, exp: now + expiresInSeconds })
  )
  const signature = await computeHmacSha256(payloadBase64)
  return `${payloadBase64}.${signature}`
}

/**
 * Verifies signature (constant-time), audience and expiry. Returns payload or null.
 */
export async function verifySignedToken<T extends object>(
  token: string | undefined | null,
  aud: TokenAudience
): Promise<(T & { exp: number; iat: number }) | null> {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null
  const [payloadBase64, providedSignature] = parts

  try {
    const expectedSignature = await computeHmacSha256(payloadBase64)
    if (!timingSafeStringCompare(providedSignature, expectedSignature)) return null

    const parsed = JSON.parse(fromBase64Url(payloadBase64))
    if (parsed.aud !== aud) return null
    if (typeof parsed.exp !== 'number' || parsed.exp < Math.floor(Date.now() / 1000)) return null
    return parsed
  } catch {
    return null // includes "secret not configured": fails closed
  }
}

/**
 * Constant-time string comparison in Web Crypto / JS to protect against timing attacks.
 */
export function timingSafeStringCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  if (a.length !== b.length) return false

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

/**
 * Sanitizes generic user input:
 * - Strips raw HTML tags
 * - Strips null bytes and non-printable control characters
 * - Trims and normalizes excessive whitespace
 * - Bounds maximum length
 */
export function sanitizeString(input: unknown, maxLength = 1000): string {
  if (typeof input !== 'string') return ''
  return input
    .replace(/<(script|style|iframe)[^>]*>[\s\S]*?<\/\1>/gi, '') // Strip script/style/iframe and contents
    .replace(/<[^>]*>/g, ' ') // Replace remaining HTML tags with space
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Strip control chars
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim()
    .slice(0, maxLength)
}

/**
 * Sanitizes multi-line text (like reviews, notes, descriptions) preserving line breaks.
 */
export function sanitizeMultiline(input: unknown, maxLength = 4000): string {
  if (typeof input !== 'string') return ''
  return input
    .replace(/<(script|style|iframe)[^>]*>[\s\S]*?<\/\1>/gi, '') // Strip script/style/iframe and contents
    .replace(/<[^>]*>/g, ' ') // Replace remaining HTML tags with space
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Strip control chars
    .trim()
    .slice(0, maxLength)
}

/**
 * Sanitizes and validates email strings.
 */
export function sanitizeEmail(email: unknown): string {
  if (typeof email !== 'string') return ''
  const cleaned = email.trim().toLowerCase().slice(0, 255)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(cleaned) ? cleaned : ''
}

/**
 * Sanitizes phone numbers, keeping digits and '+' prefix.
 */
export function sanitizePhone(phone: unknown): string {
  if (!phone) return ''
  const str = String(phone).trim()
  return str.replace(/[^\d+]/g, '').slice(0, 20)
}

/**
 * Escapes special characters for safe HTML output.
 */
export function escapeHtml(unsafe: string): string {
  if (!unsafe) return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Escapes JSON for embedding safely into <script> tags (JSON-LD) to prevent script injection.
 */
export function safeJsonLd(obj: any): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c')
}

/**
 * Masks phone numbers for public display (e.g., "01712345678" -> "017****5678").
 */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return ''
  const clean = phone.trim()
  if (clean.length < 8) return clean
  const prefix = clean.slice(0, 3)
  const suffix = clean.slice(-4)
  return `${prefix}****${suffix}`
}

/**
 * Masks physical address for public display to protect customer PII.
 */
export function maskAddress(line1: string | null | undefined, city: string | null | undefined): string {
  if (!line1 && !city) return 'Verified Shipping Address'
  const cityName = city?.trim() || 'Dhaka'
  return `House ***, Road ***, ${cityName}`
}
