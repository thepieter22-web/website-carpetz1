import type { MetadataRoute } from 'next'

const baseUrl = 'https://carpetz.example'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/logomat', '/geprint-tapijt', '/event-tapijt', '/over-ons', '/contact']
  const lastModified = new Date()

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }))
}