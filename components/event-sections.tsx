import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { ArrowRight, CheckCircle2, Sparkles, type LucideIcon } from 'lucide-react'
import { Link } from '@/navigation'
import { cn } from '@/lib/utils'
import { RevealItem } from '@/components/reveal-item'

export type TitleText = { title: string; text: string }

/** De drie soorten event tapijt (overzicht + "meer event tapijt" onderaan de subpagina's). */
// fit: 'contain' voor een vrijstaande productfoto, 'cover' voor een sfeerfoto.
export const EVENT_PAGES: readonly { key: 'runner' | 'floor' | 'stand'; href: '/event-tapijt/loper' | '/event-tapijt/eventvloer' | '/event-tapijt/beurstapijt'; image: string; fit: 'cover' | 'contain' }[] = [
  { key: 'runner', href: '/event-tapijt/loper', image: '/images/feestloper-op-maat.webp', fit: 'cover' },
  { key: 'floor', href: '/event-tapijt/eventvloer', image: '/images/geprint-tapijt.webp', fit: 'cover' },
  { key: 'stand', href: '/event-tapijt/beurstapijt', image: '/images/beurstapijt-bosvloer-stand.webp', fit: 'cover' },
]

export type EventPageKey = (typeof EVENT_PAGES)[number]['key']

/** Kaarten naar de event-subpagina's. `exclude` = huidige pagina (niet naar zichzelf linken). */
export function EventCards({ exclude, headingLevel = 'h3' }: { exclude?: EventPageKey; headingLevel?: 'h2' | 'h3' }) {
  const t = useTranslations('Event')
  const Heading = headingLevel
  const pages = EVENT_PAGES.filter((page) => page.key !== exclude)

  return (
    <ul className={cn('grid grid-cols-1 gap-6', pages.length === 3 ? 'md:grid-cols-3' : 'sm:grid-cols-2')}>
      {pages.map((page) => (
        <li key={page.key}>
          <Link
            href={page.href}
            className="group flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card transition-colors hover:border-accent"
          >
            <div className="relative aspect-[4/3] bg-primary">
              <Image
                src={page.image}
                alt={t(`cards.${page.key}.imageAlt`)}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={page.fit === 'contain' ? 'object-contain p-4' : 'object-cover'}
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <Heading className="font-serif text-2xl font-semibold leading-tight">{t(`cards.${page.key}.title`)}</Heading>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{t(`cards.${page.key}.text`)}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-foreground">
                {t(`cards.${page.key}.link`)}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

/** "Meer event tapijt": de andere subpagina's + link terug naar het overzicht. */
export function RelatedEventPages({ current }: { current: EventPageKey }) {
  const t = useTranslations('Event')
  return (
    <section className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">{t('relatedTitle')}</h2>
          <Link
            href="/event-tapijt"
            className="group inline-flex min-h-12 items-center gap-2 text-sm font-semibold uppercase tracking-widest text-foreground"
          >
            {t('backToOverview')}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-10">
          <EventCards exclude={current} />
        </div>
      </div>
    </section>
  )
}

/**
 * Genummerde stappen ("Zo werkt het").
 * `images` (optioneel): een foto per stap, bovenaan de kaart; de alt-tekst staat in de stap zelf (`imageAlt`).
 * `reveal`: stappen verschijnen een voor een bij het scrollen.
 */
export function StepsSection({
  title,
  steps,
  images,
  reveal = false,
  className,
}: {
  title: string
  steps: (TitleText & { imageAlt?: string })[]
  images?: string[]
  reveal?: boolean
  className?: string
}) {
  const Item = reveal ? RevealItem : 'li'
  return (
    <section className={cn('border-t border-border', className)}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">{title}</h2>
        <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const image = images?.[i]
            const number = (
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-accent font-serif text-lg font-semibold text-accent-foreground">
                {i + 1}
              </span>
            )
            return (
              <Item
                key={step.title}
                {...(reveal ? { delay: i * 150 } : {})}
                className="flex flex-col overflow-hidden rounded-sm border border-border bg-card"
              >
                {image && (
                  <div className="relative aspect-[3/2] overflow-hidden bg-muted">
                    <Image
                      src={image}
                      alt={step.imageAlt ?? ''}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <span className="absolute left-4 top-4 shadow-sm">{number}</span>
                  </div>
                )}
                <div className="p-6">
                  {!image && <div className="mb-5">{number}</div>}
                  <h3 className="text-base font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </div>
              </Item>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/** Raster met kenmerken (icoon + titel + tekst). */
export function FeatureGrid({
  title,
  text,
  items,
  icons = [],
  className,
  id,
}: {
  id?: string
  title: string
  text?: string
  items: TitleText[]
  icons?: LucideIcon[]
  className?: string
}) {
  return (
    <section id={id} className={cn('border-t border-border', className)}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">{title}</h2>
        {text && <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">{text}</p>}
        <div
          className={cn(
            'mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2',
            items.length === 3 ? 'lg:grid-cols-3' : items.length > 3 && 'lg:grid-cols-4',
          )}
        >
          {items.map((item, i) => {
            const Icon = icons[i] ?? Sparkles
            return (
              <div key={item.title} className="rounded-sm border border-border bg-card p-6">
                <span className="inline-flex size-11 items-center justify-center rounded-sm bg-accent/15 text-accent">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/** Lijst met vinkjes. */
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4 text-base text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
          {item}
        </li>
      ))}
    </ul>
  )
}
