import { MatTypeRoute, matTypeMetadata } from '@/components/mat-type-route'

type Props = { params: { locale: string } }

export function generateMetadata({ params: { locale } }: Props) {
  return matTypeMetadata('grip', locale, '/logomat/grip')
}

export default function GripLogomatPage({ params: { locale } }: Props) {
  return <MatTypeRoute subtype="grip" locale={locale} />
}
