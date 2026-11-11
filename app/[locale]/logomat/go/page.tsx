import { MatTypeRoute, matTypeMetadata } from '@/components/mat-type-route'

type Props = { params: { locale: string } }

export function generateMetadata({ params: { locale } }: Props) {
  return matTypeMetadata('go', locale, '/logomat/go')
}

export default function GoLogomatPage({ params: { locale } }: Props) {
  return <MatTypeRoute subtype="go" locale={locale} />
}
