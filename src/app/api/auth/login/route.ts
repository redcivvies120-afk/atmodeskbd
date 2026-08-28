import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { identifier, password } = body

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Please provide your phone number/email and password' },
        { status: 400 }
      )
    }

    const cleanInput = identifier.trim()

    // Find user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanInput.toLowerCase() },
          { phone: cleanInput },
        ],
      },
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid phone/email or password' },
        { status: 401 }
      )
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid phone/email or password' },
        { status: 401 }
      )
    }

    // Set session cookie
    const cookieStore = await cookies()
    const sessionData = JSON.stringify({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
    })

    cookieStore.set('atmodesk_user', Buffer.from(sessionData).toString('base64'), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

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
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Failed to sign in. Please try again.' },
      { status: 500 }
    )
  }
}
