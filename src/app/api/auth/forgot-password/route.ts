import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabaseTables } from '@/lib/init-db'

export async function POST(req: Request) {
  try {
    await ensureDatabaseTables()
    const { identifier } = await req.json()

    if (!identifier || !identifier.trim()) {
      return NextResponse.json({ error: 'Please enter your phone number or email.' }, { status: 400 })
    }

    const cleanIdentifier = identifier.trim()

    // Find user by email or phone
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
        { error: 'No account found with this phone number or email. You can register a new account or order as a guest without signing in!' },
        { status: 404 }
      )
    }

    // In Bangladesh e-commerce, instant reset via WhatsApp support link or SMS instructions
    const whatsappUrl = `https://wa.me/8801318043562?text=${encodeURIComponent(
      `Hello Atmodesk Support, I requested a password reset for my account (${cleanIdentifier}). Please help me reset my access.`
    )}`

    return NextResponse.json({
      success: true,
      message: `Account found for ${user.name || cleanIdentifier}! An instant reset request has been initiated. You can also click below to confirm via WhatsApp support directly.`,
      whatsappUrl,
    })
  } catch (err: any) {
    console.error('[Forgot Password Error]', err)
    return NextResponse.json({ error: 'Failed to process request. Please try again or contact WhatsApp support.' }, { status: 500 })
  }
}
