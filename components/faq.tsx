import { ChevronDown } from 'lucide-react'

export type FaqItem = { q: string; a: string }

/**
 * Veelgestelde vragen als uitklapbare lijst (werkt zonder JavaScript)
 * + FAQPage-schema voor Google. Teksten komen al vertaald binnen.
 */
export function Faq({ title, items, id = 'faq' }: { title: string; items: FaqItem[]; id?: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    // Antwoorden die nog ingevuld moeten worden, gaan niet naar Google.
    mainEntity: items.filter((item) => !/\[(INVULLEN|À COMPLÉTER)/.test(item.a)).map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <section id={id} className="border-t border-border">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">{title}</h2>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {items.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown
                  className="size-5 shrink-0 text-accent transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="pb-5 text-base leading-relaxed text-muted-foreground text-pretty">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </section>
  )
}
