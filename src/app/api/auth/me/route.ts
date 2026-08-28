import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('atmodesk_user')

    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null })
    }

    const decoded = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString('utf-8'))
    
    // Fetch full user from database with orders
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          include: { items: true },
          take: 10,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ user: null })
  }
}
