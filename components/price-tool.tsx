'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Brush, Calculator, LayoutGrid, Presentation, Sparkles } from 'lucide-react'
import { Cta } from '@/components/cta'
import { PrintedCarpetSimulator } from '@/components/printed-carpet-simulator'
import { usePriceFormatter } from '@/lib/format'
import { cn } from '@/lib/utils'
import { RUNNER_PRICE_PER_M2 } from '@/lib/event-pricing'

/**
 * Prijscalculator (/prijs-berekenen). Hergebruikt enkel bestaande prijslogica:
 * - geprint tapijt: PrintedCarpetSimulator,
 * - event loper: vaste richtprijs per m² (RUNNER_PRICE_PER_M2).
 * Logomatten staan hier bewust niet: die hebben hun eigen configurator met prijs op /logomat.
 * Productkeuze voorinvullen met ?product=geprint-tapijt|loper|eventvloer|beurstapijt.
 */
export const PRICE_PRODUCTS = ['geprint-tapijt', 'loper', 'eventvloer', 'beurstapijt'] as const
export type PriceProduct = (typeof PRICE_PRODUCTS)[number]

const PRODUCT_ICONS: Record<PriceProduct, typeof Calculator> = {
  'geprint-tapijt': Brush,
  loper: Sparkles,
  eventvloer: LayoutGrid,
  beurstapijt: Presentation,
}

const isProduct = (value: string | null): value is PriceProduct =>
  !!value && (PRICE_PRODUCTS as readonly string[]).includes(value)

/** Contactformulier voorinvullen (zie components/contact-form.tsx). */
function contactHref(params: Record<string, string | number>) {
  const query = Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
  return { pathname: '/contact', query }
}

const inputClass =
  'min-h-12 w-full rounded-sm border border-border bg-background px-3 text-sm pointer-coarse:text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30'

function choiceClass(active: boolean) {
  return cn(
    'min-h-12 rounded-sm border px-4 py-2.5 text-sm font-medium transition-all',
    active ? 'border-accent bg-accent/10 text-foreground' : 'border-border hover:border-accent/50',
  )
}

export function PriceTool() {
  const t = useTranslations('PriceTool')
  const searchParams = useSearchParams()
  const initial = searchParams.get('product')
  const [product, setProduct] = useState<PriceProduct>(isProduct(initial) ? initial : 'geprint-tapijt')

  const choose = (next: PriceProduct) => {
    setProduct(next)
    // URL bijwerken zodat de keuze deelbaar is (de canonical blijft zonder parameters).
    const params = new URLSearchParams(window.location.search)
    params.set('product', next)
    window.history.replaceState(null, '', `${window.location.pathname}?${params}`)
  }

  return (
    <div>
      <div role="tablist" aria-label={t('productLabel')} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PRICE_PRODUCTS.map((id) => {
          const Icon = PRODUCT_ICONS[id]
          const active = product === id
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => choose(id)}
              className={cn(
                'flex min-h-14 items-center gap-2.5 rounded-sm border px-3 py-3 text-left text-sm font-semibold transition-all',
                active ? 'border-accent bg-accent text-accent-foreground' : 'border-border bg-card hover:border-accent/60',
              )}
            >
              <Icon className="size-5 shrink-0" />
              {t(`products.${id}`)}
            </button>
          )
        })}
      </div>

      <div role="tabpanel" className="mt-8">
        {product === 'geprint-tapijt' && <PrintedCarpetSimulator />}
        {product === 'loper' && <RunnerPrice />}
        {(product === 'eventvloer' || product === 'beurstapijt') && (
          <OnRequest product={product} onShowPrinted={() => choose('geprint-tapijt')} />
        )}
      </div>
    </div>
  )
}

/** Samenvatting rechts: regels + indicatieve prijs + offerteknop. */
function ResultCard({
  rows,
  totalLabel,
  total,
  note,
  quoteHref,
  extra,
}: {
  rows: { label: string; value: string }[]
  totalLabel: string
  total: string
  note: string
  quoteHref: React.ComponentProps<typeof Cta>['href']
  extra?: React.ReactNode
}) {
  const t = useTranslations('PriceTool')
  return (
    <div className="rounded-sm border border-border bg-card p-6 lg:sticky lg:top-24">
      <dl className="space-y-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 text-muted-foreground">
            <dt>{row.label}</dt>
            <dd className="text-right font-medium text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-end justify-between gap-4 border-t border-border pt-4">
        <span className="font-semibold">{totalLabel}</span>
        <span className="text-2xl font-bold text-accent">{total}</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>
      <div className="mt-6 flex flex-col gap-3">
        {extra}
        <Cta href={quoteHref} variant={extra ? 'outline' : 'accent'} className="w-full">
          {t('quoteWithData')}
        </Cta>
      </div>
    </div>
  )
}

// TODO: richtprijs event loper (€ 17,50/m²) nog laten bevestigen; staat in lib/event-pricing.ts.
function RunnerPrice() {
  const t = useTranslations('PriceTool.runner')
  const price = usePriceFormatter()
  const [length, setLength] = useState(5)
  const [width, setWidth] = useState(1)

  const valid = (n: number) => Number.isFinite(n) && n > 0
  const area = valid(length) && valid(width) ? length * width : 0
  const total = useMemo(() => area * RUNNER_PRICE_PER_M2, [area])

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div className="order-2 min-w-0 lg:order-1">
        <div className="grid grid-cols-2 gap-3 sm:max-w-md">
          {([
            ['length', length, setLength],
            ['width', width, setWidth],
          ] as const).map(([key, value, set]) => (
            <label key={key} className="text-sm">
              <span className="mb-1 block text-sm font-semibold uppercase tracking-widest text-accent">{t(key)}</span>
              <input
                type="number"
                inputMode="decimal"
                min={0.5}
                step={0.5}
                value={value}
                onChange={(e) => set(Number(e.target.value))}
                className={inputClass}
              />
            </label>
          ))}
        </div>
        <p className="mt-4 max-w-md text-sm text-muted-foreground">{t('hint')}</p>
      </div>
      <div className="order-1 lg:order-2">
        <ResultCard
          rows={[
            { label: t('dimensions'), value: `${length} m × ${width} m` },
            { label: t('area'), value: `${area.toLocaleString(undefined, { maximumFractionDigits: 2 })} m²` },
            { label: t('perM2'), value: price(RUNNER_PRICE_PER_M2) },
          ]}
          totalLabel={t('total')}
          total={price(total)}
          note={t('note')}
          quoteHref={contactHref({ product: 'loper', lengte: length, breedte: width, prijsindicatie: total.toFixed(2) })}
        />
      </div>
    </div>
  )
}

// TODO: prijslogica voor eventvloer en beurstapijt (nu: prijs op aanvraag).
function OnRequest({ product, onShowPrinted }: { product: 'eventvloer' | 'beurstapijt'; onShowPrinted: () => void }) {
  const t = useTranslations('PriceTool.onRequest')
  return (
    <div className="max-w-2xl rounded-sm border border-border bg-card p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-semibold">{t('title')}</h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
        {t(product === 'eventvloer' ? 'floor' : 'stand')}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t('hint')}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Cta href={contactHref({ product })} variant="accent">
          {t('quote')}
        </Cta>
        <button
          type="button"
          onClick={onShowPrinted}
          className="inline-flex min-h-12 items-center justify-center rounded-sm border border-foreground/25 px-6 py-3 text-sm font-medium uppercase tracking-wide transition-colors hover:bg-foreground hover:text-background"
        >
          {t('toPrinted')}
        </button>
      </div>
    </div>
  )
}
