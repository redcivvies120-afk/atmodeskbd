import { NextResponse } from 'next/server'
import { verifyAdminPassword, generateAdminSessionToken } from '@/lib/admin-auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Incorrect admin password. Please try again.' }, { status: 401 })
    }

    const token = generateAdminSessionToken(password.trim())

    const response = NextResponse.json({
      success: true,
      message: 'Admin access granted',
    })

    // Set HTTP-only secure cookie for 30 days
    response.cookies.set({
      name: 'atmodesk_admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return response
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 })
  }
}
