import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { localizedAlternates } from '@/lib/seo'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta.returns' })
  return { title: t('title'), alternates: localizedAlternates(locale, '/retourbeleid') }
}

export default function RetourbeleidPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = useTranslations('Legal.returns')

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-8 font-serif text-4xl font-semibold">{t('title')}</h1>
        <div className="prose prose-neutral max-w-none">
          {/* Plak hier de tekst, in beide talen via messages/nl.json en messages/fr.json (Legal.returns). */}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
