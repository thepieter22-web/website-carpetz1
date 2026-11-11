import { MatTypeRoute, matTypeMetadata } from '@/components/mat-type-route'

type Props = { params: { locale: string } }

export function generateMetadata({ params: { locale } }: Props) {
  return matTypeMetadata('green', locale, '/logomat/green')
}

export default function GreenLogomatPage({ params: { locale } }: Props) {
  return <MatTypeRoute subtype="green" locale={locale} />
}
