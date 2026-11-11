import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
});

/**
 * Onderhoudsmodus: bezoekers van het echte domein zien enkel de onderhoudspagina
 * (app/onderhoud/route.ts). Previews (*.vercel.app) en localhost blijven gewoon werken,
 * net als /api (o.a. de Stripe-webhook) en bestanden zoals afbeeldingen.
 *
 * Uitzetten zonder codewijziging: zet in Vercel de omgevingsvariabele MAINTENANCE_MODE=off
 * en deploy opnieuw.
 */
const LIVE_HOSTS = ['carpetz.be', 'www.carpetz.be'];

export default function middleware(request: NextRequest) {
  // De onderhoudspagina zelf niet via de taal-middleware sturen.
  if (request.nextUrl.pathname === '/onderhoud') return NextResponse.next();

  const host = (request.headers.get('host') ?? '').toLowerCase().split(':')[0];
  const maintenance = process.env.MAINTENANCE_MODE !== 'off' && LIVE_HOSTS.includes(host);

  if (maintenance) {
    return NextResponse.rewrite(new URL('/onderhoud', request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
