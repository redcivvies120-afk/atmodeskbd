import { NextResponse } from 'next/server'
import { verifyAdminPassword, generateAdminSessionToken } from '@/lib/admin-auth'
import { getClientIp, checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit'
import { sanitizeString } from '@/lib/security'

export async function POST(req: Request) {
  try {
    // 1. Rate limiting: max 5 login attempts per 15 minutes per IP
    const clientIp = getClientIp(req)
    const rateCheck = checkRateLimit(`admin_login:${clientIp}`, 5, 900)
    if (!rateCheck.success) {
      return rateLimitExceededResponse(rateCheck)
    }

    const body = await req.json()
    const password = sanitizeString(body?.password, 200)

    if (!password) {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 })
    }

    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: 'Incorrect admin password. Access denied.' },
        { status: 401 }
      )
    }

    const token = await generateAdminSessionToken()

    const response = NextResponse.json({
      success: true,
      message: 'Admin access granted',
    })

    // Set secure HTTP-only cookie with SameSite=Strict
    response.cookies.set({
      name: 'atmodesk_admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (err: any) {
    console.error('[Admin Login Error]', err)
    return NextResponse.json({ error: 'Authentication failed. Please try again.' }, { status: 500 })
  }
}
