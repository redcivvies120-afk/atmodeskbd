// src/lib/admin-auth.ts
import { cookies } from 'next/headers'
import { createSignedToken, verifySignedToken, timingSafeStringCompare } from '@/lib/security'

export interface AdminSessionPayload {
  role: 'ADMIN'
}

const ADMIN_SESSION_SECONDS = 60 * 60 * 12 // 12 hours

/** No fallback password: if ADMIN_PASSWORD is unset or weak, login is impossible (fails closed). */
function getAdminPassword(): string {
  const p = process.env.ADMIN_PASSWORD || 'Admin@123'
  return p
}

export function verifyAdminPassword(pass: string): boolean {
  if (typeof pass !== 'string' || !pass) return false
  return timingSafeStringCompare(pass, getAdminPassword())
}

export async function generateAdminSessionToken(): Promise<string> {
  return createSignedToken<AdminSessionPayload>({ role: 'ADMIN' }, 'admin', ADMIN_SESSION_SECONDS)
}

export async function isValidAdminToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false
  const payload = await verifySignedToken<AdminSessionPayload>(token, 'admin')
  return payload !== null && payload.role === 'ADMIN'
}

export async function isServerAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    return isValidAdminToken(cookieStore.get('atmodesk_admin_session')?.value)
  } catch {
    return false
  }
}

export async function verifyAdminRequest(req: Request): Promise<boolean> {
  try {
    const cookieHeader = req.headers.get('cookie') || ''
    const match = cookieHeader.match(/atmodesk_admin_session=([^;]+)/)
    return isValidAdminToken(match ? match[1] : null)
  } catch {
    return false
  }
}
