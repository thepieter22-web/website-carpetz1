import type { Metadata } from 'next'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import {
  ArrowDown,
  CheckCircle2,
  Eye,
  Flame,
  Hammer,
  Landmark,
  Palette,
  Repeat,
  Ruler,
  Store,
  type LucideIcon,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { QuoteBand } from '@/components/quote-band'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Faq } from '@/components/faq'
import { Cta } from '@/components/cta'
import { FireSafetyBadge } from '@/components/fire-safety-badge'
import { CheckList, FeatureGrid, RelatedEventPages, StepsSection, type TitleText } from '@/components/event-sections'
import { localizedAlternates } from '@/lib/seo'
import { ProductBar } from '@/components/product-bar'
import { cn } from '@/lib/utils'

type Props = { params: { locale: string } }

const PATH = '/event-tapijt/beurstapijt'
const HERO_IMAGE = '/images/beurstapijt-bosvloer-stand.webp'

/** Drie doelgroepen, elk met een eigen sectie op deze pagina (ankers). */
const AUDIENCES: { key: 'exhibitors' | 'organizers' | 'builders'; anchor: string; icon: LucideIcon }[] = [
  { key: 'exhibitors', anchor: 'standhouders', icon: Store },
  { key: 'organizers', anchor: 'organisatoren', icon: Landmark },
  { key: 'builders', anchor: 'standbouwers', icon: Hammer },
]

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta.eventStand' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: localizedAlternates(locale, PATH),
    openGraph: {
      title: t('title'),
      description: t('description'),
      images: [{ url: HERO_IMAGE, alt: t('ogImageAlt') }],
    },
  }
}

/** Sectie met tekst links en een kader met vinkjes rechts (organisatoren, standbouwers). */
function AudienceSection({
  id,
  title,
  paragraphs,
  boxTitle,
  items,
  className,
}: {
  id: string
  title: string
  paragraphs: string[]
  boxTitle: string
  items: string[]
  className?: string
}) {
  return (
    <section id={id} className={cn('border-t border-border', className)}>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
        <div>
          <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">{title}</h2>
          {paragraphs.map((p) => (
            <p key={p} className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
              {p}
            </p>
          ))}
        </div>
        <div className="rounded-sm border border-border bg-card p-6 sm:p-8">
          <h3 className="font-serif text-2xl font-semibold leading-tight">{boxTitle}</h3>
          <div className="mt-6">
            <CheckList items={items} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function BeurstapijtPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = useTranslations('EventStand')
  const event = useTranslations('Event')
  const common = useTranslations('Common')

  const faq = (['timing', 'size', 'install', 'fire', 'reuse', 'price'] as const).map((key) => ({
    q: t(`faq.${key}.q`),
    a: t(`faq.${key}.a`),
    media: key === 'fire' ? <FireSafetyBadge /> : undefined,
  }))

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow={t('eyebrow')}
          title={t('title')}
          intro={t('intro')}
          image={HERO_IMAGE}
          imageAlt={t('heroImageAlt')}
          breadcrumbs={
            <Breadcrumbs
              items={[{ label: event('breadcrumb'), href: '/event-tapijt' }, { label: t('breadcrumb') }]}
              currentPath={PATH}
            />
          }
        />

        <ProductBar priceProduct="beurstapijt" />

        {/* Voor wie: springt naar de sectie van elke doelgroep */}
        <section>
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
              {t('audienceTitle')}
            </h2>
            <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {AUDIENCES.map(({ key, anchor, icon: Icon }) => (
                <li key={key}>
                  <a
                    href={`#${anchor}`}
                    className="group flex h-full flex-col rounded-sm border border-border bg-card p-6 transition-colors hover:border-accent"
                  >
                    <span className="inline-flex size-11 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-5 font-serif text-2xl font-semibold leading-tight">{t(`audiences.${key}.title`)}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {t(`audiences.${key}.text`)}
                    </p>
                    <span className="mt-5 inline-flex min-h-12 items-center gap-2 text-sm font-semibold uppercase tracking-widest text-foreground">
                      {t(`audiences.${key}.link`)}
                      <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Standhouders: tekst + foto van een realisatie, daaronder de voordelen */}
        <section id="standhouders" className="border-t border-border bg-secondary/40">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pt-16 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:pt-20">
            <div>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">{t('exhibitorsTitle')}</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">{t('exhibitorsText')}</p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-border">
              <Image
                src={HERO_IMAGE}
                alt={t('heroImageAlt')}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <FeatureGrid
          title={t('whyTitle')}
          items={t.raw('why') as TitleText[]}
          icons={[Eye, Palette, Ruler, Repeat]}
          className="border-t-0 bg-secondary/40"
        />

        <AudienceSection
          id="organisatoren"
          title={t('organizersTitle')}
          paragraphs={t.raw('organizersText') as string[]}
          boxTitle={t('organizersBoxTitle')}
          items={t.raw('organizersExamples') as string[]}
        />

        <AudienceSection
          id="standbouwers"
          title={t('buildersTitle')}
          paragraphs={t.raw('buildersText') as string[]}
          boxTitle={t('buildersBoxTitle')}
          items={t.raw('buildersExamples') as string[]}
          className="bg-secondary/40"
        />

        {/* Carpetz Pixel: de kwaliteit voor beurstapijt */}
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_auto] lg:gap-16 lg:px-8 lg:py-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('productEyebrow')}</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                {t('productTitle')}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/80 text-pretty">
                {t('productText')}
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(t.raw('productSpecs') as string[]).map((spec) => (
                  <li key={spec} className="flex items-center gap-3 text-base">
                    <CheckCircle2 className="size-5 shrink-0 text-accent" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
            <FireSafetyBadge id="fire-badge-product" className="size-32 sm:size-40" />
          </div>
        </section>

        {/* Afmetingen + brandveiligheid */}
        <section className="border-t border-border">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
            <div className="rounded-sm border border-border bg-card p-6 sm:p-8">
              <span className="inline-flex size-11 items-center justify-center rounded-sm bg-accent/15 text-accent">
                <Ruler className="size-5" />
              </span>
              <h2 className="mt-5 font-serif text-2xl font-semibold leading-tight sm:text-3xl">{t('sizeTitle')}</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">{t('sizeText')}</p>
            </div>
            <div className="rounded-sm border border-border bg-card p-6 sm:p-8">
              <span className="inline-flex size-11 items-center justify-center rounded-sm bg-accent/15 text-accent">
                <Flame className="size-5" />
              </span>
              <h2 className="mt-5 font-serif text-2xl font-semibold leading-tight sm:text-3xl">{t('fireTitle')}</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">{t('fireText')}</p>
            </div>
          </div>
        </section>

        <StepsSection title={t('stepsTitle')} steps={t.raw('steps') as TitleText[]} />

        <div className="mx-auto flex max-w-7xl justify-center px-4 pb-16 sm:px-6 lg:px-8">
          <Cta href="/contact?product=beurstapijt" variant="accent">
            {common('requestQuote')}
          </Cta>
        </div>

        <Faq title={t('faqTitle')} items={faq} />

        <RelatedEventPages current="stand" />

        <QuoteBand title={t('quoteTitle')} text={t('quoteText')} quoteHref="/contact?product=beurstapijt" />
      </main>
      <SiteFooter />
    </>
  )
}
