import type { Metadata } from 'next'
import { locales } from '@/i18n'
import { getLocalizedPath } from '@/routing'

/** Deelbeeld voor pagina's zonder eigen foto (zelfde als de homepage). */
const DEFAULT_SOCIAL_IMAGE = { url: '/images/hero-event-carpet.png', width: 1200, height: 630 }

const OG_LOCALES: Record<string, string> = { nl: 'nl_BE', fr: 'fr_BE' }

/**
 * Canonical-URL + hreflang-alternatieven voor een pagina, zodat Google
 * de Nederlandse en Franse versie aan elkaar koppelt.
 * `path` = intern (Nederlands) pad zonder taalprefix, bv. "/contact" of "" voor de homepage;
 * vertaalde Franse paden (zie `routing.ts`) worden automatisch ingevuld.
 * Hreflang is bewust "nl"/"fr" (zonder land): de site richt zich op België én Nederland.
 */
export function localizedAlternates(locale: string, path: string) {
  const url = (l: string) => `/${l}${getLocalizedPath(l, path)}`
  return {
    canonical: url(locale),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, url(l)])),
      'x-default': url('nl'),
    },
  }
}

type SocialImage = { url: string; alt?: string; width?: number; height?: number }

/**
 * Volledige metadata voor een pagina: canonical + hreflang, Open Graph (deelkaartje in
 * WhatsApp, LinkedIn, Facebook) en Twitter/X. Een pagina die zelf `openGraph` zet, overschrijft
 * die van de layout volledig; daarom vullen we hier ook type, taal, sitenaam en URL opnieuw in.
 */
export function pageMetadata(
  locale: string,
  path: string,
  { title, description, images }: { title: string; description?: string; images?: SocialImage[] },
): Pick<Metadata, 'alternates' | 'openGraph' | 'twitter' | 'keywords'> {
  const alternates = localizedAlternates(locale, path)
  const socialImages = images?.length ? images : [DEFAULT_SOCIAL_IMAGE]
  return {
    alternates,
    // De algemene zoekwoorden uit de layout horen enkel bij de homepage (Google gebruikt ze niet).
    keywords: null,
    openGraph: {
      type: 'website',
      siteName: 'Carpetz',
      locale: OG_LOCALES[locale] ?? OG_LOCALES.nl,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
      url: alternates.canonical,
      title,
      ...(description && { description }),
      images: socialImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      ...(description && { description }),
      images: socialImages.map((image) => image.url),
    },
  }
}
