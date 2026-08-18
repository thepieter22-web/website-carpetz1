import { Cta } from '@/components/cta'
import { Clock } from 'lucide-react'

type QuoteBandProps = {
  title?: string
  text?: string
}

export function QuoteBand({
  title = 'Klaar voor tapijt op maat?',
  text = 'Vertel ons over je project en ontvang een vrijblijvende offerte. Ons team denkt met je mee over materiaal, formaat, print en levering.',
}: QuoteBandProps) {
  return (
    <section className="bg-accent text-accent-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest">
            <Clock className="size-4" />
            Ontvang binnen 24 uur antwoord
          </div>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-balance sm:text-4xl">{title}</h2>
          <p className="mt-3 text-base leading-relaxed text-accent-foreground/80 text-pretty">{text}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Cta href="/contact" variant="primary">
            Vraag je offerte aan
          </Cta>
          <Cta href="/contact" variant="outline" withArrow={false}>
            Contacteer ons
          </Cta>
        </div>
      </div>
    </section>
  )
}