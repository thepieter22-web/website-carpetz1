import type { Metadata } from 'next'
import Image from 'next/image'
import { Target, Handshake, Leaf, Award } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { QuoteBand } from '@/components/quote-band'

export const metadata: Metadata = {
  title: 'Over ons',
  description:
    'Carpetz is specialist in tapijt op maat: logomatten, geprint tapijt, event tapijt en rode lopers. Vakmanschap, moderne printtechnologie en persoonlijk advies in België & Nederland.',
  alternates: { canonical: '/over-ons' },
  openGraph: {
    title: 'Over Carpetz | Specialist in tapijt op maat',
    description:
      'Carpetz combineert vakmanschap met moderne printtechnologie voor logomatten, geprint tapijt en event tapijt op maat.',
    images: [{ url: '/images/craftsmanship.png', width: 1200, height: 630, alt: 'Vakmanschap bij Carpetz' }],
  },
}

const values = [
  { icon: Target, title: 'Merkgericht', text: 'Elk project vertrekt vanuit jouw merk en doelen.' },
  { icon: Handshake, title: 'Persoonlijk', text: 'Eén vast aanspreekpunt van ontwerp tot levering.' },
  { icon: Award, title: 'Kwaliteit', text: 'Vakmanschap en scherpe print in elk detail.' },
  { icon: Leaf, title: 'Duurzaam', text: 'Slijtvaste, recycleerbare materialen als standaard.' },
]

export default function OverOnsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Over ons"
          title="Specialist in tapijt op maat"
          intro="Carpetz helpt bedrijven, retailers, hotels en organisatoren om hun merk tot leven te brengen met logomatten, geprint tapijt, event tapijt en rode lopers op maat."
          image="/images/craftsmanship.png"
          imageAlt="Productie van geprint tapijt op maat bij Carpetz"
        />

        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance">
              Vakmanschap ontmoet moderne printtechnologie
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
              Carpetz ontstond uit een eenvoudige overtuiging: de vloer is een van de sterkste, maar
              meest onderschatte branddragers. Al meer dan vijftien jaar vertalen wij die overtuiging
              naar tapijt op maat dat merken versterkt. We combineren jarenlange ervaring in tapijt
              met de nieuwste printtechnologie, zodat we logomatten op maat, geprint tapijt en event
              tapijt kunnen leveren die zowel functioneel als visueel uitblinken.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
              Onze klanten waarderen vooral onze persoonlijke aanpak. Van het eerste ontwerp tot de
              uiteindelijke levering krijg je één vast aanspreekpunt dat met je meedenkt over
              materiaal, formaat, print en planning. Zo weet je zeker dat je branding tapijt precies
              doet wat het moet doen &mdash; indruk maken.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
            <Image
              src="/images/hotel-lobby.png"
              alt="Stijlvol tapijt op maat in een luxe hotellobby"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </section>

        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance">Waar we voor staan</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v) => (
                <div key={v.title} className="rounded-sm border border-border bg-card p-6">
                  <span className="inline-flex size-11 items-center justify-center rounded-sm bg-accent/15 text-accent">
                    <v.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <QuoteBand title="Werk samen met Carpetz" text="Benieuwd wat we voor jouw merk kunnen betekenen? Vraag vrijblijvend je offerte aan voor tapijt op maat." />
      </main>
      <SiteFooter />
    </>
  )
}