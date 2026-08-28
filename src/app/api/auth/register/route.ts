import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { normalizeBDPhone } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone, email, password } = body

    if (!phone || !password) {
      return NextResponse.json(
        { error: 'Phone number and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    const cleanPhone = normalizeBDPhone(phone)
    const userEmail = email && email.trim().length > 0 
      ? email.trim().toLowerCase() 
      : `${cleanPhone}@customer.atmodeskbd.com`

    // Check if user already exists by phone or email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userEmail },
          { phone: cleanPhone },
        ],
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this phone number or email already exists. Please sign in instead.' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        name: name?.trim() || 'Valued Customer',
        phone: cleanPhone,
        email: userEmail,
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    })

    // Set session cookie
    const cookieStore = await cookies()
    const sessionData = JSON.stringify({
      id: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
      email: newUser.email,
      role: newUser.role,
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
      message: 'Account registered successfully!',
      user: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
      },
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}
