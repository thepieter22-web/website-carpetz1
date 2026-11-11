import type { Metadata } from 'next'
import { Suspense } from 'react'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { Link } from '@/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { QuoteBand } from '@/components/quote-band'
import { MatConfigurator } from '@/components/mat-configurator'
import { localizedAlternates } from '@/lib/seo'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta.logomat' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: localizedAlternates(locale, '/logomat'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: [{ url: '/images/logomat-winkel-entree.webp', width: 1200, height: 630, alt: t('ogImageAlt') }],
    },
  }
}

export default function LogomatPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = useTranslations('Logomat')

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow={t('eyebrow')}
          title={t('title')}
          intro={t('intro')}
          image="/images/logomat-winkel-entree.webp"
          imageAlt={t('heroImageAlt')}
        />

        <section className="relative px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="relative z-10 ml-auto -mt-24 max-w-2xl rounded-sm border-l-4 border-accent bg-card px-8 py-7 shadow-xl lg:-mt-28 lg:px-10 lg:py-8">
              <h2 className="font-serif text-2xl font-semibold leading-tight text-balance sm:text-3xl">
                {t('calloutTitle')}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">{t('calloutText')}</p>
            </div>
          </div>
        </section>

        <section id="configurator" className="scroll-mt-24 border-t border-border bg-white">
          <div className="mx-auto max-w-7xl px-6 pt-6 lg:px-8">
            <div className="flex justify-end">
              <Link
                href="/logomat/vergelijk"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-accent hover:underline"
              >
                {t('compareLink')}
              </Link>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-6 pb-8 lg:px-8">
            {/* Suspense nodig omdat de configurator ?type=… uit de URL leest. */}
            <Suspense fallback={<div className="min-h-[70vh] animate-pulse rounded-xl bg-muted/40" aria-hidden="true" />}>
              <MatConfigurator />
            </Suspense>
          </div>
        </section>

        <QuoteBand title={t('quoteTitle')} text={t('quoteText')} />
      </main>
      <SiteFooter />
    </>
  )
}
