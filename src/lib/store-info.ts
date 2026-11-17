// Single place for business details used on invoices and admin messages.
// Edit these values to change what appears on printed/PDF invoices.
export const STORE = {
  name: 'ATMODESK.bd',
  tagline: 'Smart workspace tech · Bangladesh',
  address: 'New Eskaton, Dhaka, Bangladesh',
  phone: '+880 1318-043562',
  phoneNote: 'WhatsApp, text only',
  email: 'support@atmodeskbd.com',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://atmodeskbd.vercel.app',
} as const
