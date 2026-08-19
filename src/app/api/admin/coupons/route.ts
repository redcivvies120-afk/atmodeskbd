import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { code, type, value, minOrderAmount } = body
    if (!code || !value) return NextResponse.json({ error: 'Code and Value are required' }, { status: 400 })

    const coupon = await prisma.coupon.create({
      data: {
        code: code.trim().toUpperCase(),
        type: type || 'PERCENTAGE',
        value: parseFloat(value),
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
      },
    })

    return NextResponse.json({ success: true, coupon })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 })
  }
}
