import { MatTypeRoute, matTypeMetadata } from '@/components/mat-type-route'

type Props = { params: { locale: string } }

export function generateMetadata({ params: { locale } }: Props) {
  return matTypeMetadata('pro', locale, '/logomat/studio/pro')
}

export default function ProLogomatPage({ params: { locale } }: Props) {
  return <MatTypeRoute subtype="pro" locale={locale} />
}
