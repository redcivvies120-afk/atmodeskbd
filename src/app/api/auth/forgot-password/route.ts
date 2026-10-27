// src/app/api/auth/forgot-password/route.ts
// Step 1: request a one-time code. Always returns the same response (no account enumeration).
import { NextResponse } from 'next/server'
import { randomInt } from 'crypto'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { normalizeBDPhone } from '@/lib/utils'
import { sanitizeString } from '@/lib/security'
import { getClientIp, checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit'
import { sendSms } from '@/lib/sms'

const GENERIC = {
  success: true,
  message: 'If an account exists for this number or email, a verification code has been sent.',
}

export async function POST(req: Request) {
  try {
    const rl = await checkRateLimit(`fp_ip:${getClientIp(req)}`, 5, 900)
    if (!rl.success) return rateLimitExceededResponse(rl)

    const body = await req.json().catch(() => ({}))
    const identifier = sanitizeString(body?.identifier, 100).trim()
    if (!identifier) return NextResponse.json(GENERIC)

    const phone = normalizeBDPhone(identifier)
    const user = await prisma.user.findFirst({
      where: {
        role: 'CUSTOMER',
        isActive: true,
        OR: [{ email: identifier.toLowerCase() }, ...(phone ? [{ phone }] : [])],
      },
      select: { id: true, phone: true },
    })

    if (user?.phone) {
      // Per-account limit stored in the DB: 3 codes per hour
      const recent = await prisma.passwordReset.count({
        where: { userId: user.id, createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) } },
      })
      if (recent < 3) {
        const code = String(randomInt(100000, 1000000)) // CSPRNG, 6 digits
        await prisma.passwordReset.create({
          data: {
            userId: user.id,
            codeHash: await bcrypt.hash(code, 10),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
          },
        })
        await sendSms(user.phone, `ATMODESK code: ${code} (valid 10 min). Never share it with anyone.`)
      }
    }

    return NextResponse.json(GENERIC)
  } catch (err) {
    console.error('[Forgot Password Error]', err)
    return NextResponse.json({ error: 'Failed to process request. Please try again.' }, { status: 500 })
  }
}
