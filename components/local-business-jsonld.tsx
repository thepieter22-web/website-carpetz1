export function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://carpetz.example/#business',
    name: 'Carpetz',
    description:
      'Carpetz is specialist in logomatten op maat, geprint tapijt, event tapijt en rode lopers op maat voor bedrijven, retail, hotels, beurzen en events.',
    url: 'https://carpetz.example',
    telephone: '+32 15 00 00 00',
    email: 'info@carpetz.be',
    image: 'https://carpetz.example/images/hero-event-carpet.png',
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Berkenlaan 1D',
      postalCode: '9840',
      addressLocality: 'de Pinte',
      addressCountry: 'BE',
    },
    areaServed: [
      { '@type': 'Country', name: 'België' },
      { '@type': 'Country', name: 'Nederland' },
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
      name: 'Tapijt op maat',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Logomatten op maat' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Geprint tapijt' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Event tapijt' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Rode loper op maat' } },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}