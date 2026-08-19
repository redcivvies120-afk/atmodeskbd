import React from 'react'
import { prisma } from '@/lib/prisma'
import { CouponManagerClient } from './CouponManagerClient'

export const revalidate = 0

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Coupon &amp; Voucher Management
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Create promotional discount codes for Bangladesh customers.
        </p>
      </div>

      <CouponManagerClient initialCoupons={coupons} />
    </div>
  )
}
