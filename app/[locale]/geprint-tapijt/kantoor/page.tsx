import type { Metadata } from 'next'
import { unstable_setRequestLocale } from 'next-intl/server'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PrintedSectorPage, printedSectorMetadata } from '@/components/printed-sector'

type Props = { params: { locale: string } }

export function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  return printedSectorMetadata(locale, 'office')
}

export default function GeprintTapijtKantoorPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  return (
    <>
      <SiteHeader />
      <PrintedSectorPage sector="office" />
      <SiteFooter />
    </>
  )
}
