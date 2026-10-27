// src/lib/user-auth.ts
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { createSignedToken, verifySignedToken } from '@/lib/security'

export interface UserSessionPayload {
  id: string
  role: string
  email?: string
}

const SESSION_DURATION = 60 * 60 * 24 * 7 // 7 days

export async function generateUserSessionToken(user: {
  id: string
  role?: string
  email?: string
  tokenVersion?: number
}): Promise<string> {
  return createSignedToken(
    { id: user.id, role: user.role || 'CUSTOMER', email: user.email, tv: user.tokenVersion ?? 0 },
    'user',
    SESSION_DURATION
  )
}

/**
 * Verifies the token AND re-checks the database, so deactivated users and
 * sessions older than the last password reset (tokenVersion bump) stop working immediately.
 */
export async function verifyUserSessionToken(
  token: string | undefined | null
): Promise<UserSessionPayload | null> {
  if (!token) return null
  const p = await verifySignedToken<UserSessionPayload & { tv?: number }>(token, 'user')
  if (!p || !p.id) return null

  const u = await prisma.user.findUnique({
    where: { id: p.id },
    select: { role: true, email: true, isActive: true, tokenVersion: true },
  })
  if (!u || !u.isActive || u.tokenVersion !== (p.tv ?? 0)) return null
  return { id: p.id, role: u.role, email: u.email }
}

export async function getServerUserSession(): Promise<UserSessionPayload | null> {
  try {
    const cookieStore = await cookies()
    return verifyUserSessionToken(cookieStore.get('atmodesk_user')?.value)
  } catch {
    return null
  }
}

export function getUserCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: SESSION_DURATION,
    path: '/',
  }
}
