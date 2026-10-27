import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabaseTables } from '@/lib/init-db'
import { isServerAdminAuthenticated } from '@/lib/admin-auth'
import { sanitizeString } from '@/lib/security'

export async function POST(req: Request) {
  try {
    const isAuth = await isServerAdminAuthenticated()
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required.' }, { status: 401 })
    }

    await ensureDatabaseTables()
    const body = await req.json()
    const code = sanitizeString(body?.code, 30)
    const type = body?.type === 'FIXED' ? 'FIXED' : 'PERCENTAGE'
    const value = parseFloat(String(body?.value))
    const minOrderAmount = body?.minOrderAmount ? parseFloat(String(body.minOrderAmount)) : null

    if (!code || isNaN(value) || value <= 0 || (type === 'PERCENTAGE' && value > 100)) {
      return NextResponse.json({ error: 'Valid Code and Value are required (percentage must be 1-100)' }, { status: 400 })
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.trim().toUpperCase(),
        type,
        value,
        minOrderAmount,
      },
    })

    return NextResponse.json({ success: true, coupon })
  } catch (error: any) {
    console.error('[Admin Coupon Error]', error)
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 })
  }
}
