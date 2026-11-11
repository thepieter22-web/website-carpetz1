import { useFormatter } from 'next-intl'

/** Bedrag in euro, opgemaakt volgens de huidige taal (nl: "€ 17,50", fr: "17,50 €"). */
export function usePriceFormatter() {
  const format = useFormatter()
  return (amount: number, fractionDigits = 2) =>
    format.number(amount, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    })
}
