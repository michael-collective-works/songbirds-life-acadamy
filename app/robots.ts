import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://songbirdslifeacademy.com/sitemap.xml',
    host: 'https://songbirdslifeacademy.com',
  }
}
