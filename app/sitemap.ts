import type { MetadataRoute } from 'next'
import { locales } from '@/i18n'

const baseUrl = 'https://carpetz.example'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/logomat', '/geprint-tapijt', '/event-tapijt', '/over-ons', '/contact']
  const lastModified = new Date()

  // Elke pagina bestaat in het Nederlands en het Frans.
  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [`${l}-BE`, `${baseUrl}/${l}${route}`])),
      },
    }))
  )
}
