import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { ensureDatabaseTables } from '@/lib/init-db'
import { isServerAdminAuthenticated } from '@/lib/admin-auth'
import { sanitizeString, sanitizeMultiline } from '@/lib/security'

export async function POST(req: Request) {
  try {
    const isAuth = await isServerAdminAuthenticated()
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required.' }, { status: 401 })
    }

    await ensureDatabaseTables()
    const body = await req.json()
    const rawName = sanitizeString(body?.name, 100)
    const rawDescription = sanitizeMultiline(body?.description, 1000)

    if (!rawName) return NextResponse.json({ error: 'Category name is required' }, { status: 400 })

    const slug = slugify(rawName)
    const category = await prisma.category.create({
      data: { name: rawName, slug, description: rawDescription || null },
    })

    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    console.error('[Admin Category Error]', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
