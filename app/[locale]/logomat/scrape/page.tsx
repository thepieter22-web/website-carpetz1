import { MatTypeRoute, matTypeMetadata } from '@/components/mat-type-route'

type Props = { params: { locale: string } }

export function generateMetadata({ params: { locale } }: Props) {
  return matTypeMetadata('scrape', locale, '/logomat/scrape')
}

export default function ScrapeLogomatPage({ params: { locale } }: Props) {
  return <MatTypeRoute subtype="scrape" locale={locale} />
}
