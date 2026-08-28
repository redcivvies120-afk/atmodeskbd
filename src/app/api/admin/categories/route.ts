import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { ensureDatabaseTables } from '@/lib/init-db'

export async function POST(req: Request) {
  try {
    await ensureDatabaseTables()
    const body = await req.json()
    const { name, description } = body
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const slug = slugify(name)
    const category = await prisma.category.create({
      data: { name, slug, description: description || null },
    })

    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 })
  }
}
