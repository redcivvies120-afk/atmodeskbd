import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabaseTables } from '@/lib/init-db'
import { getServerUserSession } from '@/lib/user-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await ensureDatabaseTables()

    // Cryptographically verified user session
    const session = await getServerUserSession()
    if (!session || !session.id) {
      return NextResponse.json({ user: null })
    }

    // Fetch user from database matching ONLY the verified session ID
    const user = await prisma.user.findUnique({
      where: { id: session.id },
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
    console.error('[Auth Me Error]', error)
    return NextResponse.json({ user: null })
  }
}
