import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { Eye, Flame, Palette, Repeat, Ruler } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { QuoteBand } from '@/components/quote-band'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Faq } from '@/components/faq'
import { Cta } from '@/components/cta'
import { FeatureGrid, RelatedEventPages, StepsSection, type TitleText } from '@/components/event-sections'
import { localizedAlternates } from '@/lib/seo'

type Props = { params: { locale: string } }

const PATH = '/event-tapijt/beurstapijt'
const HERO_IMAGE = '/images/event-tapijt-zonder-achtergrond.webp'

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

export default function BeurstapijtPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = useTranslations('EventStand')
  const event = useTranslations('Event')
  const common = useTranslations('Common')

  const faq = (['timing', 'reuse', 'price'] as const).map((key) => ({
    q: t(`faq.${key}.q`),
    a: t(`faq.${key}.a`),
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

        <FeatureGrid title={t('whyTitle')} items={t.raw('why') as TitleText[]} icons={[Eye, Palette, Ruler, Repeat]} />

        {/* Afmetingen + brandveiligheid */}
        <section className="border-t border-border bg-secondary/40">
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
