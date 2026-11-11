import { MatTypeRoute, matTypeMetadata } from '@/components/mat-type-route'

type Props = { params: { locale: string } }

export function generateMetadata({ params: { locale } }: Props) {
  return matTypeMetadata('studio', locale, '/logomat/studio')
}

export default function StudioLogomatPage({ params: { locale } }: Props) {
  return <MatTypeRoute subtype="studio" locale={locale} />
}
