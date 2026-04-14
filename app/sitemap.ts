import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://songbirdslifeacademy.com'
  const lastModified = new Date()

  return [
    { url: `${base}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/about`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/events`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/store`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/join`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
  ]
}
