import { useLocale, useTranslations } from 'next-intl'
import { SITE_URL, absoluteUrl } from '@/routing'

/**
 * Structured data (schema.org/Service) voor een dienstpagina: wat we aanbieden, door wie en waar.
 * De aanbieder verwijst naar het bedrijfsblok op de homepage (LocalBusinessJsonLd, @id …/#business).
 * Bewust zonder prijzen: die hangen af van maat en ontwerp.
 */
export function ServiceJsonLd({
  path,
  name,
  serviceType,
  description,
  image,
}: {
  /** Intern (Nederlands) pad, bv. "/event-tapijt/beurstapijt". */
  path: string
  name: string
  serviceType: string
  description: string
  image: string
}) {
  const locale = useLocale()
  const meta = useTranslations('Meta')
  const url = absoluteUrl(locale, path)

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name,
    serviceType,
    description,
    url,
    image: `${SITE_URL}${image}`,
    inLanguage: meta('inLanguage'),
    provider: { '@type': 'LocalBusiness', '@id': `${SITE_URL}/#business`, name: 'Carpetz', url: SITE_URL },
    areaServed: [
      { '@type': 'Country', name: meta('countryBE') },
      { '@type': 'Country', name: meta('countryNL') },
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
