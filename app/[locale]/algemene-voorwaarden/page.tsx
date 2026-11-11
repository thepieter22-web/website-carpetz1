import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LegalSidebar } from '@/components/legal-sidebar'
import { TermsAccordion } from '@/components/terms-accordion'
import { localizedAlternates } from '@/lib/seo'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta.terms' })
  return { title: t('title'), alternates: localizedAlternates(locale, '/algemene-voorwaarden') }
}

export default function AlgemeneVoorwaardenPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = useTranslations('Legal.terms')

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <h1 className="mb-2 font-serif text-4xl font-semibold">{t('title')}</h1>
            <p className="mb-8 text-muted-foreground">{t('intro')}</p>
            <TermsAccordion />
          </div>
          <LegalSidebar />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
