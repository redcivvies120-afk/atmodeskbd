import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/', '/order-confirmed/'],
      },
    ],
    sitemap: 'https://atmodeskbd-eo1e.vercel.app/sitemap.xml',
  }
}
