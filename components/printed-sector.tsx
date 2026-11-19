import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import {
  ArrowRight,
  Building2,
  Hotel,
  Palette,
  Ruler,
  ShieldCheck,
  Sparkles,
  Store,
  type LucideIcon,
} from 'lucide-react'
import { Link } from '@/navigation'
import { PageHero } from '@/components/page-hero'
import { QuoteBand } from '@/components/quote-band'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Faq, type FaqItem } from '@/components/faq'
import { ProductBar } from '@/components/product-bar'
import { CheckList, FeatureGrid, type TitleText } from '@/components/event-sections'
import { pageMetadata } from '@/lib/seo'
import { cn } from '@/lib/utils'

/** Sectorpagina's onder /geprint-tapijt. TODO: "thuis" (vloerkleed met foto) zodra er eigen inhoud en foto's zijn. */
export const PRINTED_SECTORS = [
  { key: 'shop', href: '/geprint-tapijt/winkel', icon: Store },
  { key: 'office', href: '/geprint-tapijt/kantoor', icon: Building2 },
  { key: 'horeca', href: '/geprint-tapijt/horeca', icon: Hotel },
] as const

export type PrintedSectorKey = (typeof PRINTED_SECTORS)[number]['key']

export const PRINTED_HERO_IMAGE = '/images/geprint-tapijt.webp'

const META_NAMESPACES = {
  shop: 'Meta.printedShop',
  office: 'Meta.printedOffice',
  horeca: 'Meta.printedHoreca',
} as const

export async function printedSectorMetadata(locale: string, sector: PrintedSectorKey): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: META_NAMESPACES[sector] })
  const page = PRINTED_SECTORS.find((s) => s.key === sector)!
  return {
    title: t('title'),
    description: t('description'),
    ...pageMetadata(locale, page.href, { title: t('title'), description: t('description'), images: [{ url: PRINTED_HERO_IMAGE, alt: t('ogImageAlt') }] }),
  }
}

/** Kaarten naar de sectorpagina's ("Voor elke ruimte" en "Andere ruimtes"). */
export function SectorCards({ exclude }: { exclude?: PrintedSectorKey }) {
  const t = useTranslations('PrintedCarpet')
  const sectors = PRINTED_SECTORS.filter((s) => s.key !== exclude)
  return (
    <ul className={cn('grid grid-cols-1 gap-6', sectors.length === 3 ? 'md:grid-cols-3' : 'sm:grid-cols-2')}>
      {sectors.map(({ key, href, icon: Icon }) => (
        <li key={key}>
          <Link
            href={href}
            className="group flex h-full flex-col rounded-sm border border-border bg-card p-6 transition-colors hover:border-accent"
          >
            <span className="inline-flex size-11 items-center justify-center rounded-sm bg-primary text-primary-foreground">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-5 font-serif text-2xl font-semibold leading-tight">{t(`spaces.${key}.title`)}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{t(`spaces.${key}.text`)}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-foreground">
              {t(`spaces.${key}.link`)}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

const BENEFIT_ICONS: LucideIcon[] = [Palette, Sparkles, Ruler, ShieldCheck]

/** Volledige sectorpagina; alle teksten staan in messages onder PrintedSector.<sector>. */
export function PrintedSectorPage({ sector }: { sector: PrintedSectorKey }) {
  const t = useTranslations(`PrintedSector.${sector}`)
  const printed = useTranslations('PrintedCarpet')
  const page = PRINTED_SECTORS.find((s) => s.key === sector)!

  return (
    <main>
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        intro={t('intro')}
        image={PRINTED_HERO_IMAGE}
        imageAlt={t('heroImageAlt')}
        breadcrumbs={
          <Breadcrumbs
            items={[{ label: printed('breadcrumb'), href: '/geprint-tapijt' }, { label: t('breadcrumb') }]}
            currentPath={page.href}
          />
        }
      />

      <ProductBar priceProduct="geprint-tapijt" />

      {/* Invalshoek + voorbeelden */}
      <section>
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">{t('introTitle')}</h2>
            {(t.raw('introText') as string[]).map((p) => (
              <p key={p} className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
                {p}
              </p>
            ))}
          </div>
          <div className="rounded-sm border border-border bg-card p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-semibold leading-tight">{t('examplesTitle')}</h2>
            <div className="mt-6">
              <CheckList items={t.raw('examples') as string[]} />
            </div>
          </div>
        </div>
      </section>

      <FeatureGrid
        title={t('benefitsTitle')}
        items={t.raw('benefits') as TitleText[]}
        icons={BENEFIT_ICONS}
        className="bg-secondary/40"
      />

      {/* Sectorspecifiek aandachtspunt */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">{t('focusTitle')}</h2>
          {(t.raw('focusText') as string[]).map((p) => (
            <p key={p} className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
              {p}
            </p>
          ))}
        </div>
      </section>

      <Faq title={t('faqTitle')} items={t.raw('faq') as FaqItem[]} />

      {/* Andere ruimtes + terug naar het overzicht */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
              {printed('otherSpacesTitle')}
            </h2>
            <Link
              href="/geprint-tapijt"
              className="group inline-flex min-h-12 items-center gap-2 text-sm font-semibold uppercase tracking-widest text-foreground"
            >
              {printed('backToOverview')}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-10">
            <SectorCards exclude={sector} />
          </div>
        </div>
      </section>

      <QuoteBand title={t('quoteTitle')} text={t('quoteText')} quoteHref="/contact?product=geprint-tapijt" />
    </main>
  )
}
