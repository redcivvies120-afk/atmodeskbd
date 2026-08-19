import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/shared/Providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { CartDrawer } from '@/components/cart/CartDrawer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'ATMODESK.bd — Premium Smart Clocks & Ambient Desk Tech Bangladesh',
  description:
    'Shop mini smart clocks, WiFi weather stations, nixie LED displays, and ambient desk gadgets in Bangladesh. Fast delivery & Cash on Delivery nationwide.',
  keywords: [
    'smart clock bangladesh',
    'weather station display',
    'desk gadgets dhaka',
    'pixel art clock',
    'ambient led light',
    'atmodesk bd',
  ],
  authors: [{ name: 'ATMODESK Bangladesh' }],
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'ATMODESK.bd — Smart Clocks & Ambient Desk Tech',
    description: 'Transform your desk with mini smart weather clocks and ambient gadgets in Bangladesh.',
    url: 'https://atmodeskbd.com',
    siteName: 'ATMODESK BD',
    locale: 'en_BD',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased bg-slate-50 text-slate-900 font-sans selection:bg-sky-500 selection:text-white">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <BottomNav />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  )
}
