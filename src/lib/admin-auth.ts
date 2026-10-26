// src/lib/admin-auth.ts
import { cookies } from 'next/headers'
import { createSignedToken, verifySignedToken, timingSafeStringCompare } from '@/lib/security'

// Admin password configured via environment variable
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'

export interface AdminSessionPayload {
  role: 'ADMIN'
}

/**
 * Validates the admin passcode using constant-time comparison to prevent timing attacks.
 */
export function verifyAdminPassword(pass: string): boolean {
  if (!pass || typeof pass !== 'string') return false
  const trimmed = pass.trim()
  return timingSafeStringCompare(trimmed, ADMIN_PASSWORD)
}

/**
 * Generates a cryptographically signed HMAC-SHA256 session token for the admin.
 * Valid for 7 days.
 */
export async function generateAdminSessionToken(): Promise<string> {
  return createSignedToken<AdminSessionPayload>({ role: 'ADMIN' }, 60 * 60 * 24 * 7)
}

/**
 * Verifies whether an admin session token has a valid cryptographic signature and is unexpired.
 */
export async function isValidAdminToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false
  const payload = await verifySignedToken<AdminSessionPayload>(token)
  return payload !== null && payload.role === 'ADMIN'
}

/**
 * Server-side check for Next.js layout and server components.
 */
export async function isServerAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('atmodesk_admin_session')?.value
    return isValidAdminToken(sessionCookie)
  } catch {
    return false
  }
}

/**
 * Verifies admin authentication directly from a Request object.
 */
export async function verifyAdminRequest(req: Request): Promise<boolean> {
  try {
    const cookieHeader = req.headers.get('cookie') || ''
    const match = cookieHeader.match(/atmodesk_admin_session=([^;]+)/)
    const token = match ? match[1] : null
    return isValidAdminToken(token)
  } catch {
    return false
  }
}
