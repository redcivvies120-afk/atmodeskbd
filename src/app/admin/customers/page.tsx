import React from 'react'
import { prisma } from '@/lib/prisma'
import { CustomersClient } from './CustomersClient'
import { ensureDatabaseTables } from '@/lib/init-db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminCustomersPage() {
  let customers: any[] = []
  try {
    await ensureDatabaseTables()
    customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      orderBy: { createdAt: 'desc' },
      include: {
        orders: {
          select: { id: true, total: true, status: true },
        },
      },
    })
  } catch (err) {
    console.error('Error fetching customers:', err)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Registered Customers
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          View all registered customer accounts, contact details, and their purchase history.
        </p>
      </div>

      <CustomersClient initialCustomers={customers} />
    </div>
  )
}
