import type { Metadata } from 'next'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import {
  Briefcase,
  CalendarHeart,
  Gem,
  Heart,
  Palette,
  PartyPopper,
  Repeat,
  Sparkles,
  Type,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { QuoteBand } from '@/components/quote-band'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Faq } from '@/components/faq'
import { CustomRunnerHighlight } from '@/components/custom-runner-highlight'
import { OccasionTabs } from '@/components/occasion-tabs'
import { PhotoGallery, type GalleryPhoto } from '@/components/photo-gallery'
import { CheckList, FeatureGrid, RelatedEventPages, StepsSection, type TitleText } from '@/components/event-sections'
import { localizedAlternates } from '@/lib/seo'
import { ProductBar } from '@/components/product-bar'
import { usePriceFormatter } from '@/lib/format'
import { RUNNER_PRICE_PER_M2 } from '@/lib/event-pricing'

type Props = { params: { locale: string } }

const PATH = '/event-tapijt/loper'
const HERO_IMAGE = '/images/feestloper-op-maat.webp'

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta.eventRunner' })
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

const FEATURE_ICONS = [Palette, Sparkles, Zap, Repeat]
const DETAIL_ICONS: Record<'wedding' | 'birthday' | 'party', LucideIcon[]> = {
  wedding: [Type, CalendarHeart, Heart],
  birthday: [PartyPopper, Type, Heart],
  party: [Gem, Sparkles, Heart],
}

export default function EventLoperPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = useTranslations('EventRunner')
  const event = useTranslations('Event')
  const price = usePriceFormatter()

  const withIcons = (runner: 'wedding' | 'birthday' | 'party') =>
    (t.raw(`${runner}.details`) as TitleText[]).map((d, i) => ({ ...d, icon: DETAIL_ICONS[runner][i] ?? Heart }))

  const faq = (['color', 'size', 'price'] as const).map((key) => ({
    q: t(`faq.${key}.q`),
    a: t(`faq.${key}.a`, { perM2: price(RUNNER_PRICE_PER_M2), example: price(RUNNER_PRICE_PER_M2 * 10) }),
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

        <ProductBar priceProduct="loper" />

        {/* Intro + wat kan erop (links), sfeerfoto (rechts) */}
        <section>
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
            <div className="flex flex-col">
              <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                {t('introTitle')}
              </h2>
              {(t.raw('introText') as string[]).map((p) => (
                <p key={p} className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
                  {p}
                </p>
              ))}
              <div className="mt-10 rounded-sm border border-border bg-card p-6 sm:p-8">
                <h3 className="font-serif text-2xl font-semibold leading-tight">{t('personalTitle')}</h3>
                <div className="mt-6">
                  <CheckList items={t.raw('personal') as string[]} />
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-border sm:aspect-[4/3] lg:aspect-auto lg:min-h-full">
              <Image
                src="/images/rode-loper-art-deco-paaltjes.webp"
                alt={t('introImageAlt')}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </section>

        {/* Voorbeelden per gelegenheid als tabbladen (ankers vanaf de overzichtspagina openen het juiste tabblad) */}
        <section className="border-t border-border pt-16 lg:pt-20">
          <h2 className="mx-auto max-w-7xl px-4 font-serif text-3xl font-semibold leading-tight text-balance sm:px-6 sm:text-4xl lg:px-8">
            {t('occasionsTitle')}
          </h2>
          <div className="pt-8" />
          <OccasionTabs
            tabs={[
              {
                id: 'huwelijk',
                label: event('occasions.wedding.title'),
                icon: <Heart className="size-4" />,
                content: (
                  <CustomRunnerHighlight
                    eyebrow={t('wedding.eyebrow')}
                    title={t('wedding.title')}
                    description={t('wedding.description')}
                    image="/images/trouwloper.webp"
                    imageAlt={t('wedding.imageAlt')}
                    details={withIcons('wedding')}
                    taglineTitle={t('wedding.taglineTitle')}
                    taglineSubtitle={t('wedding.taglineSubtitle')}
                    priceExample={{ length: 10, width: 1, pricePerM2: RUNNER_PRICE_PER_M2, productSlug: 'trouwloper' }}
                  />
                ),
              },
              {
                id: 'verjaardag',
                label: event('occasions.birthday.title'),
                icon: <PartyPopper className="size-4" />,
                content: (
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
                    priceExample={{ length: 5, width: 1, pricePerM2: RUNNER_PRICE_PER_M2, productSlug: 'verjaardagsloper' }}
                  />
                ),
              },
              {
                id: 'bedrijfsevent',
                label: event('occasions.corporate.title'),
                icon: <Briefcase className="size-4" />,
                content: (
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
                    priceExample={{ length: 5, width: 1, pricePerM2: RUNNER_PRICE_PER_M2, productSlug: 'feestloper' }}
                  />
                ),
              },
            ]}
          />
        </section>

        <FeatureGrid
          title={t('featuresTitle')}
          items={t.raw('features') as TitleText[]}
          icons={FEATURE_ICONS}
          className="bg-secondary/40"
        />

        {/* Afmetingen */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
              {t('sizesTitle')}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">{t('sizesText')}</p>
          </div>
        </section>

        <StepsSection title={t('stepsTitle')} steps={t.raw('steps') as TitleText[]} className="bg-secondary/40" />

        <Faq title={t('faqTitle')} items={faq} />

        <PhotoGallery
          title={t('gallery.title')}
          text={t('gallery.text')}
          photos={t.raw('gallery.photos') as GalleryPhoto[]}
        />

        <RelatedEventPages current="runner" />

        <QuoteBand title={t('quoteTitle')} text={t('quoteText')} quoteHref="/contact?product=loper" />
      </main>
      <SiteFooter />
    </>
  )
}
