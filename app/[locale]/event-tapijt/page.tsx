import type { Metadata } from 'next'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import {
  CheckCircle2,
  Sparkles,
  Zap,
  Repeat,
  Palette,
  PartyPopper,
  Heart,
  Gem,
  Type,
  CalendarHeart,
  type LucideIcon,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { QuoteBand } from '@/components/quote-band'
import { CustomRunnerHighlight } from '@/components/custom-runner-highlight'
import { localizedAlternates } from '@/lib/seo'

type Props = { params: { locale: string } }
type TitleText = { title: string; text: string }

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta.event' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: localizedAlternates(locale, '/event-tapijt'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: [{ url: '/images/red-carpet.png', width: 1200, height: 630, alt: t('ogImageAlt') }],
    },
  }
}

const FEATURE_ICONS = [Palette, Sparkles, Zap, Repeat]
const DETAIL_ICONS: Record<'wedding' | 'birthday' | 'party', LucideIcon[]> = {
  wedding: [Type, CalendarHeart, Heart],
  birthday: [PartyPopper, Type, Heart],
  party: [Gem, Sparkles, Heart],
}

export default function EventTapijtPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = useTranslations('Event')
  const features = t.raw('features') as TitleText[]
  const types = t.raw('types') as string[]

  const withIcons = (runner: 'wedding' | 'birthday' | 'party') =>
    (t.raw(`${runner}.details`) as TitleText[]).map((d, i) => ({ ...d, icon: DETAIL_ICONS[runner][i] ?? Heart }))

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow={t('eyebrow')}
          title={t('title')}
          intro={t('intro')}
          image="/images/red-carpet.png"
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

        <div className="pt-10" />

        <CustomRunnerHighlight
          eyebrow={t('wedding.eyebrow')}
          title={t('wedding.title')}
          description={t('wedding.description')}
          image="/images/trouwloper.webp"
          imageAlt={t('wedding.imageAlt')}
          details={withIcons('wedding')}
          taglineTitle={t('wedding.taglineTitle')}
          taglineSubtitle={t('wedding.taglineSubtitle')}
          priceExample={{ length: 10, width: 1, pricePerM2: 17.5, productSlug: 'trouwloper' }}
        />

        <CustomRunnerHighlight
          eyebrow={t('birthday.eyebrow')}
          title={t('birthday.title')}
          description={t('birthday.description')}
          image="/images/verjaardagsloper-op-maat.webp"
          imageAlt={t('birthday.imageAlt')}
          details={withIcons('birthday')}
          freeformNote={t('birthday.freeformNote')}
          taglineTitle={t('birthday.taglineTitle')}
          taglineSubtitle={t('birthday.taglineSubtitle')}
          imagePosition="right"
          priceExample={{ length: 5, width: 1, pricePerM2: 17.5, productSlug: 'verjaardagsloper' }}
        />

        <CustomRunnerHighlight
          eyebrow={t('party.eyebrow')}
          title={t('party.title')}
          description={t('party.description')}
          image="/images/feestloper.png"
          imageAlt={t('party.imageAlt')}
          details={withIcons('party')}
          freeformNote={t('party.freeformNote')}
          taglineTitle={t('party.taglineTitle')}
          taglineSubtitle={t('party.taglineSubtitle')}
          priceExample={{ length: 5, width: 1, pricePerM2: 17.5, productSlug: 'feestloper' }}
        />

        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance">{t('featuresTitle')}</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f, i) => {
                const Icon = FEATURE_ICONS[i] ?? Sparkles
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
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
            <Image
              src="/images/trade-fair.png"
              alt={t('typesImageAlt')}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance">{t('typesTitle')}</h2>
            <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
              {types.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <QuoteBand title={t('quoteTitle')} text={t('quoteText')} />
      </main>
      <SiteFooter />
    </>
  )
}
