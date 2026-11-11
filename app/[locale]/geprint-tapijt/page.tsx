import type { Metadata } from 'next'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { CheckCircle2, Printer, Layers, Maximize, Image as ImageIcon } from 'lucide-react'
import { PrintedCarpetSimulator } from '@/components/printed-carpet-simulator'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { QuoteBand } from '@/components/quote-band'
import { localizedAlternates } from '@/lib/seo'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta.printedCarpet' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: localizedAlternates(locale, '/geprint-tapijt'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: [{ url: '/images/printed-carpet.png', width: 1200, height: 630, alt: t('ogImageAlt') }],
    },
  }
}

const FEATURE_ICONS = [Printer, Maximize, Layers, ImageIcon]

export default function GeprintTapijtPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = useTranslations('PrintedCarpet')
  const features = t.raw('features') as { title: string; text: string }[]
  const applications = t.raw('applications') as string[]

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow={t('eyebrow')}
          title={t('title')}
          intro={t('intro')}
          image="/images/printed-carpet.png"
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

        <div className="pt-10">
          <PrintedCarpetSimulator />
        </div>

        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance">{t('whyTitle')}</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f, i) => {
                const Icon = FEATURE_ICONS[i] ?? Printer
                return (
                  <div key={f.title} className="rounded-sm border border-border bg-card p-6">
                    <span className="inline-flex size-11 items-center justify-center rounded-sm bg-accent/15 text-accent">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-5 text-base font-semibold">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance">{t('applicationsTitle')}</h2>
            <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
              {applications.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
            <Image
              src="/images/trade-fair.png"
              alt={t('applicationsImageAlt')}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </section>

        <QuoteBand title={t('quoteTitle')} text={t('quoteText')} />
      </main>
      <SiteFooter />
    </>
  )
}
