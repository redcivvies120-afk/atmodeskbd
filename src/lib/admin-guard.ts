// src/lib/admin-guard.ts
// Kept separate from admin-auth.ts so the Edge middleware doesn't bundle next/navigation.
import { notFound } from 'next/navigation'
import { isServerAdminAuthenticated } from '@/lib/admin-auth'

/**
 * Call as the FIRST line of every admin page (and server action).
 * The admin layout alone is NOT a security boundary.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isServerAdminAuthenticated())) notFound()
}
