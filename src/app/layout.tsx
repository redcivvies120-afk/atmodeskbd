import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/shared/Providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { WhatsAppFloat } from '@/components/shared/WhatsAppFloat'

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
  verification: {
    google: '76Msg-lcct6zmLIiUm1S21WLUuqHr-xDLdpnrg9f1tg',
  },
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
    <html lang="en" className={`${inter.variable} overflow-x-hidden`}>
      <head>
        <meta name="google-site-verification" content="76Msg-lcct6zmLIiUm1S21WLUuqHr-xDLdpnrg9f1tg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-slate-50/90 text-slate-900 font-sans selection:bg-sky-500 selection:text-white relative overflow-x-hidden">
        {/* Ambient background light orbs for high-end frosted glass refraction */}
        <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-sky-200/30 dark:bg-sky-900/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="fixed top-1/3 -right-24 w-[450px] h-[450px] bg-indigo-200/25 dark:bg-indigo-900/10 rounded-full blur-[130px] pointer-events-none -z-10" />
        <div className="fixed bottom-1/4 -left-20 w-[400px] h-[400px] bg-teal-100/30 dark:bg-teal-900/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="fixed -bottom-10 right-1/4 w-[450px] h-[450px] bg-amber-100/30 dark:bg-amber-900/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <Providers>
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <Footer />
          <BottomNav />
          <CartDrawer />
          <WhatsAppFloat />
        </Providers>
        {/* Facebook Pixel - Replace YOUR_PIXEL_ID with your actual Facebook Pixel ID */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'YOUR_PIXEL_ID');
              fbq('track', 'PageView');
            `,
          }}
        />
      </body>
    </html>
  )
}
