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
    'Shop mini smart clocks, WiFi weather stations, nixie LED displays, and ambient desk gadgets in Bangladesh. Fast delivery & Cash on Delivery nationwide. New Eskaton, Dhaka.',
  keywords: [
    'smart clock bangladesh',
    'weather station display bangladesh',
    'desk gadgets dhaka',
    'pixel art clock bangladesh',
    'ambient led light bangladesh',
    'atmodesk bd',
    'atmodeskbd',
    'smart clock dhaka',
    'mini clock bangladesh',
    'rgb clock bangladesh',
    'smart desk gadgets dhaka',
    'buy smart clock online bangladesh',
    'wifi weather clock bangladesh',
  ],
  authors: [{ name: 'ATMODESK Bangladesh' }],
  metadataBase: new URL('https://atmodeskbd-eo1e.vercel.app'),
  openGraph: {
    title: 'ATMODESK.bd — Smart Clocks & Ambient Desk Tech',
    description: 'Transform your desk with mini smart weather clocks and ambient gadgets. Fast delivery in Bangladesh.',
    url: 'https://atmodeskbd-eo1e.vercel.app',
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'OnlineStore',
        '@id': 'https://atmodeskbd-eo1e.vercel.app/#store',
        name: 'ATMODESK.bd',
        alternateName: 'Atmodeskbd',
        url: 'https://atmodeskbd-eo1e.vercel.app',
        logo: 'https://atmodeskbd-eo1e.vercel.app/logo.jpg',
        description: 'Premium smart clocks, weather stations, and ambient desk accessories in Bangladesh.',
        telephone: '+8801318043562',
        priceRange: '৳৳',
        currenciesAccepted: 'BDT',
        paymentAccepted: 'Cash on Delivery',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'New Eskaton',
          addressLocality: 'Dhaka',
          addressRegion: 'Dhaka',
          addressCountry: 'BD',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://atmodeskbd-eo1e.vercel.app/#website',
        url: 'https://atmodeskbd-eo1e.vercel.app',
        name: 'ATMODESK.bd',
        publisher: {
          '@id': 'https://atmodeskbd-eo1e.vercel.app/#store',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://atmodeskbd-eo1e.vercel.app/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
