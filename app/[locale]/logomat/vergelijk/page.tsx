import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { MatComparisonTable } from '@/components/mat-comparison-table'
import { QuoteBand } from '@/components/quote-band'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Vergelijk onze logomatten — Go, Green, Studio, Pro, Grip & Scrape',
  description:
    'Vergelijk alle Carpetz logomatten op materiaal, gewicht en toepassing. Vind snel de juiste kwaliteit voor jouw indoor of outdoor logomat.',
  alternates: { canonical: '/logomat/vergelijk' },
}

export default function VergelijkLogomattenPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Logomatten"
          title="Vergelijk onze logomatten"
          intro="Elk type logomat heeft zijn eigen sterktes. Vergelijk materiaal, gewicht en toepassing en vind snel de kwaliteit die bij jouw situatie past."
          image="/images/logomat-winkel-entree.webp"
          imageAlt="Overzicht van Carpetz logomatten"
        />

        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <MatComparisonTable />

            <div className="mt-12 text-center">
              <Link
                href="/logomat#configurator"
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
              >
                Start de configurator
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        <QuoteBand
          title="Nog twijfels?"
          text="Neem contact op en we helpen je graag de juiste logomat te kiezen voor jouw situatie."
        />
      </main>
      <SiteFooter />
    </>
  )
}
