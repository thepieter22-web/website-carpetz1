import type { MetadataRoute } from 'next'
import { locales } from '@/i18n'
import { absoluteUrl } from '@/routing'

/** Publieke pagina's (interne paden; Franse vertaalde paden worden automatisch ingevuld). */
const routes = [
  '',
  '/logomat',
  '/logomat/go',
  '/logomat/green',
  '/logomat/studio',
  '/logomat/studio/pro',
  '/logomat/grip',
  '/logomat/scrape',
  '/logomat/vergelijk',
  '/geprint-tapijt',
  '/geprint-tapijt/winkel',
  '/geprint-tapijt/kantoor',
  '/geprint-tapijt/horeca',
  '/prijs-berekenen',
  '/event-tapijt',
  '/event-tapijt/loper',
  '/event-tapijt/eventvloer',
  '/event-tapijt/beurstapijt',
  '/over-ons',
  '/contact',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  // Elke pagina bestaat in het Nederlands en het Frans.
  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: absoluteUrl(locale, route),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, absoluteUrl(l, route)])),
      },
    }))
  )
}
