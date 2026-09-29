import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { ensureDatabaseTables } from '@/lib/init-db'

export async function POST(req: Request) {
  try {
    await ensureDatabaseTables()
    const body = await req.json()
    const { identifier, newPassword, action } = body

    if (!identifier || !identifier.trim()) {
      return NextResponse.json({ error: 'Please enter your registered phone number or email.' }, { status: 400 })
    }

    const cleanIdentifier = identifier.trim()

    // 1. Find user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanIdentifier },
          { phone: cleanIdentifier },
          { email: cleanIdentifier.includes('@') ? cleanIdentifier : `${cleanIdentifier}@customer.atmodeskbd.com` },
        ],
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this phone number or email. Please check your spelling or register a new account.' },
        { status: 404 }
      )
    }

    // If action is 'check', verify user exists and allow proceeding to set new password
    if (action === 'check') {
      return NextResponse.json({
        success: true,
        userName: user.name || 'Customer',
        message: `Account found for ${user.name || cleanIdentifier}. Please set your new password below.`,
      })
    }

    // 2. Perform direct password reset
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters.' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

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
    return NextResponse.json({ error: 'Failed to reset password. Please try again.' }, { status: 500 })
  }
}
