import type { Metadata } from 'next'
import { useMessages, useTranslations } from 'next-intl'
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { MatTypePage } from '@/components/mat-type-page'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { buildMatType, getMatTypeMessages, type MatSubtype } from '@/lib/mat-type-data'
import { localizedAlternates } from '@/lib/seo'

/**
 * Gedeelde opbouw van de productpagina's per logomat (/logomat/go, /logomat/grip, ...).
 * Elke route-pagina roept enkel deze twee functies aan.
 */

export async function matTypeMetadata(subtype: MatSubtype, locale: string, path: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta.matType' })
  const mat = getMatTypeMessages(await getMessages({ locale }), subtype)
  return {
    title: t('title', { name: mat.title }),
    description: mat.description,
    alternates: localizedAlternates(locale, path),
  }
}

export function MatTypeRoute({ subtype, locale }: { subtype: MatSubtype; locale: string }) {
  unstable_setRequestLocale(locale)
  const t = useTranslations('MatTypePage')
  const data = buildMatType(subtype, getMatTypeMessages(useMessages(), subtype))

  return (
    <>
      <SiteHeader />
      <MatTypePage
        eyebrow={t('eyebrow', { tagline: data.tagline.toUpperCase() })}
        title={data.title}
        description={data.description}
        heroImage={data.heroImage}
        heroAlt={t('heroAlt', { name: data.title })}
        configuratorType={subtype}
        features={data.features}
        specs={data.specs}
        references={[1, 2, 3, 4].map((n) => ({
          image: `/images/references/ref-${n}.jpg`,
          alt: t('referenceAlt', { number: n }),
        }))}
      />
      <SiteFooter />
    </>
  )
}
