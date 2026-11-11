import { useTranslations } from 'next-intl'
import { Mail, Phone, MapPin } from 'lucide-react'
import { Link } from '@/navigation'
import { CookieSettingsLink } from '@/components/cookie-consent/cookie-settings-link'

export function SiteFooter() {
  const t = useTranslations('Footer')

  const productLinks = [
    { href: '/logomat', label: t('logomats') },
    { href: '/geprint-tapijt', label: t('printedCarpet') },
    { href: '/event-tapijt', label: t('eventCarpet') },
  ]

  const companyLinks = [
    { href: '/over-ons', label: t('about') },
    { href: '/contact', label: t('contactQuote') },
  ]

  const legalLinks = [
    { href: '/algemene-voorwaarden', label: t('terms') },
    { href: '/privacybeleid', label: t('privacy') },
    { href: '/retourbeleid', label: t('returns') },
  ]

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-semibold tracking-tight">Carpetz</span>
            <span className="mt-2 block size-1.5 rounded-full bg-accent" aria-hidden="true" />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/70">{t('tagline')}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">{t('products')}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {productLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-block py-1 text-primary-foreground/75 transition-colors hover:text-accent pointer-coarse:py-2">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">{t('company')}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-block py-1 text-primary-foreground/75 transition-colors hover:text-accent pointer-coarse:py-2">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">{t('contact')}</h2>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/75">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>{t('address')}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-accent" />
              <a href="tel:+32488236581" className="py-1 transition-colors hover:text-accent pointer-coarse:py-2">
                +32 488 23 65 81
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-accent" />
              <a href="mailto:info@carpetz.be" className="py-1 transition-colors hover:text-accent pointer-coarse:py-2">
                info@carpetz.be
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-primary-foreground/60 sm:flex-row lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} Carpetz. {t('rights')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="py-1 transition-colors hover:text-accent pointer-coarse:py-2.5">
                {l.label}
              </Link>
            ))}
            <CookieSettingsLink className="py-1 transition-colors hover:text-accent pointer-coarse:py-2.5" />
          </div>
        </div>
      </div>
    </footer>
  )
}
