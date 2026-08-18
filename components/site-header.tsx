'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Cta } from '@/components/cta'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/logomat', label: 'Logomatten' },
  { href: '/geprint-tapijt', label: 'Geprint tapijt' },
  { href: '/event-tapijt', label: 'Event tapijt' },
  { href: '/over-ons', label: 'Over ons' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Carpetz home">
          <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            Carpetz
          </span>
          <span className="mt-2 block size-1.5 rounded-full bg-accent" aria-hidden="true" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Hoofdnavigatie">
          {navItems.map((item) => {
            const active =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
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
                {active && (
                  <span className="absolute -bottom-1.5 left-0 h-px w-full bg-accent" aria-hidden="true" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="hidden lg:block">
          <Cta href="/contact" variant="accent">
            Vraag je offerte aan
          </Cta>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-sm p-2 text-foreground lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Menu sluiten' : 'Menu openen'}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/70 bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4" aria-label="Mobiele navigatie">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-sm px-2 py-3 text-base font-medium text-foreground hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3">
              <Cta href="/contact" variant="accent" className="w-full">
                Vraag je offerte aan
              </Cta>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}