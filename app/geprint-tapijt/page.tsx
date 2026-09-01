import { PrintedCarpetSimulator } from '@/components/printed-carpet-simulator'
import type { Metadata } from 'next'
import Image from 'next/image'
import { CheckCircle2, Printer, Layers, Maximize, Image as ImageIcon } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { QuoteBand } from '@/components/quote-band'

export const metadata: Metadata = {
  title: 'Geprint tapijt & geprint vloertapijt op maat',
  description:
    'Geprint tapijt op maat met fotorealistische print. Tapijt bedrukken met je logo, patroon of campagne voor retail, beurzen en showrooms. Naadloos geprint vloertapijt.',
  alternates: { canonical: '/geprint-tapijt' },
  openGraph: {
    title: 'Geprint tapijt & geprint vloertapijt op maat | Carpetz',
    description:
      'Tapijt bedrukken met je logo, patroon of campagne. Naadloos geprint vloertapijt voor retail, beurzen en showrooms.',
    images: [{ url: '/images/printed-carpet.png', width: 1200, height: 630, alt: 'Geprint tapijt op maat van Carpetz' }],
  },
}

const features = [
  { icon: Printer, title: 'Tapijt bedrukken', text: 'Fotorealistische print van logo, beelden, patronen of volledige campagnes.' },
  { icon: Maximize, title: 'Naadloos & groot', text: 'Geprint vloertapijt voor grote oppervlakken, naadloos gelegd.' },
  { icon: Layers, title: 'Meerdere kwaliteiten', text: 'Van tijdelijke pop-up tot permanente showroomvloer.' },
  { icon: ImageIcon, title: 'Drukklaar advies', text: 'Wij begeleiden je van ontwerpbestand tot afgewerkt tapijt.' },
]

export default function GeprintTapijtPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Geprint tapijt"
          title="Geprint tapijt & geprint vloertapijt"
          intro="Geef een volledige ruimte in één keer je eigen gezicht. Met geprint tapijt op maat vertaal je je merk naar de vloer — scherp, kleurvast en naadloos."
          image="/images/printed-carpet.png"
          imageAlt="Geprint vloertapijt met kleurrijk patroon"
        />

        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
          <h2 className="font-serif text-3xl font-semibold leading-tight text-balance">
            Van neutrale vloer naar krachtig branding tapijt
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
            Met moderne printtechnieken kunnen we tapijt bedrukken met vrijwel elk visueel element:
            een fotografisch beeld, een grafisch patroon, kleurvlakken in je huisstijl of je volledige
            campagne. Zo transformeer je een gewone vloer tot een meeslepend merkverhaal. Ons geprint
            vloertapijt is naadloos te leggen over grote oppervlakken en beschikbaar in verschillende
            kwaliteiten &mdash; van licht en tijdelijk tot slijtvast en permanent.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
            Of je nu een pop-upstore inricht, een beursstand bekleedt of je showroom een nieuwe look
            geeft: geprint tapijt op maat zorgt voor een consistente, professionele uitstraling. Ons
            team denkt mee over kleur, resolutie en materiaal, en levert je drukklaar advies zodat het
            eindresultaat exact aansluit bij je verwachtingen.
          </p>
        </section>

        <PrintedCarpetSimulator />

        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance">Waarom geprint tapijt?</h2>
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
          <div>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance">
              Toepassingen voor geprint vloertapijt
            </h2>
            <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
              {[
                'Retailvloeren en flagshipstores',
                'Beursstanden en tapijt voor beurzen',
                'Productlanceringen en experience zones',
                'Showrooms en pop-upstores',
                'Seizoens- en campagne-inrichtingen',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
            <Image
              src="/images/trade-fair.png"
              alt="Beursstand met geprint tapijt op maat als branding tapijt"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </section>

        <QuoteBand title="Laat jouw geprint tapijt maken" text="Bezorg ons je ontwerp en afmetingen. Wij maken een offerte voor geprint tapijt of geprint vloertapijt op maat." />
      </main>
      <SiteFooter />
    </>
  )
}
