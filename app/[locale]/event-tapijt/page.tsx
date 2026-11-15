import type { Metadata } from 'next'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { ArrowRight, Briefcase, Heart, PartyPopper, type LucideIcon } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { QuoteBand } from '@/components/quote-band'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Faq } from '@/components/faq'
import { Cta } from '@/components/cta'
import { EventCards } from '@/components/event-sections'
import { Link } from '@/navigation'
import { localizedAlternates } from '@/lib/seo'
import { getLocalizedPath } from '@/routing'
import { usePriceFormatter } from '@/lib/format'
import { RUNNER_PRICE_PER_M2 } from '@/lib/event-pricing'

type Props = { params: { locale: string } }
type GalleryPhoto = { src: string; alt: string }

const PATH = '/event-tapijt'

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta.event' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: localizedAlternates(locale, PATH),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: [{ url: '/images/hero-event-carpet.webp', alt: t('ogImageAlt') }],
    },
  }
}

/** Gelegenheden → voorbeeldblok op de loperpagina (anker). */
const OCCASIONS: { key: 'wedding' | 'birthday' | 'corporate'; anchor: string; icon: LucideIcon }[] = [
  { key: 'wedding', anchor: 'huwelijk', icon: Heart },
  { key: 'birthday', anchor: 'verjaardag', icon: PartyPopper },
  { key: 'corporate', anchor: 'bedrijfsevent', icon: Briefcase },
]
// TODO: eigen pagina's per gelegenheid (huwelijk, verjaardag & feest, bedrijfsevent)
// zodra er genoeg eigen inhoud en foto's zijn. Tot dan linken ze naar de voorbeelden op de loperpagina.

export default function EventTapijtPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = useTranslations('Event')
  const price = usePriceFormatter()
  // Foto's van echte events: toevoegen in messages/*.json onder Event.gallery.photos ({ src, alt }).
  const photos = t.raw('gallery.photos') as GalleryPhoto[]

  const faq = (['delivery', 'material', 'reuse', 'price'] as const).map((key) => ({
    q: t(`faq.${key}.q`),
    a: t(`faq.${key}.a`, {
      perM2: price(RUNNER_PRICE_PER_M2),
      example: price(RUNNER_PRICE_PER_M2 * 5),
    }),
  }))

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow={t('eyebrow')}
          title={t('title')}
          intro={t('intro')}
          image="/images/hero-event-carpet.webp"
          imageAlt={t('heroImageAlt')}
          breadcrumbs={<Breadcrumbs items={[{ label: t('breadcrumb') }]} currentPath={PATH} />}
        />

        {/* Drie soorten event tapijt */}
        <section>
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                  {t('cardsTitle')}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">{t('cardsText')}</p>
              </div>
              <Cta href="/contact?product=event-tapijt" variant="accent" className="self-start lg:self-auto">
                {t('quoteTitle')}
              </Cta>
            </div>
            <div className="mt-10">
              <EventCards />
            </div>
          </div>
        </section>

        {/* Voor elke gelegenheid */}
        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
              {t('occasionsTitle')}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">
              {t('occasionsText')}
            </p>
            <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {OCCASIONS.map(({ key, anchor, icon: Icon }) => (
                <li key={key} className="flex flex-col rounded-sm border border-border bg-card p-6">
                  <span className="inline-flex size-11 items-center justify-center rounded-sm bg-accent/15 text-accent">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{t(`occasions.${key}.title`)}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {t(`occasions.${key}.text`)}
                  </p>
                  <Link
                    // Ankerlinks zelf vertalen: next-intl herkent een pad met # niet.
                    href={`${getLocalizedPath(locale, '/event-tapijt/loper')}#${anchor}`}
                    className="group mt-4 inline-flex min-h-12 items-center gap-2 text-sm font-semibold uppercase tracking-widest text-foreground"
                  >
                    {t('occasionLink')}
                    <span className="sr-only">: {t(`occasions.${key}.title`)}</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Fotogalerij: verschijnt zodra er foto's zijn */}
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
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <Faq title={t('faqTitle')} items={faq} />

        {/* Iets blijvends nodig? */}
        <section className="border-t border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                {t('permanent.title')}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-primary-foreground/80 text-pretty">
                {t('permanent.text')}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Cta href="/geprint-tapijt" variant="accent">
                  {t('permanent.printedLink')}
                </Cta>
                <Cta href="/logomat#configurator" variant="outlineLight">
                  {t('permanent.logomatLink')}
                </Cta>
              </div>
            </div>
          </div>
        </section>

        <QuoteBand title={t('quoteTitle')} text={t('quoteText')} quoteHref="/contact?product=event-tapijt" />
      </main>
      <SiteFooter />
    </>
  )
}
