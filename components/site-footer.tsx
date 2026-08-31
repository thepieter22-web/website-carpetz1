import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

const productLinks = [
  { href: '/logomat', label: 'Logomatten op maat' },
  { href: '/geprint-tapijt', label: 'Geprint tapijt' },
  { href: '/event-tapijt', label: 'Event tapijt & rode lopers' },
]

const companyLinks = [
  { href: '/over-ons', label: 'Over ons' },
  { href: '/contact', label: 'Contact & offerte' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-semibold tracking-tight">Carpetz</span>
            <span className="mt-2 block size-1.5 rounded-full bg-accent" aria-hidden="true" />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
            Specialist in logomatten op maat, geprint tapijt, event tapijt en rode lopers op maat
            voor bedrijven, retail, hotels, beurzen en events in België & Nederland.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">Producten</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {productLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-primary-foreground/75 transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">Bedrijf</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-primary-foreground/75 transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/75">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>Berkenlaan 1D, 9840 de Pinte, België</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-accent" />
              <a href="tel:+3215000000" className="transition-colors hover:text-accent">
                +32 15 00 00 00
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-accent" />
              <a href="mailto:info@carpetz.be" className="transition-colors hover:text-accent">
                info@carpetz.be
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-primary-foreground/60 sm:flex-row lg:px-8">
          <p>&copy; {new Date().getFullYear()} Carpetz. Alle rechten voorbehouden.</p>
          <p>Logomatten &middot; Geprint tapijt &middot; Event tapijt &middot; Rode lopers op maat</p>
        </div>
      </div>
    </footer>
  )
}
