import type { Metadata } from 'next'
import Image from 'next/image'
import { CheckCircle2, Palette, Ruler, Droplets, ShieldCheck } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { QuoteBand } from '@/components/quote-band'

export const metadata: Metadata = {
  title: 'Logomatten op maat laten maken',
  description:
    'Logomatten op maat met scherpe full-colour print van je logo. Slijtvast, antislib en wasbaar. Branding tapijt voor elke ingang, met snelle levering in België & Nederland.',
  alternates: { canonical: '/logomat' },
  openGraph: {
    title: 'Logomatten op maat laten maken | Carpetz',
    description:
      'Logomatten op maat met scherpe print van je logo. Slijtvast, antislib en wasbaar branding tapijt voor elke ingang.',
    images: [{ url: '/images/logo-mat.jpg', width: 1200, height: 630, alt: 'Logomat op maat van Carpetz' }],
  },
}

const features = [
  { icon: Palette, title: 'Full-colour print', text: 'Je logo en huisstijl scherp en kleurvast weergegeven op dichte tapijtvezel.' },
  { icon: Ruler, title: 'Elk formaat & vorm', text: 'Rechthoekig, rond of volledig op maat gesneden voor jouw ingang.' },
  { icon: Droplets, title: 'Wasbaar & antislib', text: 'Eenvoudig te reinigen met een stevige antislibrug voor veilig gebruik.' },
  { icon: ShieldCheck, title: 'Slijtvast', text: 'Gemaakt voor intensief gebruik in drukke ingangen en publieke ruimtes.' },
]

export default function LogomatPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Logomatten"
          title="Logomatten op maat"
          intro="Verwelkom bezoekers met een logomat op maat die je merk meteen op de kaart zet. Functioneel als schoonloopmat, representatief als visitekaartje."
          image="/images/logo-mat.jpg"
          imageAlt="Logomat op maat met ingeweven bedrijfslogo"
        />

        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
          <h2 className="font-serif text-3xl font-semibold leading-tight text-balance">
            Een logomat als verlengstuk van je merk
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
            De ingang is het eerste dat je klanten en gasten zien. Met logomatten op maat van Carpetz
            maak je meteen een professionele indruk én houd je vuil en vocht buiten. Wij bedrukken
            tapijt met een fotorealistische print van je logo, zodat kleuren scherp en herkenbaar
            blijven &mdash; ook na jaren intensief gebruik. Zo combineer je functionaliteit met een
            sterke merkbeleving.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
            Je bepaalt zelf het formaat, de vorm, de kleur van de rand en het type drager. Of je nu
            één logomat voor je kantoor nodig hebt of tientallen exemplaren voor een filiaalketen: we
            leveren consistent branding tapijt van dezelfde hoge kwaliteit.
          </p>
        </section>

        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance">Kenmerken</h2>
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
              src="/images/logo-mat.jpg"
              alt="Detail van een logomat op maat met scherpe logo-print"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance">
              Waar zet je logomatten in?
            </h2>
            <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
              {[
                'Ingangen van kantoren en bedrijfspanden',
                'Winkels, flagshipstores en retailketens',
                'Hotels, restaurants en horeca',
                'Beursstanden en showrooms',
                'Publieke gebouwen en ontvangstruimtes',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <QuoteBand title="Bestel jouw logomat op maat" text="Stuur ons je logo en gewenste formaat. Wij bezorgen je een vrijblijvende offerte voor logomatten op maat." />
      </main>
      <SiteFooter />
    </>
  )
}