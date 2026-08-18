import Image from 'next/image'
import { Cta } from '@/components/cta'
import { Star } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-event-carpet.png"
          alt="Rode loper op maat bij een premium event met brass afzetpalen"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/50" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-36">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-accent">
            <Star className="size-3.5 fill-accent" />
            Branding tapijt voor bedrijven, retail & events
          </div>

          <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.05] text-balance sm:text-5xl lg:text-7xl">
            Logomatten, geprint tapijt &amp; event tapijt op maat
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/85 text-pretty">
            Carpetz ontwerpt en produceert tapijt op maat dat je merk letterlijk op de kaart zet.
            Van logomatten op maat en geprint tapijt tot rode lopers op maat voor je volgende beurs
            of event &mdash; met snelle levering in België en Nederland.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Cta href="/contact" variant="accent">
              Vraag je offerte aan
            </Cta>
            <Cta href="/contact" variant="outlineLight" withArrow={false}>
              Ontvang binnen 24 uur antwoord
            </Cta>
          </div>

          <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-primary-foreground/15 pt-8">
            <div>
              <dt className="text-3xl font-semibold text-accent">15+</dt>
              <dd className="mt-1 text-sm text-primary-foreground/70">jaar ervaring in tapijt op maat</dd>
            </div>
            <div>
              <dt className="text-3xl font-semibold text-accent">24u</dt>
              <dd className="mt-1 text-sm text-primary-foreground/70">reactie op elke offerte-aanvraag</dd>
            </div>
            <div>
              <dt className="text-3xl font-semibold text-accent">BE &amp; NL</dt>
              <dd className="mt-1 text-sm text-primary-foreground/70">snelle levering in de Benelux</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}