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

const audiences = [
  {
    icon: PartyPopper,
    title: 'Verjaardagsfeesten',
    text: 'Een rode loper met naam, leeftijd of thema erin verwerkt — voor een entree en fotomoment dat bijblijft.',
  },
  {
    icon: Heart,
    title: 'Trouw rode loper',
    text: 'De intrede van het bruidspaar op een loper met jullie namen en trouwdatum, als blijvend aandenken na de bruiloft.',
  },
  {
    icon: Gem,
    title: 'Unieke event rode lopers',
    text: 'Jubilea, gala’s of exclusieve feesten: een rode loper op maat qua kleur, tekst of logo, volledig naar jouw gelegenheid.',
  },
]

const steps = [
  { title: 'Kies afmeting & kleur', text: 'Bepaal de lengte, breedte en kleur die past bij jouw gelegenheid.' },
  { title: 'Voeg tekst of logo toe', text: 'Namen, een datum, een boodschap of logo — helemaal naar wens.' },
  { title: 'Wij leveren op tijd', text: 'Je rode loper wordt gemaakt en geleverd, klaar voor jouw grote dag.' },
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

        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
          <h2 className="font-serif text-3xl font-semibold leading-tight text-balance">
            Tapijt voor events dat indruk maakt
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
            De loopweg naar je event is een van de eerste dingen die gasten ervaren. Met ons event
            tapijt en rode lopers op maat zet je meteen de toon. We leveren tapijt voor events in elke
            kleur en afmeting, met de mogelijkheid om je logo, naam of boodschap te integreren. Zo
            wordt zelfs de entree een deel van je verhaal, of het nu gaat om een zakelijk event of een
            persoonlijke mijlpaal.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
            Van een verjaardagsfeest en huwelijk tot filmpremière, awardshow of productlancering: onze
            rode loper op maat past zich aan jouw gelegenheid aan. En omdat we ook tapijt voor beurzen
            leveren, ben je bij Carpetz aan het juiste adres voor elk evenement, groot of klein.
          </p>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
          <h2 className="font-serif text-3xl font-semibold leading-tight text-balance">
            Voor jouw grote moment
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {audiences.map((a) => (
              <div key={a.title} className="rounded-sm border border-border bg-card p-6">
                <span className="inline-flex size-11 items-center justify-center rounded-sm bg-accent/15 text-accent">
                  <a.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title}>
                <span className="text-sm font-semibold text-accent">{i + 1}</span>
                <h3 className="mt-2 text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <CustomRunnerHighlight
          eyebrow="Trouwloper op maat"
          title="Maak jullie trouwloper uniek"
          description="Laat jullie namen, datum of een persoonlijke boodschap printen op de loper die jullie dag compleet maakt."
          image="/images/trouwloper.png"
          imageAlt="Trouwloper op maat met namen en datum, versierd met bloemen en kaarsen"
          details={weddingDetails}
          taglineTitle="Jullie droom, onze print."
          taglineSubtitle="Uniek zoals jullie liefde."
          qualities={runnerQualities}
        />

        <CustomRunnerHighlight
          eyebrow="Verjaardagsloper op maat"
          title="Elk feest verdient een entree"
          description="Van 'Gelukkige verjaardag' tot de leeftijd van de jarige of een persoonlijke tekst: de entreemat kan volledig op maat geprint worden, precies zoals jij het wil."
          image="/images/verjaardagsloper.jpg"
          imageAlt="Verjaardagsloper op maat met feestelijke tekst"
          details={birthdayDetails}
          freeformNote="Bovenstaande zijn slechts voorbeelden — alles is bespreekbaar en volledig aanpasbaar."
          taglineTitle="Jouw feest, jouw stijl."
          taglineSubtitle="Onvergetelijk vanaf de eerste stap."
          qualities={runnerQualities}
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
