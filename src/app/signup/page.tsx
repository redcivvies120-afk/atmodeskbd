import React from 'react'
import { AccountClient } from '@/app/account/AccountClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Sign Up / Google Registration — ATMODESK Bangladesh',
  description: 'Create an account on Atmodesk with Google or phone number.',
}

export default function SignUpPage() {
  return <AccountClient />
}
