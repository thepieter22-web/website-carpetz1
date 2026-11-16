import type { Metadata } from 'next'
import { Suspense } from 'react'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { Layers, Ruler, Shapes } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { QuoteBand } from '@/components/quote-band'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Faq } from '@/components/faq'
import { FeatureGrid } from '@/components/event-sections'
import { PriceTool } from '@/components/price-tool'
import { localizedAlternates } from '@/lib/seo'

type Props = { params: { locale: string } }

const PATH = '/prijs-berekenen'

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta.priceTool' })
  return {
    title: t('title'),
    description: t('description'),
    // Canonical zonder ?product=…: alle varianten tellen als één pagina.
    alternates: localizedAlternates(locale, PATH),
    openGraph: { title: t('title'), description: t('description') },
  }
}

export default function PrijsBerekenenPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = useTranslations('PriceTool')
  const factors = (['size', 'quality', 'shape'] as const).map((key) => ({
    title: t(`factors.${key}.title`),
    text: t(`factors.${key}.text`),
  }))

  const faq = (['final', 'vat', 'shipping', 'logomat', 'quote'] as const).map((key) => ({
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
          image="/images/geprint-tapijt.webp"
          imageAlt={t('heroImageAlt')}
          breadcrumbs={<Breadcrumbs items={[{ label: t('breadcrumb') }]} currentPath={PATH} />}
        />

        <section className="bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            {/* Suspense nodig omdat de calculator ?product=… uit de URL leest. */}
            <Suspense fallback={<div className="min-h-[60vh] animate-pulse rounded-sm bg-muted/40" aria-hidden="true" />}>
              <PriceTool />
            </Suspense>
          </div>
        </section>

        <FeatureGrid title={t('factorsTitle')} items={factors} icons={[Ruler, Layers, Shapes]} />

        <Faq title={t('faqTitle')} items={faq} />

        <QuoteBand />
      </main>
      <SiteFooter />
    </>
  )
}
