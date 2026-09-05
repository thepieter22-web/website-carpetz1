'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'

const products = [
  'Logomatten op maat',
  'Geprint tapijt',
  'Event tapijt',
  'Rode loper op maat',
  'Anders',
]

function mapProductSlug(slug: string | null): string {
  switch (slug) {
    case 'geprint-tapijt':
      return 'Geprint tapijt'
    case 'trouwloper':
    case 'verjaardagsloper':
      return 'Rode loper op maat'
    default:
      return products[0]
  }
}

function buildPrefilledMessage(params: URLSearchParams): string {
  const product = params.get('product')
  const lengte = params.get('lengte')
  const breedte = params.get('breedte')
  const diameter = params.get('diameter')
  const kwaliteit = params.get('kwaliteit')
  const prijs = params.get('prijsindicatie') || params.get('richtprijs')

  if (!product) return ''

  const labels: Record<string, string> = {
    'geprint-tapijt': 'geprint tapijt',
    trouwloper: 'een trouwloper',
    verjaardagsloper: 'een verjaardagsloper',
  }

  const productLabel = labels[product] || product
  let sentence = `Ik heb interesse in ${productLabel}`

  if (kwaliteit) sentence += ` (kwaliteit: ${kwaliteit})`

  if (diameter) {
    sentence += ` met een diameter van ${diameter}m`
  } else if (lengte && breedte) {
    sentence += ` van ${lengte}m x ${breedte}m`
  }

  if (prijs) sentence += ` (richtprijs €${prijs})`

  sentence += '. Graag ontvang ik een persoonlijke offerte.'

  return sentence
}

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const searchParams = useSearchParams()

  const prefilledProduct = mapProductSlug(searchParams.get('product'))
  const prefilledMessage = buildPrefilledMessage(searchParams)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    // Simuleer verzending; koppel hier je eigen e-mail-/CRM-integratie.
    setTimeout(() => setStatus('success'), 900)
  }

  if (status === 'success') {
    return (
      <div className="rounded-sm border border-accent/40 bg-accent/10 p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-accent" />
        <h3 className="mt-4 font-serif text-2xl font-semibold">Bedankt voor je aanvraag!</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We hebben je aanvraag goed ontvangen en nemen binnen 24 uur contact met je op met een
          antwoord op maat.
        </p>
      </div>
    )
  }

  const inputClass =
    'w-full rounded-sm border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/30'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Naam <span className="text-brand-red">*</span>
          </label>
          <input id="name" name="name" required autoComplete="name" className={inputClass} placeholder="Je naam" />
        </div>
        <div>
          <label htmlFor="company" className="mb-2 block text-sm font-medium">
            Bedrijf
          </label>
          <input id="company" name="company" autoComplete="organization" className={inputClass} placeholder="Je bedrijf" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            E-mail <span className="text-brand-red">*</span>
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} placeholder="jij@bedrijf.be" />
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium">
            Telefoon
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} placeholder="+32 ..." />
        </div>
      </div>

      <div>
        <label htmlFor="product" className="mb-2 block text-sm font-medium">
          Waarover gaat je aanvraag?
        </label>
        <select id="product" name="product" defaultValue={prefilledProduct} className={inputClass}>
          {products.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium">
          Je bericht <span className="text-brand-red">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={inputClass}
          placeholder="Vertel ons over je project: formaat, aantal, gewenste leverdatum ..."
          defaultValue={prefilledMessage}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-sm font-medium uppercase tracking-wide text-accent-foreground transition-all hover:brightness-105 disabled:opacity-70 sm:w-auto"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Versturen ...
          </>
        ) : (
          'Vraag je offerte aan'
        )}
      </button>
      <p className="text-xs text-muted-foreground">
        We reageren binnen 24 uur op je aanvraag. Je gegevens worden vertrouwelijk behandeld.
      </p>
    </form>
  )
}
