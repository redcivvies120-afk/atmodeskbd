import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { isServerAdminAuthenticated } from '@/lib/admin-auth'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isServerAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const newPassword = body?.newPassword

  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    return NextResponse.json({ error: 'Customer not found.' }, { status: 404 })
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({
    where: { id },
    data: {
      password: hashedPassword,
      tokenVersion: { increment: 1 },
    },
  })

  return NextResponse.json({
    success: true,
    message: `Password reset successfully for ${user.name || user.phone || user.email}`,
  })
}
