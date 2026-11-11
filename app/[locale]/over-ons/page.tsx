import type { Metadata } from 'next'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { Target, Handshake, Leaf, Award } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { QuoteBand } from '@/components/quote-band'
import { localizedAlternates } from '@/lib/seo'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta.about' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: localizedAlternates(locale, '/over-ons'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: [{ url: '/images/craftsmanship.png', width: 1200, height: 630, alt: t('ogImageAlt') }],
    },
  }
}

const VALUE_ICONS = [Target, Handshake, Award, Leaf]

export default function OverOnsPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = useTranslations('About')
  const values = t.raw('values') as { title: string; text: string }[]

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow={t('eyebrow')}
          title={t('title')}
          intro={t('intro')}
          image="/images/craftsmanship.png"
          imageAlt={t('heroImageAlt')}
        />

        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance">{t('storyTitle')}</h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">{t('story1')}</p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">{t('story2')}</p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
            <Image
              src="/images/hotel-lobby.png"
              alt={t('storyImageAlt')}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </section>

        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance">{t('valuesTitle')}</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v, i) => {
                const Icon = VALUE_ICONS[i] ?? Award
                return (
                  <div key={v.title} className="rounded-sm border border-border bg-card p-6">
                    <span className="inline-flex size-11 items-center justify-center rounded-sm bg-accent/15 text-accent">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-5 text-base font-semibold">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <QuoteBand title={t('quoteTitle')} text={t('quoteText')} />
      </main>
      <SiteFooter />
    </>
  )
}
