import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: 'https://rideflow.app', lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: 'https://rideflow.app/privacy', lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
