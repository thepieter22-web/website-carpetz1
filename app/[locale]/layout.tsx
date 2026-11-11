import { Analytics } from '@vercel/analytics/next'
import { CookieBanner } from '@/components/cookie-consent/cookie-banner'
import { ConsentScripts } from '@/components/cookie-consent/consent-scripts'
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { localizedAlternates } from '@/lib/seo'
import { notFound } from 'next/navigation'
import { locales } from '../../i18n'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta' })

  return {
    metadataBase: new URL('https://carpetz.example'),
    title: {
      default: t('defaultTitle'),
      template: t('titleTemplate'),
    },
    description: t('description'),
    keywords: t('keywords').split(',').map((k) => k.trim()),
    alternates: localizedAlternates(locale, ''),
    openGraph: {
      type: 'website',
      locale: t('ogLocale'),
      siteName: 'Carpetz',
      title: t('defaultTitle'),
      description: t('ogDescription'),
      images: [{ url: '/images/hero-event-carpet.png', width: 1200, height: 630, alt: t('ogImageAlt') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('defaultTitle'),
      description: t('twitterDescription'),
      images: ['/images/hero-event-carpet.png'],
    },
    icons: {
      icon: [
        { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
        { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-icon.png',
    },
  }
}

/**
 * Vertalingen die client-componenten ('use client') nodig hebben. Enkel deze gaan mee
 * naar de browser; de rest (homepage, e-mails, metadata …) blijft op de server.
 * Nieuw client-component met een eigen namespace? Voeg die hier toe.
 */
const CLIENT_NAMESPACES = [
  'Common',
  'Header',
  'Footer',
  'CookieConsent',
  'ContactForm',
  'CarpetSimulator',
  'Configurator',
  'MatCanvas',
  'LogoUploader',
  'ColorPalette',
  'PriceCalculator',
  'ArViewer',
  'MatTypes',
  'Cart',
  'Legal',
] as const

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Nodig om de iPhone-thuisbalk (safe area) te respecteren bij vaste balken onderaan.
  viewportFit: 'cover',
  colorScheme: 'light',
  themeColor: '#f7f4ee',
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode
  params: { locale: string }
}>) {
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound()
  }

  unstable_setRequestLocale(locale)
  const allMessages = await getMessages()
  const messages = Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => ns in allMessages).map((ns) => [ns, allMessages[ns]])
  )

  return (
    <html lang={locale} className={`light bg-background ${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <CookieBanner />
        </NextIntlClientProvider>
        {/* Tracking (Clarity, ...) laadt pas na toestemming via de cookiebanner. */}
        <ConsentScripts />
        {/* Vercel Analytics is cookieloos en anoniem: geen toestemming nodig. */}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
