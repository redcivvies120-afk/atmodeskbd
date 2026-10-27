// src/app/api/auth/reset-password/route.ts
// Step 2: verify the one-time code and set the new password.
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { normalizeBDPhone } from '@/lib/utils'
import { sanitizeString } from '@/lib/security'
import { getClientIp, checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit'

const bad = () => NextResponse.json({ error: 'Invalid or expired code.' }, { status: 400 })

export async function POST(req: Request) {
  try {
    const rl = await checkRateLimit(`rp_ip:${getClientIp(req)}`, 10, 900)
    if (!rl.success) return rateLimitExceededResponse(rl)

    const body = await req.json().catch(() => ({}))
    const identifier = sanitizeString(body?.identifier, 100).trim()
    const code = typeof body?.code === 'string' ? body.code.trim() : ''
    const newPassword = body?.newPassword

    if (!identifier || !/^\d{6}$/.test(code)) return bad()
    if (typeof newPassword !== 'string' || newPassword.length < 8 || newPassword.length > 72) {
      return NextResponse.json({ error: 'Password must be 8 to 72 characters long.' }, { status: 400 })
    }

    const phone = normalizeBDPhone(identifier)
    const user = await prisma.user.findFirst({
      where: {
        role: 'CUSTOMER',
        isActive: true,
        OR: [{ email: identifier.toLowerCase() }, ...(phone ? [{ phone }] : [])],
      },
      select: { id: true },
    })
    if (!user) return bad()

    const reset = await prisma.passwordReset.findFirst({
      where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() }, attempts: { lt: 5 } },
      orderBy: { createdAt: 'desc' },
    })
    if (!reset) return bad()

    // Count the attempt BEFORE comparing so parallel guesses cannot beat the 5-try limit
    await prisma.passwordReset.update({
      where: { id: reset.id },
      data: { attempts: { increment: 1 } },
    })
    if (!(await bcrypt.compare(code, reset.codeHash))) return bad()

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        // tokenVersion bump logs out every existing session of this account
        data: { password: hashed, tokenVersion: { increment: 1 } },
      }),
      prisma.passwordReset.update({ where: { id: reset.id }, data: { usedAt: new Date() } }),
    ])

    return NextResponse.json({
      success: true,
      message: 'Your password has been reset. You can now sign in.',
    })
  } catch (err) {
    console.error('[Reset Password Error]', err)
    return NextResponse.json({ error: 'Failed to reset password. Please try again.' }, { status: 500 })
  }
}
