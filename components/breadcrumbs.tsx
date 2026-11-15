import { useLocale, useTranslations } from 'next-intl'
import { ChevronRight } from 'lucide-react'
import { Link } from '@/navigation'
import { absoluteUrl } from '@/routing'

export type Crumb = {
  label: string
  /** Intern pad (bv. "/event-tapijt"). Laat weg voor de huidige pagina. */
  href?: string
}

/**
 * Broodkruimelpad (Home › … › huidige pagina) + BreadcrumbList-schema voor Google.
 * "Home" wordt automatisch vooraan gezet. Bedoeld voor op een donkere hero.
 */
export function Breadcrumbs({ items, currentPath }: { items: Crumb[]; currentPath: string }) {
  const t = useTranslations('Breadcrumbs')
  const locale = useLocale()
  const crumbs: Crumb[] = [{ label: t('home'), href: '/' }, ...items]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      item: absoluteUrl(locale, crumb.href === '/' ? '' : crumb.href ?? currentPath),
    })),
  }

  return (
    <nav aria-label={t('ariaLabel')} className="mb-4 text-sm">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-primary-foreground/70">
        {crumbs.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3.5 shrink-0 text-primary-foreground/40" aria-hidden="true" />}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="inline-flex items-center transition-colors hover:text-accent pointer-coarse:min-h-12"
              >
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-primary-foreground">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </nav>
  )
}
