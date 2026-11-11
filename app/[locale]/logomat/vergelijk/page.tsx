import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { MatComparisonTable } from '@/components/mat-comparison-table'
import { QuoteBand } from '@/components/quote-band'
import { localizedAlternates } from '@/lib/seo'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta.compare' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: localizedAlternates(locale, '/logomat/vergelijk'),
  }
}

export default function VergelijkLogomattenPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = useTranslations('Compare')
  const common = useTranslations('Common')

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

        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <MatComparisonTable />

            <div className="mt-12 text-center">
              <Link
                href="/logomat#configurator"
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
              >
                {common('startConfigurator')}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        <QuoteBand title={t('quoteTitle')} text={t('quoteText')} />
      </main>
      <SiteFooter />
    </>
  )
}
