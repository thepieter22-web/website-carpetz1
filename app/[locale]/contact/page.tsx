import type { Metadata } from 'next'
import { Suspense } from 'react'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { ContactForm } from '@/components/contact-form'
import { localizedAlternates } from '@/lib/seo'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta.contact' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: localizedAlternates(locale, '/contact'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: [{ url: '/images/hero-event-carpet.png', width: 1200, height: 630, alt: t('ogImageAlt') }],
    },
  }
}

export default function ContactPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const t = useTranslations('Contact')
  const common = useTranslations('Common')

  const contactDetails = [
    { icon: Phone, label: t('phone'), value: '+32 488 23 65 81', href: 'tel:+32488236581' },
    { icon: Mail, label: t('email'), value: 'info@carpetz.be', href: 'mailto:info@carpetz.be' },
    { icon: MapPin, label: t('address'), value: t('addressValue') },
    { icon: Clock, label: t('openingHours'), value: t('openingHoursValue') },
  ]

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow={t('eyebrow')}
          title={t('title')}
          intro={t('intro')}
          image="/images/hero-event-carpet.png"
          imageAlt={t('imageAlt')}
        />

        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1fr_1.4fr] lg:px-8 lg:py-20">
          <div>
            <h2 className="font-serif text-2xl font-semibold leading-tight text-balance">{t('contactTitle')}</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty">{t('contactText')}</p>

            <dl className="mt-8 space-y-6">
              {contactDetails.map((d) => (
                <div key={d.label} className="flex items-start gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-sm bg-accent/15 text-accent">
                    <d.icon className="size-5" />
                  </span>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{d.label}</dt>
                    <dd className="mt-1 text-sm font-medium text-foreground">
                      {d.href ? (
                        <a href={d.href} className="transition-colors hover:text-accent">
                          {d.value}
                        </a>
                      ) : (
                        d.value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-8 rounded-sm border border-accent/40 bg-accent/10 p-5">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="size-4 text-accent" />
                {common('replyWithin24h')}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t('replyText')}</p>
            </div>
          </div>

          <div className="rounded-sm border border-border bg-card p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-semibold leading-tight text-balance">{t('formTitle')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t('formText')}</p>
            <div className="mt-6">
              <Suspense fallback={null}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
