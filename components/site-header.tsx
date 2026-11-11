'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { Link, usePathname } from '@/navigation'
import { cn } from '@/lib/utils'
import { Cta } from '@/components/cta'
import { locales } from '@/i18n'

export function SiteHeader() {
  const t = useTranslations('Header')
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  // Pad zonder taalprefix, bv. "/logomat".
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/logomat', label: t('logomatten') },
    { href: '/geprint-tapijt', label: t('geprintTapijt') },
    { href: '/event-tapijt', label: t('eventTapijt') },
    { href: '/over-ons', label: t('overOns') },
    { href: '/contact', label: t('contact') },
  ]

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  const languageSwitch = (
    <div className="flex items-center gap-2 text-sm font-medium" aria-label={t('language')}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden="true">|</span>}
          <Link
            href={pathname}
            locale={l}
            hrefLang={l}
            aria-current={locale === l ? 'true' : undefined}
            className={cn(
              'inline-flex min-h-12 min-w-12 items-center justify-center lg:min-h-0 lg:min-w-0',
              locale === l ? 'font-bold' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 lg:bg-background/85 lg:backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label={t('homeAria')}>
          <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">Carpetz</span>
          <span className="mt-2 block size-1.5 rounded-full bg-accent" aria-hidden="true" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label={t('mainNav')}>
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative text-sm font-medium tracking-wide transition-colors hover:text-foreground',
                  active ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {item.label}
                {active && <span className="absolute -bottom-1.5 left-0 h-px w-full bg-accent" aria-hidden="true" />}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {languageSwitch}
          <Cta href="/contact" variant="accent">
            {t('offerte')}
          </Cta>
        </div>

        <button
          type="button"
          className="inline-flex size-12 items-center justify-center rounded-sm text-foreground lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t('closeMenu') : t('openMenu')}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/70 bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4" aria-label={t('mobileNav')}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center rounded-sm px-2 text-base font-medium text-foreground hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <div className="px-2 pt-3">{languageSwitch}</div>
            <div className="pt-3">
              <Cta href="/contact" variant="accent" className="w-full">
                {t('offerte')}
              </Cta>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
