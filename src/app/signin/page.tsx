import React from 'react'
import { AccountClient } from '@/app/account/AccountClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Sign In — ATMODESK Bangladesh',
  description: 'Sign in to your Atmodesk account with Google or phone number.',
}

export default function SignInPage() {
  return <AccountClient />
}
