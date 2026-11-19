import { defineRouting, type Pathnames } from 'next-intl/routing'
import { defaultLocale, locales, type Locale } from './i18n'

/** Publiek domein van de site (canonical, hreflang, sitemap, schema.org). */
export const SITE_URL = 'https://www.carpetz.be'

/**
 * Pagina's met een eigen Franse URL. Sleutel = interne route (mapnaam onder app/[locale]).
 * Pagina's die hier niet staan, hebben in beide talen hetzelfde pad.
 */
export const pathnames: Pathnames<typeof locales> = {
  '/event-tapijt': { nl: '/event-tapijt', fr: '/tapis-evenementiel' },
  '/event-tapijt/loper': { nl: '/event-tapijt/loper', fr: '/tapis-evenementiel/tapis-rouge' },
  '/event-tapijt/eventvloer': { nl: '/event-tapijt/eventvloer', fr: '/tapis-evenementiel/sol-evenementiel' },
  '/event-tapijt/beurstapijt': { nl: '/event-tapijt/beurstapijt', fr: '/tapis-evenementiel/tapis-exposition-imprime' },
  '/geprint-tapijt': { nl: '/geprint-tapijt', fr: '/tapis-imprime' },
  '/geprint-tapijt/winkel': { nl: '/geprint-tapijt/winkel', fr: '/tapis-imprime/commerce' },
  '/geprint-tapijt/kantoor': { nl: '/geprint-tapijt/kantoor', fr: '/tapis-imprime/bureau' },
  '/geprint-tapijt/horeca': { nl: '/geprint-tapijt/horeca', fr: '/tapis-imprime/horeca' },
  '/prijs-berekenen': { nl: '/prijs-berekenen', fr: '/calculer-prix' },
}

export const routing = defineRouting({ locales, defaultLocale, pathnames })

/** Zichtbaar pad in een taal, zonder taalprefix. "/event-tapijt" → "/tapis-evenementiel" (fr). */
export function getLocalizedPath(locale: Locale | string, path: string) {
  const entry = pathnames[path]
  if (!entry) return path
  return typeof entry === 'string' ? entry : entry[locale as Locale]
}

/** Volledige URL, bv. voor schema.org en de sitemap. */
export function absoluteUrl(locale: Locale | string, path: string) {
  return `${SITE_URL}/${locale}${getLocalizedPath(locale, path)}`
}
