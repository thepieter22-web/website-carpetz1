'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { ChevronDown, Menu, X } from 'lucide-react'
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

  // Welk submenu (href van het hoofditem) open staat.
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  type NavItem = { href: string; label: string; children?: { href: string; label: string }[] }
  const navItems: NavItem[] = [
    { href: '/', label: t('home') },
    { href: '/logomat#configurator', label: t('logomatten') },
    {
      href: '/geprint-tapijt',
      label: t('geprintTapijt'),
      children: [
        { href: '/geprint-tapijt', label: t('printedOverview') },
        { href: '/geprint-tapijt/winkel', label: t('printedShop') },
        { href: '/geprint-tapijt/kantoor', label: t('printedOffice') },
        { href: '/geprint-tapijt/horeca', label: t('printedHoreca') },
      ],
    },
    {
      href: '/event-tapijt',
      label: t('eventTapijt'),
      children: [
        { href: '/event-tapijt', label: t('eventOverview') },
        { href: '/event-tapijt/loper', label: t('eventRunner') },
        { href: '/event-tapijt/eventvloer', label: t('eventFloor') },
        { href: '/event-tapijt/beurstapijt', label: t('eventStand') },
      ],
    },
    { href: '/over-ons', label: t('overOns') },
    { href: '/contact', label: t('contact') },
  ]

  const isActive = (href: string) => {
    const path = href.split('#')[0]
    return path === '/' ? pathname === '/' : pathname.startsWith(path)
  }

  // Submenu sluiten bij het wisselen van pagina.
  useEffect(() => setOpenSubmenu(null), [pathname])

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
            if (item.children) {
              return (
                <div
                  key={item.href}
                  className="group relative flex items-center gap-1"
                  onMouseLeave={() => setOpenSubmenu(null)}
                  onKeyDown={(e) => e.key === 'Escape' && setOpenSubmenu(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'relative text-sm font-medium tracking-wide transition-colors hover:text-foreground',
                      active ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {item.label}
                    {active && <span className="absolute -bottom-1.5 left-0 h-px w-full bg-accent" aria-hidden="true" />}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setOpenSubmenu((v) => (v === item.href ? null : item.href))}
                    aria-expanded={openSubmenu === item.href}
                    aria-label={t('submenu', { item: item.label })}
                    className="inline-flex size-6 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
                  >
                    <ChevronDown className={cn('size-4 transition-transform', openSubmenu === item.href && 'rotate-180')} />
                  </button>
                  <div
                    className={cn(
                      'absolute left-0 top-full pt-3 transition-opacity',
                      openSubmenu === item.href
                        ? 'visible opacity-100'
                        : 'invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100',
                    )}
                  >
                    <ul className="w-64 rounded-sm border border-border bg-background p-2 shadow-xl">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            aria-current={pathname === child.href ? 'page' : undefined}
                            className={cn(
                              'flex min-h-11 items-center rounded-sm px-3 text-sm transition-colors hover:bg-muted',
                              pathname === child.href ? 'font-semibold text-foreground' : 'text-muted-foreground',
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            }
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
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-sm px-2 text-base font-medium text-foreground hover:bg-muted"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="mb-1 ml-2 border-l border-border pl-2">
                    {item.children.slice(1).map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="flex min-h-12 items-center rounded-sm px-2 text-base text-muted-foreground hover:bg-muted"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
