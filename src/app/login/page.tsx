import React from 'react'
import { AccountClient } from '@/app/account/AccountClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Sign In / Register / Google Sign Up — ATMODESK Bangladesh',
  description: 'Sign in to your Atmodesk account with Google, phone number, or track your orders.',
}

export default function LoginPage() {
  return <AccountClient />
}
