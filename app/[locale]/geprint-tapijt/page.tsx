import type { Metadata } from 'next'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { CalendarHeart, DoorOpen, Layers, Ruler, Scissors, Shapes } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { QuoteBand } from '@/components/quote-band'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Faq } from '@/components/faq'
import { Cta } from '@/components/cta'
import { AmbientVideo } from '@/components/ambient-video'
import { ProductBar } from '@/components/product-bar'
import { FeatureGrid, StepsSection, type TitleText } from '@/components/event-sections'
import { PRINTED_HERO_IMAGE, SectorCards } from '@/components/printed-sector'
import { localizedAlternates } from '@/lib/seo'

type Props = { params: { locale: string } }
type GalleryPhoto = { src: string; alt: string }

const PATH = '/geprint-tapijt'

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta.printedCarpet' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: localizedAlternates(locale, PATH),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: [{ url: PRINTED_HERO_IMAGE, alt: t('ogImageAlt') }],
    },
  }
}

export default function GeprintTapijtPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = useTranslations('PrintedCarpet')
  // Realisaties: foto's toevoegen in messages/*.json onder PrintedCarpet.gallery.photos ({ src, alt }).
  const photos = t.raw('gallery.photos') as GalleryPhoto[]

  const faq = (['care', 'durability', 'fire', 'delivery', 'sizes'] as const).map((key) => ({
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
          image={PRINTED_HERO_IMAGE}
          imageAlt={t('heroImageAlt')}
          breadcrumbs={<Breadcrumbs items={[{ label: t('breadcrumb') }]} currentPath={PATH} />}
        />

        <ProductBar scope="printed" priceProduct="geprint-tapijt" />

        {/* Je eigen ontwerp, blijvend */}
        <section>
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
            <div>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                {t('aboutTitle')}
              </h2>
              {(t.raw('aboutText') as string[]).map((p) => (
                <p key={p} className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
                  {p}
                </p>
              ))}
              <div className="mt-8">
                <Cta href="/contact?product=geprint-tapijt" variant="accent">
                  {t('quoteButton')}
                </Cta>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <AmbientVideo
                src="/videos/geprint-tapijt"
                poster={PRINTED_HERO_IMAGE}
                alt={t('videoAlt')}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        <FeatureGrid
          title={t('choicesTitle')}
          text={t('choicesText')}
          items={t.raw('choices') as TitleText[]}
          icons={[Ruler, Shapes, Layers, Scissors]}
          className="bg-secondary/40"
        />

        {/* Voor elke ruimte */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
              {t('spacesTitle')}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">
              {t('spacesText')}
            </p>
            <div className="mt-10">
              <SectorCards />
            </div>
          </div>
        </section>

        {/* Realisaties: verschijnt zodra er foto's zijn */}
        {photos.length > 0 && (
          <section className="border-t border-border">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
              <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                {t('gallery.title')}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{t('gallery.text')}</p>
              <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                {photos.map((photo) => (
                  <li key={photo.src} className="relative aspect-[4/3] overflow-hidden rounded-sm bg-muted">
                    <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover" />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <StepsSection title={t('stepsTitle')} steps={t.raw('steps') as TitleText[]} className="bg-secondary/40" />

        <Faq title={t('faqTitle')} items={faq} />

        {/* Doorverwijzen: tijdelijk of aan de deur */}
        <section className="border-t border-border bg-primary text-primary-foreground">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
            {(
              [
                { key: 'event', href: '/event-tapijt', icon: CalendarHeart },
                { key: 'logomat', href: '/logomat#configurator', icon: DoorOpen },
              ] as const
            ).map(({ key, href, icon: Icon }) => (
              <div key={key} className="flex flex-col rounded-sm border border-primary-foreground/15 p-6 sm:p-8">
                <Icon className="size-6 text-accent" />
                <h2 className="mt-4 font-serif text-2xl font-semibold leading-tight sm:text-3xl">{t(`elsewhere.${key}.title`)}</h2>
                <p className="mt-3 flex-1 text-base leading-relaxed text-primary-foreground/80 text-pretty">
                  {t(`elsewhere.${key}.text`)}
                </p>
                <div className="mt-6">
                  <Cta href={href} variant="outlineLight">
                    {t(`elsewhere.${key}.link`)}
                  </Cta>
                </div>
              </div>
            ))}
          </div>
        </section>

        <QuoteBand title={t('quoteTitle')} text={t('quoteText')} quoteHref="/contact?product=geprint-tapijt" />
      </main>
      <SiteFooter />
    </>
  )
}
