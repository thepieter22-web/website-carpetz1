import type { Metadata } from 'next'
import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { QuoteBand } from '@/components/quote-band'
import { MatConfigurator } from '@/components/mat-configurator'

export const metadata: Metadata = {
  title: 'Logomatten op maat laten maken',
  description:
    'Logomatten op maat met scherpe full-colour print van je logo. Slijtvast, antislib en wasbaar. Branding tapijt voor elke ingang, met snelle levering in België & Nederland.',
  alternates: { canonical: '/logomat' },
  openGraph: {
    title: 'Logomatten op maat laten maken | Carpetz',
    description:
      'Logomatten op maat met scherpe print van je logo. Slijtvast, antislib en wasbaar branding tapijt voor elke ingang.',
    images: [{ url: '/images/logomat-winkel-entree.webp', width: 1200, height: 630, alt: 'Logomat op maat van Carpetz' }],
  },
}


export default function LogomatPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Logomatten"
          title="Logomatten op maat"
          intro="Verwelkom bezoekers met een logomat op maat die je merk meteen op de kaart zet. Functioneel als schoonloopmat, representatief als visitekaartje."
          image="/images/logomat-winkel-entree.webp"
          imageAlt="Logomat op maat met ingeweven bedrijfslogo"
        />

               <section className="relative px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="relative z-10 ml-auto -mt-24 max-w-2xl rounded-sm border-l-4 border-accent bg-card px-8 py-7 shadow-xl lg:-mt-28 lg:px-10 lg:py-8">
                            <h2 className="font-serif text-2xl font-semibold leading-tight text-balance sm:text-3xl">
                Ontwerp jouw logomat op maat
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
                Upload jouw logo, kies kleur en afmetingen en bestel direct online. Wij bedrukken
                tapijt met een fotorealistische print van je logo, zodat kleuren scherp en herkenbaar
                blijven &mdash; ook na jaren intensief gebruik.
              </p>
            </div>
          </div>
        </section>

       

<section id="configurator" className="scroll-mt-24 border-t border-border bg-white">
  <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
    <MatConfigurator />
  </div>
</section>



        

        <QuoteBand title="Bestel jouw logomat op maat" text="Stuur ons je logo en gewenste formaat. Wij bezorgen je een vrijblijvende offerte voor logomatten op maat." />
      </main>
      <SiteFooter />
    </>
  )
}
