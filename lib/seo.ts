import { locales } from '@/i18n'

/**
 * Canonical-URL + hreflang-alternatieven voor een pagina, zodat Google
 * de Nederlandse en Franse versie aan elkaar koppelt.
 * `path` zonder taalprefix, bv. "/contact" of "" voor de homepage.
 */
export function localizedAlternates(locale: string, path: string) {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [`${l}-BE`, `/${l}${path}`])),
      'x-default': `/nl${path}`,
    },
  }
}
