import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { normalizeBDPhone } from '@/lib/utils'
import { ensureDatabaseTables } from '@/lib/init-db'
import { getClientIp, checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit'
import { sanitizeString } from '@/lib/security'
import { generateUserSessionToken, getUserCookieOptions } from '@/lib/user-auth'

export async function POST(req: Request) {
  try {
    // 1. Rate limiting: max 10 attempts per 15 mins per IP
    const clientIp = getClientIp(req)
    const rateCheck = await checkRateLimit(`user_login:${clientIp}`, 10, 900)
    if (!rateCheck.success) {
      return rateLimitExceededResponse(rateCheck)
    }

    await ensureDatabaseTables()
    const body = await req.json()
    const identifier = sanitizeString(body?.identifier, 100)
    const password = body?.password

    if (!identifier || !password || typeof password !== 'string' || password.length > 72) {
      return NextResponse.json(
        { error: 'Please provide your phone number/email and password.' },
        { status: 400 }
      )
    }

    const cleanInput = identifier.trim()

    // Per-account limit (in addition to per-IP) to stop slow distributed guessing
    const acctCheck = await checkRateLimit(`user_login_acct:${cleanInput.toLowerCase()}`, 10, 900)
    if (!acctCheck.success) return rateLimitExceededResponse(acctCheck)
    const normalizedPhone = normalizeBDPhone(cleanInput)

    // Find user by email or phone (check both raw input and normalized phone)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanInput.toLowerCase() },
          { phone: cleanInput },
          ...(normalizedPhone ? [
            { phone: normalizedPhone },
            { email: `${normalizedPhone}@customer.atmodeskbd.com` }
          ] : []),
        ],
      },
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please check your phone/email and password.' },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'This account has been deactivated. Please contact support.' },
        { status: 403 }
      )
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please check your phone/email and password.' },
        { status: 401 }
      )
    }

    // Generate cryptographically signed token
    const token = await generateUserSessionToken({
      id: user.id,
      role: user.role,
      email: user.email,
      tokenVersion: user.tokenVersion,
    })

    // Set secure HTTP-only session cookie
    const cookieStore = await cookies()
    cookieStore.set('atmodesk_user', token, getUserCookieOptions())

    return NextResponse.json({
      success: true,
      message: 'Signed in successfully!',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error('[User Login Error]', error)
    return NextResponse.json(
      { error: 'Failed to sign in. Please try again.' },
      { status: 500 }
    )
  }
}
