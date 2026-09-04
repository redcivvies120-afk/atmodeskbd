// src/lib/admin-auth.ts
import { cookies } from 'next/headers'

// Accepted admin passwords (can also be set via ADMIN_PASSWORD env var)
const VALID_PASSWORDS = [
  process.env.ADMIN_PASSWORD,
  'atmodesk2026',
  'atmodesk@2026',
  'atmodeskbd',
  '01318043562',
  'admin1234',
].filter(Boolean) as string[]

const ADMIN_SECRET_SALT = process.env.ADMIN_SECRET || 'atmodeskbd_admin_secret_key_2026'

// Simple deterministic signature for session token
export function generateAdminSessionToken(pass: string): string {
  const payload = `atmodesk_admin:${pass}:${ADMIN_SECRET_SALT}`
  return Buffer.from(payload).toString('base64')
}

export function verifyAdminPassword(pass: string): boolean {
  if (!pass) return false
  const trimmed = pass.trim()
  return VALID_PASSWORDS.some((valid) => valid === trimmed)
}

export function isValidAdminToken(token: string | undefined): boolean {
  if (!token) return false
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const parts = decoded.split(':')
    if (parts.length >= 3 && parts[0] === 'atmodesk_admin') {
      const pass = parts[1]
      return verifyAdminPassword(pass)
    }
  } catch {
    return false
  }
  return false
}

export async function isServerAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('atmodesk_admin_session')?.value
    return isValidAdminToken(sessionCookie)
  } catch {
    return false
  }
}
