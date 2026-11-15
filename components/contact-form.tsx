'use client'

import { useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLocale, useMessages, useTranslations } from 'next-intl'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

const PRODUCT_KEYS = ['logomats', 'printedCarpet', 'eventCarpet', 'redCarpet', 'other'] as const
type ProductKey = (typeof PRODUCT_KEYS)[number]

function mapProductSlug(slug: string | null): ProductKey {
  switch (slug) {
    case 'geprint-tapijt':
      return 'printedCarpet'
    case 'trouwloper':
    case 'verjaardagsloper':
    case 'feestloper':
    case 'loper':
      return 'redCarpet'
    case 'event-tapijt':
    case 'eventvloer':
    case 'beurstapijt':
      return 'eventCarpet'
    default:
      return 'logomats'
  }
}

export function ContactForm() {
  const t = useTranslations('ContactForm')
  const messages = useMessages()
  const locale = useLocale()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  // Moment waarop het formulier verscheen (bots versturen meteen).
  const startedAt = useRef(Date.now())
  const searchParams = useSearchParams()

  const productLabel = (key: ProductKey) => t(`products.${key}`)
  const prefilledProduct = productLabel(mapProductSlug(searchParams.get('product')))

  // Vooringevuld bericht op basis van de link vanuit de prijscalculator of lopers.
  function buildPrefilledMessage(): string {
    const product = searchParams.get('product')
    if (!product) return ''

    const length = searchParams.get('lengte')
    const width = searchParams.get('breedte')
    const diameter = searchParams.get('diameter')
    const quality = searchParams.get('kwaliteit')
    const price = searchParams.get('prijsindicatie') || searchParams.get('richtprijs')

    const labels = (messages.ContactForm as { prefill: { productLabels: Record<string, string> } }).prefill.productLabels
    let sentence = t('prefill.interest', { product: labels[product] ?? product })
    if (quality) sentence += t('prefill.quality', { quality })
    if (diameter) sentence += t('prefill.diameter', { diameter })
    else if (length && width) sentence += t('prefill.size', { length, width })
    if (price) sentence += t('prefill.price', { price })
    return sentence + t('prefill.closing')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const form = Object.fromEntries(new FormData(e.currentTarget))
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          locale,
          page: window.location.pathname + window.location.search,
          startedAt: startedAt.current,
        }),
      })
      setStatus(response.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-sm border border-accent/40 bg-accent/10 p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-accent" />
        <h3 className="mt-4 font-serif text-2xl font-semibold">{t('successTitle')}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t('successText')}</p>
      </div>
    )
  }

  const inputClass =
    'w-full min-h-12 rounded-sm border border-input bg-background px-4 py-3 text-sm pointer-coarse:text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/30'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">{t('honeypot')}</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            {t('name')} <span className="text-brand-red">*</span>
          </label>
          <input id="name" name="name" required autoComplete="name" className={inputClass} placeholder={t('namePlaceholder')} />
        </div>
        <div>
          <label htmlFor="company" className="mb-2 block text-sm font-medium">
            {t('company')}
          </label>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            className={inputClass}
            placeholder={t('companyPlaceholder')}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            {t('email')} <span className="text-brand-red">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            required
            autoComplete="email"
            className={inputClass}
            placeholder={t('emailPlaceholder')}
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium">
            {t('phone')}
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} placeholder={t('phonePlaceholder')} />
        </div>
      </div>

      <div>
        <label htmlFor="product" className="mb-2 block text-sm font-medium">
          {t('subject')}
        </label>
        <select id="product" name="product" defaultValue={prefilledProduct} className={inputClass}>
          {PRODUCT_KEYS.map((key) => (
            <option key={key} value={productLabel(key)}>
              {productLabel(key)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium">
          {t('message')} <span className="text-brand-red">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={inputClass}
          placeholder={t('messagePlaceholder')}
          defaultValue={buildPrefilledMessage()}
        />
      </div>

      {status === 'error' && (
        <div role="alert" className="flex items-start gap-3 rounded-sm border border-brand-red/40 bg-brand-red/10 p-4 text-sm">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-brand-red" />
          <p>
            {t('errorText')}{' '}
            <a href="mailto:info@carpetz.be" className="font-medium underline">
              info@carpetz.be
            </a>{' '}
            {t('errorOr')}{' '}
            <a href="tel:+32488236581" className="font-medium whitespace-nowrap underline">
              +32 488 23 65 81
            </a>
            .
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-sm font-medium uppercase tracking-wide text-accent-foreground transition-all hover:brightness-105 disabled:opacity-70 sm:w-auto"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t('sending')}
          </>
        ) : (
          t('submit')
        )}
      </button>
      <p className="text-xs text-muted-foreground">{t('privacyNote')}</p>
    </form>
  )
}
