import type { Metadata } from 'next'
import Image from 'next/image'
import { CheckCircle2, Sparkles, Zap, Repeat, Palette, PartyPopper, Heart, Gem, Type, CalendarHeart, ScrollText, Printer } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { QuoteBand } from '@/components/quote-band'
import { CustomRunnerHighlight } from '@/components/custom-runner-highlight'

export const metadata: Metadata = {
  title: 'Event tapijt & rode loper op maat',
  description:
    'Event tapijt en rode lopers op maat voor huwelijken, verjaardagen, gala\u2019s en corporate events. Tapijt voor events in elke kleur en afmeting, met snelle levering in België & Nederland.',
  alternates: { canonical: '/event-tapijt' },
  openGraph: {
    title: 'Event tapijt & rode loper op maat | Carpetz',
    description:
      'Event tapijt en rode lopers op maat voor huwelijken, verjaardagen, gala\u2019s en events. Tapijt voor events in elke kleur en afmeting.',
    images: [{ url: '/images/red-carpet.png', width: 1200, height: 630, alt: 'Rode loper op maat van Carpetz' }],
  },
}

const features = [
  { icon: Palette, title: 'Elke kleur & afmeting', text: 'Van klassiek rood tot je eigen huisstijlkleur, in elk formaat.' },
  { icon: Sparkles, title: 'Logo geïntegreerd', text: 'Voeg je logo of boodschap toe aan je event tapijt of loper.' },
  { icon: Zap, title: 'Snel te leggen', text: 'Netjes af te werken en klaar op tijd voor je event.' },
  { icon: Repeat, title: 'Herbruikbaar', text: 'Kwaliteitstapijt dat je meermaals kan inzetten.' },
]


const weddingDetails = [
  { icon: Type, title: 'Jullie namen', text: 'Of initialen' },
  { icon: CalendarHeart, title: 'Datum', text: 'Jullie speciale dag' },
  { icon: Heart, title: 'Eigen tekst', text: 'Een quote, belofte of boodschap' },
]

const birthdayDetails = [
  { icon: PartyPopper, title: 'Gelukkige verjaardag', text: 'Als feestelijke openingstekst' },
  { icon: Type, title: 'De leeftijd', text: 'Groot en trots in beeld' },
  { icon: Heart, title: 'Persoonlijke tekst', text: 'Een boodschap naar keuze' },
]

const eventDetails = [
  { icon: Gem, title: 'Elke gelegenheid', text: 'Communie, gala, jubileum of bedrijfsevent' },
  { icon: Sparkles, title: 'Jouw thema of logo', text: 'Kleur, stijl en boodschap volledig naar wens' },
  { icon: Heart, title: 'Persoonlijke tekst', text: 'Naam, datum of quote die het moment vastlegt' },
]

const runnerQualities = [
  { icon: ScrollText, title: 'Hoogwaardig materiaal', text: 'Stevig, slijtvast en elegant' },
  { icon: Printer, title: 'Haarscherpe print', text: 'Levendige kleuren en strakke details' },
  { icon: Heart, title: 'Volledig op maat', text: 'Jullie ontwerp, jullie stijl' },
  { icon: Sparkles, title: 'Perfecte afwerking', text: 'Voor een onvergetelijke entree' },
]

export default function EventTapijtPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Event tapijt"
          title="Event tapijt & rode lopers op maat"
          intro="Een event begint bij de entree. Van een verjaardagsfeest of huwelijk tot een gala of beursstand — met een rode loper of event tapijt op maat creëer je meteen de juiste sfeer."
          image="/images/red-carpet.png"
          imageAlt="Rode loper op maat bij een exclusief event"
        />

              <section className="relative px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="relative z-10 ml-auto -mt-24 max-w-2xl rounded-sm border-l-4 border-accent bg-card px-8 py-7 shadow-xl lg:-mt-28 lg:px-10 lg:py-8">
              <h2 className="font-serif text-2xl font-semibold leading-tight text-balance sm:text-3xl">
                Tapijt voor events dat indruk maakt
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
                Van een verjaardagsfeest en huwelijk tot filmpremière, gala of beursstand: onze rode
                loper en event tapijt op maat passen zich aan jouw gelegenheid aan, met je eigen logo,
                naam of boodschap erin verwerkt.
              </p>
            </div>
          </div>
        </section>

        <div className="pt-10" />

      

        <CustomRunnerHighlight
          eyebrow="Trouwloper op maat"
          title="Maak jullie trouwloper uniek"
          description="Laat jullie namen, datum of een persoonlijke boodschap printen op de loper die jullie dag compleet maakt."
          image="/images/trouwloper.png"
          imageAlt="Trouwloper op maat met namen en datum, versierd met bloemen en kaarsen"
          details={weddingDetails}
                   taglineTitle="Jullie droom, onze print."
          taglineSubtitle="Uniek zoals jullie liefde."
          priceExample={{ length: 10, width: 1, pricePerM2: 17.5, productSlug: 'trouwloper' }}
        />

                <CustomRunnerHighlight
          eyebrow="Verjaardagsloper op maat"
          title="Elk feest verdient een entree"
          description="Van 'Gelukkige verjaardag' tot de leeftijd van de jarige of een persoonlijke tekst: de entreemat kan volledig op maat geprint worden, precies zoals jij het wil."
          image="/images/verjaardagsloper.png"
          imageAlt="Verjaardagsloper op maat met feestelijke tekst"
          details={birthdayDetails}
          freeformNote="Bovenstaande zijn slechts voorbeelden — alles is bespreekbaar en volledig aanpasbaar."
                   taglineTitle="Jouw feest, jouw stijl."
          taglineSubtitle="Onvergetelijk vanaf de eerste stap."
                   imagePosition="right"
          priceExample={{ length: 5, width: 1, pricePerM2: 17.5, productSlug: 'verjaardagsloper' }}
        />

        <CustomRunnerHighlight
          eyebrow="Feestloper op maat"
          title="Maak jouw feest uniek"
          description="Communie, gala, jubileum of bedrijfsevent: met een loper op maat geef je elk moment een unieke, persoonlijke touch vanaf de eerste stap."
          image="/images/feestloper.png"
          imageAlt="Feestloper op maat voor communie, gala of event"
          details={eventDetails}
          freeformNote="Vertel ons je gelegenheid en wij denken mee over het perfecte ontwerp."
          taglineTitle="Elk feest, jouw stijl."
          taglineSubtitle="Uniek vanaf de allereerste stap."
          priceExample={{ length: 5, width: 1, pricePerM2: 17.5, productSlug: 'feestloper' }}
        />

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
                'Verjaardagsfeesten en huwelijken',
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

        <QuoteBand title="Reserveer jouw rode loper op maat" text="Vertel ons over je event of je grote dag, de datum en de gewenste afmetingen. Wij bezorgen je snel een offerte voor event tapijt of een rode loper op maat." />
      </main>
      <SiteFooter />
    </>
  )
}
