import { LogomatGuarantees } from '@/components/logomat-guarantees'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { unstable_setRequestLocale } from 'next-intl/server'
import {
  Palette,
  Ruler,
  Truck,
  Recycle,
  ShieldCheck,
  Building2,
  Hotel,
  Store,
  Presentation,
  PartyPopper,
  Briefcase,
  ArrowRight,
} from 'lucide-react'
import { Link } from '@/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Hero } from '@/components/hero'
import { UspTicker } from '@/components/UspTicker'
import { QuoteBand } from '@/components/quote-band'
import { Cta } from '@/components/cta'
import { LocalBusinessJsonLd } from '@/components/local-business-jsonld'
import { AmbientVideo } from '@/components/ambient-video'

type TitleText = { title: string; text: string }

const USP_ICONS = [Palette, Ruler, Truck, Recycle]
const APPLICATION_ICONS = [Store, Hotel, Presentation, PartyPopper, Building2, Briefcase]

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale)
  const t = useTranslations('Home')
  const common = useTranslations('Common')

  const usps = t.raw('why.usps') as TitleText[]
  const applications = t.raw('applications.items') as TitleText[]

  return (
    <>
      <LocalBusinessJsonLd />
      <SiteHeader />
      <main>
        <Hero />
        <UspTicker />

        {/* Logomatten op maat */}
        <section id="logomatten" className="border-t border-border bg-secondary/40">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src="/images/logomat-winkel-entree.webp"
                alt={t('logomats.imageAlt')}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">{t('logomats.eyebrow')}</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                {t('logomats.title')}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">{t('logomats.text')}</p>
              <h3 className="mt-6 text-lg font-semibold">{t('logomats.whyTitle')}</h3>
              <LogomatGuarantees />
              <div className="mt-6">
                <Link
                  href="/logomat"
                  className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-foreground"
                >
                  {t('logomats.link')}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Geprint tapijt */}
        <section id="geprint-tapijt" className="border-t border-border">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
            <div className="order-2 lg:order-1">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">{t('printed.eyebrow')}</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                {t('printed.title')}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">{t('printed.text')}</p>
              <h3 className="mt-6 text-lg font-semibold">{t('printed.applicationsTitle')}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
                {t('printed.applicationsText')}
              </p>
              <div className="mt-8">
                <Link
                  href="/geprint-tapijt"
                  className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-foreground"
                >
                  {t('printed.link')}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
            <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-sm lg:order-2">
              <AmbientVideo
                src="/videos/geprint-tapijt"
                poster="/images/geprint-tapijt.webp"
                alt={t('printed.imageAlt')}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* Event tapijt & rode lopers */}
        <section id="event-tapijt" className="border-t border-border bg-primary text-primary-foreground">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src="/images/red-carpet.png"
                alt={t('event.imageAlt')}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">{t('event.eyebrow')}</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                {t('event.title')}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-primary-foreground/80 text-pretty">{t('event.text')}</p>
              <h3 className="mt-6 text-lg font-semibold text-accent">{t('event.subTitle')}</h3>
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75 text-pretty">{t('event.subText')}</p>
              <div className="mt-8">
                <Link
                  href="/event-tapijt"
                  className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent"
                >
                  {t('event.link')}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Waarom Carpetz */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">{t('why.eyebrow')}</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                {t('why.title')}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">{t('why.text')}</p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {usps.map((usp, i) => {
                const Icon = USP_ICONS[i] ?? Palette
                return (
                  <div key={usp.title} className="rounded-sm border border-border bg-card p-6">
                    <span className="inline-flex size-11 items-center justify-center rounded-sm bg-accent/15 text-accent">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-5 text-base font-semibold">{usp.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{usp.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Toepassingen */}
        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
                {t('applications.eyebrow')}
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                {t('applications.title')}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
                {t('applications.text')}
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {applications.map((app, i) => {
                const Icon = APPLICATION_ICONS[i] ?? Store
                return (
                  <div
                    key={app.title}
                    className="group rounded-sm border border-border bg-card p-6 transition-colors hover:border-accent"
                  >
                    <span className="inline-flex size-11 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-5 text-base font-semibold">{app.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{app.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Duurzaamheid & onderhoud */}
        <section className="border-t border-border">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
                {t('durability.eyebrow')}
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                {t('durability.title')}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">{t('durability.text')}</p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent" />
                  <div>
                    <h3 className="text-sm font-semibold">{t('durability.colorfastTitle')}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t('durability.colorfastText')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Recycle className="mt-0.5 size-5 shrink-0 text-accent" />
                  <div>
                    <h3 className="text-sm font-semibold">{t('durability.recyclableTitle')}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t('durability.recyclableText')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src="/images/craftsmanship.png"
                alt={t('durability.imageAlt')}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Snelle levering */}
        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8">
            <span className="inline-flex size-12 items-center justify-center rounded-sm bg-accent text-accent-foreground">
              <Truck className="size-6" />
            </span>
            <h2 className="mt-6 font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
              {t('delivery.title')}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">{t('delivery.text')}</p>
            <div className="mt-8 flex justify-center">
              <Cta href="/contact" variant="accent">
                {common('requestQuote')}
              </Cta>
            </div>
          </div>
        </section>

        <QuoteBand />
      </main>
      <SiteFooter />
    </>
  )
}
