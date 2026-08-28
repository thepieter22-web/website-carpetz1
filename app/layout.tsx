import { Analytics } from '@vercel/analytics/next'
import Script from "next/script"
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
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
export const metadata: Metadata = {
  metadataBase: new URL('https://carpetz.example'),
  title: {
    default: 'Logomatten, geprint tapijt & event tapijt op maat | Carpetz',
    template: '%s | Carpetz',
  },
  description:
    'Carpetz maakt logomatten op maat, geprint tapijt, event tapijt en rode lopers op maat voor retail, hotels, beurzen en events. Branding tapijt met snelle levering in België & Nederland.',
  keywords: [
    'logomatten op maat',
    'geprint tapijt',
    'event tapijt',
    'rode loper op maat',
    'tapijt bedrukken',
    'tapijt op maat',
    'branding tapijt',
    'tapijt voor beurzen',
  ],
  generator: 'v0.app',
  openGraph: {
    type: 'website',
    locale: 'nl_BE',
    siteName: 'Carpetz',
    title: 'Logomatten, geprint tapijt & event tapijt op maat | Carpetz',
    description:
      'Logomatten op maat, geprint tapijt, event tapijt en rode lopers op maat voor bedrijven, retail, hotels, beurzen en events.',
    images: [{ url: '/images/hero-event-carpet.png', width: 1200, height: 630, alt: 'Carpetz event tapijt en rode loper' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Logomatten, geprint tapijt & event tapijt op maat | Carpetz',
    description:
      'Logomatten op maat, geprint tapijt, event tapijt en rode lopers op maat met snelle levering in België & Nederland.',
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
export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f4ee',
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" className={`light bg-background ${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
  {children}
  <Script
    id="clarity"
    strategy="afterInteractive"
    dangerouslySetInnerHTML={{
      __html: `
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "y929gps4zk");
      `,
    }}
  />
  {process.env.NODE_ENV === "production" && <Analytics />}
</body>
    </html>
  )
}
