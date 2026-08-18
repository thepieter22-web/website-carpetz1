import type { Metadata } from 'next'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact & offerte',
  description:
    'Contacteer Carpetz voor logomatten op maat, geprint tapijt, event tapijt en rode lopers. Vraag je offerte aan en ontvang binnen 24 uur antwoord in België & Nederland.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact & offerte | Carpetz',
    description:
      'Vraag je offerte aan voor tapijt op maat. Ontvang binnen 24 uur antwoord van het Carpetz-team.',
    images: [{ url: '/images/hero-event-carpet.png', width: 1200, height: 630, alt: 'Contacteer Carpetz' }],
  },
}

const contactDetails = [
  { icon: Phone, label: 'Telefoon', value: '+32 0485 464 949', href: 'tel:+3215000000' },
  { icon: Mail, label: 'E-mail', value: 'info@carpetz.be', href: 'mailto:info@carpetz.be' },
  { icon: MapPin, label: 'Adres', value: 'Industrielaan 12, 2800 Mechelen, België' },
  { icon: Clock, label: 'Openingsuren', value: 'Ma \u2013 Vr, 08:30 \u2013 17:30' },
]

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Contact & offerte"
          title="Vraag je offerte aan"
          intro="Vertel ons over je project en ontvang binnen 24 uur antwoord. Ons team denkt met je mee over materiaal, formaat, print en levering van je tapijt op maat."
          image="/images/hero-event-carpet.png"
          imageAlt="Contacteer Carpetz voor tapijt op maat"
        />

        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1fr_1.4fr] lg:px-8 lg:py-20">
          <div>
            <h2 className="font-serif text-2xl font-semibold leading-tight text-balance">
              Contacteer ons
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty">
              Liever meteen persoonlijk contact? Bel of mail ons gerust. We helpen je graag verder met
              logomatten op maat, geprint tapijt, event tapijt en rode lopers op maat.
            </p>

            <dl className="mt-8 space-y-6">
              {contactDetails.map((d) => (
                <div key={d.label} className="flex items-start gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-sm bg-accent/15 text-accent">
                    <d.icon className="size-5" />
                  </span>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {d.label}
                    </dt>
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
                Ontvang binnen 24 uur antwoord
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Elke offerte-aanvraag krijgt binnen één werkdag een persoonlijk antwoord van ons team.
              </p>
            </div>
          </div>

          <div className="rounded-sm border border-border bg-card p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-semibold leading-tight text-balance">
              Offerte aanvragen
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">Vul het formulier in en we nemen snel contact op.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}