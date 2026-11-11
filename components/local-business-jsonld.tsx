import { useLocale, useTranslations } from 'next-intl'

export function LocalBusinessJsonLd() {
  const locale = useLocale()
  const meta = useTranslations('Meta')
  const footer = useTranslations('Footer')

  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://carpetz.example/#business',
    name: 'Carpetz',
    description: meta('description'),
    url: `https://carpetz.example/${locale}`,
    inLanguage: meta('inLanguage'),
    telephone: '+32 488 23 65 81',
    email: 'info@carpetz.be',
    image: 'https://carpetz.example/images/hero-event-carpet.png',
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Berkenlaan 1D',
      postalCode: '9840',
      addressLocality: 'De Pinte',
      addressCountry: 'BE',
    },
    areaServed: [
      { '@type': 'Country', name: meta('countryBE') },
      { '@type': 'Country', name: meta('countryNL') },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:30',
        closes: '17:30',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: meta('catalogName'),
      itemListElement: [footer('logomats'), footer('printedCarpet'), footer('eventCarpet')].map((name) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name },
      })),
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
