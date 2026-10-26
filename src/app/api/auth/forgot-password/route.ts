import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { ensureDatabaseTables } from '@/lib/init-db'
import { getClientIp, checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit'
import { sanitizeString } from '@/lib/security'
import { normalizeBDPhone } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    // 1. Rate limiting: max 5 password reset attempts per 15 minutes per IP
    const clientIp = getClientIp(req)
    const rateCheck = checkRateLimit(`forgot_password:${clientIp}`, 5, 900)
    if (!rateCheck.success) {
      return rateLimitExceededResponse(rateCheck)
    }

    await ensureDatabaseTables()
    const body = await req.json()
    const rawIdentifier = sanitizeString(body?.identifier, 100)
    const newPassword = body?.newPassword
    const action = body?.action

    if (!rawIdentifier) {
      return NextResponse.json({ error: 'Please enter your registered phone number or email.' }, { status: 400 })
    }

    const cleanIdentifier = rawIdentifier.trim()
    const normalizedPhone = normalizeBDPhone(cleanIdentifier)

    // 1. Find user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanIdentifier.toLowerCase() },
          { phone: cleanIdentifier },
          ...(normalizedPhone ? [
            { phone: normalizedPhone },
            { email: `${normalizedPhone}@customer.atmodeskbd.com` },
          ] : []),
        ],
      },
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this phone number or email. Please check your spelling.' },
        { status: 404 }
      )
    }

    // CRITICAL SECURITY CHECK: Never allow admin accounts to be reset via public endpoint!
    if (user.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Administrative accounts cannot be reset via the public storefront. Please contact system administration.' },
        { status: 403 }
      )
    }

    // If action is 'check', verify user exists and allow proceeding to set new password
    if (action === 'check') {
      return NextResponse.json({
        success: true,
        userName: user.name || 'Customer',
        message: `Account verified for ${user.name || 'Customer'}. Please set your new password below.`,
      })
    }

    // 2. Perform password update
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters long.' }, { status: 400 })
    }

    // Hash with 12 salt rounds
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({
      success: true,
      message: '✅ Your password has been successfully reset! You can now sign in with your new password.',
    })
  } catch (err: any) {
    console.error('[Forgot Password Error]', err)
    return NextResponse.json({ error: 'Failed to process request. Please try again.' }, { status: 500 })
  }
}
