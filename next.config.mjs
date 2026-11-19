import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Afbeeldingen automatisch verkleinen tot schermformaat en als AVIF/WebP leveren (grote winst op mobiel).
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    // Franse pagina's kregen een Franse URL: oude adressen blijvend (301) doorsturen.
    return [
      ['/fr/event-tapijt', '/fr/tapis-evenementiel'],
      ['/fr/event-tapijt/loper', '/fr/tapis-evenementiel/tapis-rouge'],
      ['/fr/event-tapijt/eventvloer', '/fr/tapis-evenementiel/sol-evenementiel'],
      ['/fr/event-tapijt/beurstapijt', '/fr/tapis-evenementiel/tapis-exposition-imprime'],
      ['/fr/tapis-evenementiel/stand-salon', '/fr/tapis-evenementiel/tapis-exposition-imprime'],
      ['/fr/geprint-tapijt', '/fr/tapis-imprime'],
      ['/fr/geprint-tapijt/winkel', '/fr/tapis-imprime/commerce'],
      ['/fr/geprint-tapijt/kantoor', '/fr/tapis-imprime/bureau'],
      ['/fr/geprint-tapijt/horeca', '/fr/tapis-imprime/horeca'],
      ['/fr/prijs-berekenen', '/fr/calculer-prix'],
    ].map(([source, destination]) => ({ source, destination, statusCode: 301 }));
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
