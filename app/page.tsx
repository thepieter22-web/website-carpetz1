import Image from 'next/image'
import Link from 'next/link'
import {
  Palette,
  Ruler,
  Truck,
  Recycle,
  ShieldCheck,
  Sparkles,
  Building2,
  Hotel,
  Store,
  Presentation,
  PartyPopper,
  Briefcase,
  ArrowRight,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Hero } from '@/components/hero'
import { QuoteBand } from '@/components/quote-band'
import { Cta } from '@/components/cta'
import { LocalBusinessJsonLd } from '@/components/local-business-jsonld'

const usps = [
  {
    icon: Palette,
    title: 'Volledig op maat ontworpen',
    text: 'Elk logo, elke kleur en elk formaat. Wij vertalen je huisstijl naar branding tapijt met scherpe, kleurvaste print.',
  },
  {
    icon: Ruler,
    title: 'Elk formaat, elke vorm',
    text: 'Van kleine logomatten tot naadloos geprint vloertapijt van tientallen meters voor je beursstand of showroom.',
  },
  {
    icon: Truck,
    title: 'Snelle levering Benelux',
    text: 'Korte productietijden en betrouwbare levering van tapijt op maat in heel België en Nederland.',
  },
  {
    icon: Recycle,
    title: 'Duurzame materialen',
    text: 'Slijtvaste vezels en recycleerbare dragers zorgen voor tapijt dat lang meegaat en makkelijk te onderhouden is.',
  },
]

const applications = [
  { icon: Store, title: 'Retail', text: 'Trek klanten binnen met logomatten en geprint tapijt in je winkel of flagshipstore.' },
  { icon: Hotel, title: 'Hotels', text: 'Verwelkom gasten met stijlvol tapijt op maat in lobby, gangen en suites.' },
  { icon: Presentation, title: 'Beurzen', text: 'Val op met tapijt voor beurzen dat je stand herkenbaar en uitnodigend maakt.' },
  { icon: PartyPopper, title: 'Events', text: 'Zet de toon met event tapijt en rode lopers op maat voor elke gelegenheid.' },
  { icon: Building2, title: 'Showrooms', text: 'Presenteer je producten op geprint vloertapijt dat perfect aansluit bij je merk.' },
  { icon: Briefcase, title: 'Kantoren', text: 'Versterk je bedrijfsidentiteit met logomatten op maat bij elke ingang.' },
]

export default function HomePage() {
  return (
    <>
      <LocalBusinessJsonLd />
      <SiteHeader />
      <main>
        <Hero />

        <section className="border-t border-border bg-background">
  <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

    <div className="text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
        Waar ben je naar op zoek?
      </p>

      <h2 className="mt-4 font-serif text-3xl font-semibold">
        Kies jouw oplossing
      </h2>

      <p className="mt-4 text-muted-foreground">
        Ontdek onze populairste oplossingen voor branding op de vloer.
      </p>
    </div>

   <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

  <Link
    href="/logomat"
    className="rounded-sm border border-border bg-card p-  </h3>

    <p className="mt-4 text-sm text-muted-foreground">
      Voor winkels, kantoren, hotels en inkomhallen.
    </p>

    <span className="mt-6 inline-block font-medium text-accent">
      Ontdek logomatten →
    </span>
  </Link>

  <Link
    href="/geprint-tapijt"
    className="rounded-sm border border-border bg-t tapijt
    </h3>

    <p className="mt-4 text-sm text-muted-foreground">
      Perfect voor showrooms, retail en beursstanden.
    </p>

    <span className="mt-6 inline-block font-medium text-accent">
      Ontdek geprint tapijt →
    </span>
  </Link>

  <Link
    href="/event-tapijt"
    className="rounded-sm border border-border bg-card p-8 transition-all hoversName="mt-4 text-sm text-muted-foreground">
      Rode lopers en event tapijt voor beurzen en evenementen.
    </p>

    <span className="mt-6 inline-block font-medium text-accent">
      Ontdek event tapijt →
    </span>
  </Link>

</div>

  </div>
</section>

       
        
        {/* Logomatten op maat */}
        <section id="logomatten" className="border-t border-border bg-secondary/40">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src="/images/logomat-winkel-entree.webp"
                alt="Logomat op maat met ingeweven bedrijfslogo in dichte tapijtvezel"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Logomatten</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                Logomatten op maat
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
                Een logomat is het visitekaartje van je onderneming. Onze logomatten op maat worden
                geproduceerd met een fotorealistische print of ingeweven design, zodat je logo scherp,
                kleurvast en professioneel oogt &mdash; dag na dag. Ideaal als schoonloopmat bij de
                ingang: functioneel én representatief. Je kiest zelf het formaat, de vorm, de
                antislibdrager en de afwerking van de randen.
              </p>
              <h3 className="mt-6 text-lg font-semibold">Waarom een logomat van Carpetz?</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {[
                  'Scherpe full-colour print van je logo en huisstijl',
                  'Slijtvast en geschikt voor intensief gebruik',
                  'Antislib rug en wasbaar voor eenvoudig onderhoud',
                  'Elk formaat en elke vorm op maat gemaakt',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/logomat"
                  className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-foreground"
                >
                  Ontdek logomatten
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
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Geprint tapijt</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                Geprint tapijt &amp; geprint vloertapijt
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
                Met geprint tapijt geef je een volledige ruimte in één keer je eigen gezicht. Dankzij
                moderne printtechnieken kunnen we tapijt bedrukken met fotografische beelden,
                patronen, kleurvlakken of je volledige campagne. Zo transformeer je een neutrale vloer
                tot een krachtig branding tapijt. Ons geprint vloertapijt is naadloos te leggen over
                grote oppervlakken en is even geschikt voor een tijdelijke pop-up als voor een
                permanente showroom.
              </p>
              <h3 className="mt-6 text-lg font-semibold">Toepassingen voor geprint tapijt</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
                Retailvloeren, beursstanden, productlanceringen, seizoenscampagnes en experience
                zones: overal waar je bezoekers wil onderdompelen in je merk is geprint tapijt op maat
                de oplossing. Wij begeleiden je van drukklaar bestand tot afgewerkt tapijt.
              </p>
              <div className="mt-8">
                <Link
                  href="/geprint-tapijt"
                  className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-foreground"
                >
                  Ontdek geprint tapijt
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
            <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-sm lg:order-2">
              <Image
                src="/images/printed-carpet.png"
                alt="Geprint vloertapijt met kleurrijk patroon in een moderne retail showroom"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
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
                alt="Rode loper op maat met warme spots bij een exclusief event"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Event tapijt</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                Event tapijt &amp; rode lopers op maat
              </h2>
              <p className="mt-5 text-base leading-relaxed text-primary-foreground/80 text-pretty">
                Een event begint bij de entree. Met ons event tapijt en rode lopers op maat creëer je
                meteen de juiste sfeer &mdash; van glamoureuze filmpremière tot strakke corporate
                launch. We leveren tapijt voor events in elke kleur en afmeting, met de mogelijkheid om
                je logo of boodschap te integreren. Zo wordt zelfs de loopweg een deel van je verhaal.
              </p>
              <h3 className="mt-6 text-lg font-semibold text-accent">Van beurs tot gala</h3>
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75 text-pretty">
                Ons tapijt voor beurzen en events is snel te leggen, netjes af te werken en indien
                gewenst herbruikbaar. Ideaal voor organisatoren die op grote schaal willen uitpakken
                zonder in te boeten op kwaliteit of uitstraling.
              </p>
              <div className="mt-8">
                <Link
                  href="/event-tapijt"
                  className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent"
                >
                  Ontdek event tapijt
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
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Waarom Carpetz?</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                Eén partner voor al je tapijt op maat
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
                Van eerste ontwerp tot geleverd tapijt: bij Carpetz krijg je persoonlijk advies,
                betrouwbare kwaliteit en scherpe deadlines. Wij combineren vakmanschap met moderne
                printtechnologie zodat jouw branding tapijt er altijd op-en-top uitziet.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {usps.map((usp) => (
                <div key={usp.title} className="rounded-sm border border-border bg-card p-6">
                  <span className="inline-flex size-11 items-center justify-center rounded-sm bg-accent/15 text-accent">
                    <usp.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold">{usp.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{usp.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Toepassingen */}
        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Toepassingen</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                Tapijt op maat voor elke sector
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
                Bedrijven uit uiteenlopende sectoren vertrouwen op Carpetz voor logomatten, geprint
                tapijt en event tapijt. Ontdek waar ons tapijt op maat het verschil maakt.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {applications.map((app) => (
                <div key={app.title} className="group rounded-sm border border-border bg-card p-6 transition-colors hover:border-accent">
                  <span className="inline-flex size-11 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                    <app.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold">{app.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{app.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Duurzaamheid & onderhoud */}
        <section className="border-t border-border">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Duurzaamheid &amp; onderhoud</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                Gemaakt om lang mee te gaan
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
                Duurzaamheid zit bij ons in het materiaal én in het gebruik. We werken met slijtvaste,
                kleurvaste vezels en recycleerbare dragers, zodat je tapijt op maat er ook na
                intensief gebruik nog representatief uitziet. Onze logomatten zijn eenvoudig te
                reinigen en wasbaar, geprint tapijt is stofafstotend en makkelijk te onderhouden.
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent" />
                  <div>
                    <h3 className="text-sm font-semibold">Kleurvast &amp; slijtvast</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Behoudt jarenlang scherpe kleuren en vorm.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Recycle className="mt-0.5 size-5 shrink-0 text-accent" />
                  <div>
                    <h3 className="text-sm font-semibold">Recycleerbaar</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Dragers en vezels met oog voor milieu.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src="/images/craftsmanship.png"
                alt="Vakman inspecteert een rol geprint tapijt op maat in de productie"
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
              Snelle levering in België &amp; Nederland
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
              Deadlines voor een beurs, opening of event laten zich niet uitstellen. Daarom houden wij
              onze productietijden kort en leveren we tapijt op maat betrouwbaar in heel de Benelux.
              Vraag je offerte aan en ontvang binnen 24 uur antwoord van ons team, inclusief een
              realistische leveringsdatum voor je logomatten, geprint tapijt of event tapijt.
            </p>
            <div className="mt-8 flex justify-center">
              <Cta href="/contact" variant="accent">
                Vraag je offerte aan
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
