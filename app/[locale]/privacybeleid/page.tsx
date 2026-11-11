import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { localizedAlternates } from '@/lib/seo'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta.privacy' })
  return { title: t('title'), alternates: localizedAlternates(locale, '/privacybeleid') }
}

export default function PrivacybeleidPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = useTranslations('Legal.privacy')

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-8 font-serif text-3xl font-semibold sm:text-4xl">{t('title')}</h1>
        <div className="prose prose-neutral max-w-none">
          {/* Plak hier de tekst, in beide talen via messages/nl.json en messages/fr.json (Legal.privacy). */}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
