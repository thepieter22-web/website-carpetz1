import type { Metadata } from 'next'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { ArrowDown, CheckCircle2 } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { QuoteBand } from '@/components/quote-band'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Faq } from '@/components/faq'
import { Cta } from '@/components/cta'
import { FireSafetyBadge } from '@/components/fire-safety-badge'
import { BlobPhoto } from '@/components/blob-photo'
import { ServiceJsonLd } from '@/components/service-jsonld'
import { PhotoGallery, type GalleryPhoto } from '@/components/photo-gallery'
import { CheckList, RelatedEventPages, StepsSection, type TitleText } from '@/components/event-sections'
import { pageMetadata } from '@/lib/seo'
import { ProductBar } from '@/components/product-bar'
import { cn } from '@/lib/utils'

type Props = { params: { locale: string } }

const PATH = '/event-tapijt/beurstapijt'
const HERO_IMAGE = '/images/beurstapijt-bosvloer-stand.webp'
/** Deelbeeld (1200 × 630) voor WhatsApp, LinkedIn, Facebook en X. */
const OG_IMAGE = '/images/beurstapijt-og.jpg'

/** Foto per stap, in dezelfde volgorde als EventStand.steps (alt-teksten staan daar). */
const STEP_IMAGES = [
  '/images/beurstapijt-stap-standplan-doorsturen.webp',
  '/images/beurstapijt-stap-ontwerp-scherm.webp',
  '/images/beurstapijt-stap-proefdruk.webp',
  '/images/beurstapijt-stap-levering.webp',
]

/** Drie doelgroepen, elk met een foto en een eigen sectie op deze pagina (ankers). */
const AUDIENCES: { key: 'exhibitors' | 'organizers' | 'builders'; anchor: string; image: string }[] = [
  { key: 'exhibitors', anchor: 'standhouders', image: '/images/beurstapijt-standhouder-wijnstand.webp' },
  { key: 'organizers', anchor: 'organisatoren', image: '/images/beurstapijt-organisator-gang.webp' },
  { key: 'builders', anchor: 'standbouwers', image: '/images/beurstapijt-standbouwer-rond-logo.webp' },
]

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta.eventStand' })
  return {
    title: t('title'),
    description: t('description'),
    ...pageMetadata(locale, PATH, {
      title: t('title'),
      description: t('description'),
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: t('ogImageAlt') }],
    }),
  }
}

/**
 * Sectie voor een doelgroep (organisatoren, standbouwers): tekst + lijst met vinkjes, en een foto in een golvende vorm.
 * Desktop: foto aan `imageSide` over de volle hoogte. Gsm: tekst, foto, lijst.
 * Met `boxTitle` staat de lijst in een kader met titel, anders gewoon onder de tekst.
 */
function AudienceSection({
  id,
  title,
  paragraphs,
  boxTitle,
  items,
  image,
  imageSide = 'left',
  className,
}: {
  id: string
  title: string
  paragraphs: string[]
  boxTitle?: string
  items: string[]
  image: { src: string; alt: string }
  imageSide?: 'left' | 'right'
  className?: string
}) {
  const textCol = imageSide === 'left' ? 'lg:col-start-2' : 'lg:col-start-1'
  const photoCol = imageSide === 'left' ? 'lg:col-start-1' : 'lg:col-start-2'

  return (
    <section id={id} className={cn('border-t border-border', className)}>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-8 lg:px-8 lg:py-20">
        <div className={cn(textCol, 'lg:row-start-1 lg:self-end')}>
          <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">{title}</h2>
          {paragraphs.map((p) => (
            <p key={p} className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
              {p}
            </p>
          ))}
        </div>
        <BlobPhoto
          src={image.src}
          alt={image.alt}
          mirrored={imageSide === 'left'}
          className={cn(photoCol, 'lg:row-span-2 lg:row-start-1 lg:self-center')}
        />
        <div className={cn(textCol, 'lg:row-start-2 lg:self-start')}>
          {boxTitle ? (
            <div className="rounded-sm border border-border bg-card p-6 sm:p-8">
              <h3 className="font-serif text-2xl font-semibold leading-tight">{boxTitle}</h3>
              <div className="mt-6">
                <CheckList items={items} />
              </div>
            </div>
          ) : (
            <CheckList items={items} />
          )}
        </div>
      </div>
    </section>
  )
}

export default function BeurstapijtPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = useTranslations('EventStand')
  const event = useTranslations('Event')
  const common = useTranslations('Common')
  const meta = useTranslations('Meta.eventStand')

  const faq = (['timing', 'size', 'install', 'fire', 'reuse', 'price'] as const).map((key) => ({
    q: t(`faq.${key}.q`),
    a: t(`faq.${key}.a`),
    media: key === 'fire' ? <FireSafetyBadge /> : undefined,
  }))

  return (
    <>
      <ServiceJsonLd
        path={PATH}
        name={meta('title')}
        serviceType={t('eyebrow')}
        description={meta('description')}
        image={HERO_IMAGE}
      />
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

        <ProductBar priceProduct="beurstapijt" />

        {/* Voor wie: springt naar de sectie van elke doelgroep */}
        <section>
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
              {t('audienceTitle')}
            </h2>
            <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {AUDIENCES.map(({ key, anchor, image }) => (
                <li key={key}>
                  <a
                    href={`#${anchor}`}
                    className="group flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card transition-colors hover:border-accent"
                  >
                    <div className="relative aspect-[3/2] overflow-hidden bg-muted">
                      <Image
                        src={image}
                        alt={t(`audiences.${key}.imageAlt`)}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-serif text-2xl font-semibold leading-tight">{t(`audiences.${key}.title`)}</h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {t(`audiences.${key}.text`)}
                      </p>
                      <span className="mt-5 inline-flex min-h-12 items-center gap-2 text-sm font-semibold uppercase tracking-widest text-foreground">
                        {t(`audiences.${key}.link`)}
                        <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Standhouders: tekst + foto van een realisatie */}
        <section id="standhouders" className="border-t border-border bg-secondary/40">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
            <div>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">{t('exhibitorsTitle')}</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">{t('exhibitorsText')}</p>
            </div>
            <BlobPhoto src={HERO_IMAGE} alt={t('heroImageAlt')} />
          </div>
        </section>

        <AudienceSection
          id="organisatoren"
          title={t('organizersTitle')}
          paragraphs={t.raw('organizersText') as string[]}
          boxTitle={t('organizersBoxTitle')}
          items={t.raw('organizersExamples') as string[]}
          image={{ src: '/images/beurstapijt-organisator-gang.webp', alt: t('audiences.organizers.imageAlt') }}
        />

        <AudienceSection
          id="standbouwers"
          title={t('buildersTitle')}
          paragraphs={t.raw('buildersText') as string[]}
          items={t.raw('buildersExamples') as string[]}
          image={{ src: '/images/beurstapijt-koffiebar-bladmotief.webp', alt: t('buildersImageAlt') }}
          imageSide="right"
          className="bg-secondary/40"
        />

        {/* Carpetz Pixel: de kwaliteit voor beurstapijt */}
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_auto] lg:gap-16 lg:px-8 lg:py-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('productEyebrow')}</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                {t('productTitle')}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/80 text-pretty">
                {t('productText')}
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(t.raw('productSpecs') as string[]).map((spec) => (
                  <li key={spec} className="flex items-center gap-3 text-base">
                    <CheckCircle2 className="size-5 shrink-0 text-accent" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
            <FireSafetyBadge id="fire-badge-product" className="size-32 sm:size-40" />
          </div>
        </section>

        <StepsSection
          title={t('stepsTitle')}
          steps={t.raw('steps') as (TitleText & { imageAlt: string })[]}
          images={STEP_IMAGES}
          reveal
        />

        <div className="mx-auto flex max-w-7xl justify-center px-4 pb-16 sm:px-6 lg:px-8">
          <Cta href="/contact?product=beurstapijt" variant="accent">
            {common('requestQuote')}
          </Cta>
        </div>

        <Faq title={t('faqTitle')} items={faq} />

        {/* Realisaties: foto's in messages/*.json onder EventStand.gallery.photos ({ src, alt }) */}
        <PhotoGallery
          title={t('gallery.title')}
          text={t('gallery.text')}
          photos={t.raw('gallery.photos') as GalleryPhoto[]}
        />

        <RelatedEventPages current="stand" />

        <QuoteBand title={t('quoteTitle')} text={t('quoteText')} quoteHref="/contact?product=beurstapijt" />
      </main>
      <SiteFooter />
    </>
  )
}
