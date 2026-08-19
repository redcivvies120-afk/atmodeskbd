import React from 'react'
import { AccountClient } from './AccountClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Customer Portal & Track Order — ATMODESK Bangladesh',
  description: 'Sign in to your Atmodesk account or track your orders with your phone number.',
}

export default function AccountPage() {
  return <AccountClient />
}
