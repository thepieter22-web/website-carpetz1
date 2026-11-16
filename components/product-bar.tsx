import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Cta } from '@/components/cta'
import type { PriceProduct } from '@/components/price-tool'

const linkClass = 'font-medium text-foreground underline decoration-accent underline-offset-4 hover:text-accent'

/**
 * Strook onder de hero van een productpagina:
 * - `scope`: één zin die het verschil uitlegt tussen logomat / geprint tapijt / event tapijt (enkel op hoofdpagina's),
 * - `priceProduct`: "vanaf"-prijs + knop naar de prijscalculator met het juiste product.
 */
export function ProductBar({
  scope,
  priceProduct,
}: {
  scope?: 'logomat' | 'printed' | 'event'
  priceProduct?: PriceProduct
}) {
  const t = useTranslations('ProductBar')

  return (
    <section className="border-b border-border bg-secondary/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        {scope && (
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground text-pretty">
            {t.rich(`scope.${scope}`, {
              logomat: (chunks) => (
                <Link href="/logomat#configurator" className={linkClass}>
                  {chunks}
                </Link>
              ),
              printed: (chunks) => (
                <Link href="/geprint-tapijt" className={linkClass}>
                  {chunks}
                </Link>
              ),
              event: (chunks) => (
                <Link href="/event-tapijt" className={linkClass}>
                  {chunks}
                </Link>
              ),
            })}
          </p>
        )}
        {priceProduct && (
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center lg:ml-auto">
            <p className="text-sm font-semibold">{t('from')}</p>
            <Cta
              href={{
                pathname: '/prijs-berekenen',
                query: { product: priceProduct },
              }}
              variant="outline"
            >
              {t('calculate')}
            </Cta>
          </div>
        )}
      </div>
    </section>
  )
}
