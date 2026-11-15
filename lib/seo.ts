import { locales } from '@/i18n'
import { getLocalizedPath } from '@/routing'

/**
 * Canonical-URL + hreflang-alternatieven voor een pagina, zodat Google
 * de Nederlandse en Franse versie aan elkaar koppelt.
 * `path` = intern (Nederlands) pad zonder taalprefix, bv. "/contact" of "" voor de homepage;
 * vertaalde Franse paden (zie `routing.ts`) worden automatisch ingevuld.
 */
export function localizedAlternates(locale: string, path: string) {
  const url = (l: string) => `/${l}${getLocalizedPath(l, path)}`
  return {
    canonical: url(locale),
    languages: {
      ...Object.fromEntries(locales.map((l) => [`${l}-BE`, url(l)])),
      'x-default': url('nl'),
    },
  }
}
