import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { Crown, Layers, Sparkles } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { QuoteBand } from '@/components/quote-band'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Faq } from '@/components/faq'
import { Cta } from '@/components/cta'
import { CheckList, FeatureGrid, RelatedEventPages, StepsSection, type TitleText } from '@/components/event-sections'
import { localizedAlternates } from '@/lib/seo'
import { ProductBar } from '@/components/product-bar'

type Props = { params: { locale: string } }

const PATH = '/event-tapijt/eventvloer'
const HERO_IMAGE = '/images/geprint-tapijt.webp'

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta.eventFloor' })
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

export default function EventvloerPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = useTranslations('EventFloor')
  const event = useTranslations('Event')

  const faq = (['size', 'price', 'install', 'after'] as const).map((key) => ({
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

        <ProductBar priceProduct="eventvloer" />

        {/* Wat is een eventvloer + toepassingen */}
        <section>
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
            <div>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                {t('whatTitle')}
              </h2>
              {(t.raw('whatText') as string[]).map((p) => (
                <p key={p} className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
                  {p}
                </p>
              ))}
            </div>
            <div className="rounded-sm border border-border bg-card p-6 sm:p-8">
              <h2 className="font-serif text-2xl font-semibold leading-tight">{t('usesTitle')}</h2>
              <div className="mt-6">
                <CheckList items={t.raw('uses') as string[]} />
              </div>
            </div>
          </div>
        </section>

        <FeatureGrid
          title={t('qualitiesTitle')}
          text={t('qualitiesText')}
          items={t.raw('qualities') as TitleText[]}
          icons={[Crown, Layers, Sparkles]}
          className="bg-secondary/40"
        />

        <StepsSection title={t('stepsTitle')} steps={t.raw('steps') as TitleText[]} />

        {/* Prijsindicatie via de calculator op Geprint tapijt */}
        <section className="border-t border-border bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl font-semibold leading-tight text-balance">{t('calculatorTitle')}</h2>
              <p className="mt-3 text-base leading-relaxed text-primary-foreground/80 text-pretty">
                {t('calculatorText')}
              </p>
            </div>
            <Cta href={{ pathname: '/prijs-berekenen', query: { product: 'geprint-tapijt' } }} variant="accent">
              {t('calculatorLink')}
            </Cta>
          </div>
        </section>

        <Faq title={t('faqTitle')} items={faq} />

        <RelatedEventPages current="floor" />

        <QuoteBand title={t('quoteTitle')} text={t('quoteText')} quoteHref="/contact?product=eventvloer" />
      </main>
      <SiteFooter />
    </>
  )
}
