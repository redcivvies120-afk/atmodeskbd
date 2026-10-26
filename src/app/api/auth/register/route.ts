import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { normalizeBDPhone, isValidBDPhone } from '@/lib/utils'
import { ensureDatabaseTables } from '@/lib/init-db'
import { getClientIp, checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit'
import { sanitizeString, sanitizeEmail, sanitizePhone } from '@/lib/security'
import { generateUserSessionToken, getUserCookieOptions } from '@/lib/user-auth'

export async function POST(req: Request) {
  try {
    // 1. Rate limiting: max 5 account creations per hour per IP
    const clientIp = getClientIp(req)
    const rateCheck = checkRateLimit(`user_register:${clientIp}`, 5, 3600)
    if (!rateCheck.success) {
      return rateLimitExceededResponse(rateCheck)
    }

    await ensureDatabaseTables()
    const body = await req.json()
    const name = sanitizeString(body?.name, 100)
    const rawPhone = sanitizePhone(body?.phone)
    const rawEmail = sanitizeEmail(body?.email)
    const password = body?.password

    if (!rawPhone || !password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Phone number and password are required.' },
        { status: 400 }
      )
    }

    if (!isValidBDPhone(rawPhone)) {
      return NextResponse.json(
        { error: 'Please enter a valid 11-digit Bangladesh phone number (e.g. 01712345678).' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long for security.' },
        { status: 400 }
      )
    }

    const cleanPhone = normalizeBDPhone(rawPhone)
    const userEmail = rawEmail && rawEmail.length > 0
      ? rawEmail
      : `${cleanPhone}@customer.atmodeskbd.com`

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userEmail },
          { phone: cleanPhone },
        ],
      },
      select: { id: true },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this phone number or email already exists. Please sign in.' },
        { status: 409 }
      )
    }

    // Hash password with 12 salt rounds
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user in database (role is strictly enforced to CUSTOMER)
    const newUser = await prisma.user.create({
      data: {
        name: name || 'Valued Customer',
        phone: cleanPhone,
        email: userEmail,
        password: hashedPassword,
        role: 'CUSTOMER',
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
      },
    })

    // Set signed HTTP-only session cookie
    const token = await generateUserSessionToken({
      id: newUser.id,
      role: newUser.role,
      email: newUser.email,
    })

    const cookieStore = await cookies()
    cookieStore.set('atmodesk_user', token, getUserCookieOptions())

    return NextResponse.json({
      success: true,
      message: 'Account registered successfully!',
      user: newUser,
    })
  } catch (error: any) {
    console.error('[Registration Error]', error)
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}
