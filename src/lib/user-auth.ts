// src/lib/user-auth.ts
import { cookies } from 'next/headers'
import { createSignedToken, verifySignedToken } from '@/lib/security'

export interface UserSessionPayload {
  id: string
  role: string
  email?: string
}

const SESSION_DURATION = 60 * 60 * 24 * 30 // 30 days

/**
 * Generates a cryptographically signed HMAC-SHA256 session token for a customer.
 */
export async function generateUserSessionToken(user: { id: string; role?: string; email?: string }): Promise<string> {
  return createSignedToken<UserSessionPayload>(
    {
      id: user.id,
      role: user.role || 'CUSTOMER',
      email: user.email,
    },
    SESSION_DURATION
  )
}

/**
 * Verifies whether a user session token is cryptographically authentic and not expired.
 */
export async function verifyUserSessionToken(token: string | undefined | null): Promise<UserSessionPayload | null> {
  if (!token) return null
  const payload = await verifySignedToken<UserSessionPayload>(token)
  if (!payload || !payload.id) return null
  return {
    id: payload.id,
    role: payload.role || 'CUSTOMER',
    email: payload.email,
  }
}

/**
 * Retrieves and validates the current user's session from secure HTTP-only cookies.
 */
export async function getServerUserSession(): Promise<UserSessionPayload | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('atmodesk_user')?.value
    return verifyUserSessionToken(sessionCookie)
  } catch {
    return null
  }
}

/**
 * Standard cookie configuration for user authentication cookies.
 */
export function getUserCookieOptions() {
  return {
    httpOnly: true, // Prevents JavaScript / XSS access to cookie
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: SESSION_DURATION,
    path: '/',
  }
}
