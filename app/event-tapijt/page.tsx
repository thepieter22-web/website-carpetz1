import type { Metadata } from 'next'
import Image from 'next/image'
import { CheckCircle2, Sparkles, Zap, Repeat, Palette } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { QuoteBand } from '@/components/quote-band'

export const metadata: Metadata = {
  title: 'Event tapijt & rode loper op maat',
  description:
    'Event tapijt en rode lopers op maat voor beurzen, gala\u2019s en corporate events. Tapijt voor events in elke kleur en afmeting, met snelle levering in België & Nederland.',
  alternates: { canonical: '/event-tapijt' },
  openGraph: {
    title: 'Event tapijt & rode loper op maat | Carpetz',
    description:
      'Event tapijt en rode lopers op maat voor beurzen, gala\u2019s en events. Tapijt voor events in elke kleur en afmeting.',
    images: [{ url: '/images/red-carpet.png', width: 1200, height: 630, alt: 'Rode loper op maat van Carpetz' }],
  },
}

const features = [
  { icon: Palette, title: 'Elke kleur & afmeting', text: 'Van klassiek rood tot je eigen huisstijlkleur, in elk formaat.' },
  { icon: Sparkles, title: 'Logo geïntegreerd', text: 'Voeg je logo of boodschap toe aan je event tapijt of loper.' },
  { icon: Zap, title: 'Snel te leggen', text: 'Netjes af te werken en klaar op tijd voor je event.' },
  { icon: Repeat, title: 'Herbruikbaar', text: 'Kwaliteitstapijt dat je meermaals kan inzetten.' },
]

export default function EventTapijtPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Event tapijt"
          title="Event tapijt & rode lopers op maat"
          intro="Een event begint bij de entree. Met event tapijt en rode lopers op maat creëer je meteen de juiste sfeer — van glamoureuze premières tot strakke corporate launches."
          image="/images/red-carpet.png"
          imageAlt="Rode loper op maat bij een exclusief event"
        />

        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
          <h2 className="font-serif text-3xl font-semibold leading-tight text-balance">
            Tapijt voor events dat indruk maakt
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
            De loopweg naar je event is een van de eerste dingen die gasten ervaren. Met ons event
            tapijt en rode lopers op maat zet je meteen de toon. We leveren tapijt voor events in elke
            kleur en afmeting, met de mogelijkheid om je logo of boodschap te integreren. Zo wordt
            zelfs de entree een deel van je verhaal en straal je professionaliteit uit vanaf de eerste
            stap.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
            Van filmpremière en awardshow tot productlancering, opening of gala: onze rode loper op
            maat past zich aan jouw gelegenheid aan. En omdat we ook tapijt voor beurzen leveren, ben
            je bij Carpetz aan het juiste adres voor elk evenement, groot of klein.
          </p>
        </section>

        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance">Kenmerken van ons event tapijt</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div key={f.title} className="rounded-sm border border-border bg-card p-6">
                  <span className="inline-flex size-11 items-center justify-center rounded-sm bg-accent/15 text-accent">
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
            <Image
              src="/images/trade-fair.png"
              alt="Tapijt voor beurzen op een moderne beursstand"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance">
              Voor elk soort event
            </h2>
            <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
              {[
                'Premières, gala\u2019s en awardshows',
                'Corporate launches en persmomenten',
                'Openingen en jubilea',
                'Beurzen en tapijt voor beursstanden',
                'Festivals en publieksevenementen',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <QuoteBand title="Reserveer jouw rode loper op maat" text="Vertel ons over je event, de datum en de gewenste afmetingen. Wij bezorgen je snel een offerte voor event tapijt of een rode loper op maat." />
      </main>
      <SiteFooter />
    </>
  )
}