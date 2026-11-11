import {
  Recycle,
  ShieldCheck,
  Home,
  Flame,
  Zap,
  Droplet,
  BadgeCheck,
  Globe,
  Palette,
  Award,
  Sparkles,
  Brush,
  type LucideIcon,
} from "lucide-react"
import type { AbstractIntlMessages } from "next-intl"
import type { MatTypeFeature, MatTypeSpec } from "@/components/mat-type-page"

/**
 * Productdata van de logomatten.
 * Alle teksten staan in messages/{nl,fr}.json onder "MatTypes"; hier staan enkel
 * de taalonafhankelijke zaken (foto's en iconen).
 */

export const INDOOR_SUBTYPES = ["go", "green", "studio", "pro"] as const
export const OUTDOOR_SUBTYPES = ["grip", "scrape"] as const
export type IndoorSubtype = (typeof INDOOR_SUBTYPES)[number]
export type OutdoorSubtype = (typeof OUTDOOR_SUBTYPES)[number]
export type MatSubtype = IndoorSubtype | OutdoorSubtype

const HERO_IMAGES: Record<MatSubtype, string> = {
  go: "/images/logomat-CarpetzGo-detail.webp",
  green: "/images/logomat-CarpetzGreen-detail.webp",
  studio: "/images/logomat-CarpetzStudio-detail.jpg",
  pro: "/images/logomat-CarpetzPro-detail.webp",
  grip: "/images/logomat-printgrass-detail.webp",
  scrape: "/images/logomat-signature-detail.webp",
}

/** Icoon per eigenschap (sleutel uit messages/*.json → MatTypes.<type>.features). */
const FEATURE_ICONS: Record<string, LucideIcon> = {
  material: Recycle,
  yarn: Recycle,
  pile: Recycle,
  backing: ShieldCheck,
  usage: Home,
  application: Home,
  fire: Flame,
  underfloorHeating: Zap,
  slipResistance: Zap,
  pileWeight: Zap,
  scraping: Zap,
  moisture: Droplet,
  drainage: Droplet,
  weatherproof: Droplet,
  colorfastness: BadgeCheck,
  antistatic: BadgeCheck,
  staticTested: BadgeCheck,
  origin: Globe,
  maxSize: Globe,
  washable: Sparkles,
  colors: Palette,
  edgeFinish: Award,
  warranty: Award,
  design: Brush,
}

type LabelValue = { label: string; value: string }

/** Vorm van één logomat in messages/*.json. */
export interface MatTypeMessages {
  title: string
  tagline: string
  description: string
  whyChoose: { text: string; idealFor: string[] }
  features: Record<string, LabelValue>
  specs: Record<string, LabelValue>
}

export interface MatTypeEntry {
  title: string
  tagline: string
  description: string
  heroImage: string
  features: MatTypeFeature[]
  specs: MatTypeSpec[]
  /** Specificaties per sleutel, handig voor de vergelijkingstabel. */
  specsByKey: Record<string, string>
  featuresByKey: Record<string, string>
  whyChoose: { text: string; idealFor: string[] }
}

export function buildMatType(subtype: MatSubtype, messages: MatTypeMessages): MatTypeEntry {
  const features = Object.entries(messages.features).map(([key, f]) => ({
    icon: FEATURE_ICONS[key] ?? BadgeCheck,
    label: f.label,
    value: f.value,
  }))
  const specs = Object.values(messages.specs)

  return {
    title: messages.title,
    tagline: messages.tagline,
    description: messages.description,
    heroImage: HERO_IMAGES[subtype],
    features,
    specs,
    specsByKey: Object.fromEntries(Object.entries(messages.specs).map(([k, s]) => [k, s.value])),
    featuresByKey: Object.fromEntries(Object.entries(messages.features).map(([k, f]) => [k, f.value])),
    whyChoose: messages.whyChoose,
  }
}

/** Teksten van één logomat uit de berichten van useMessages() / await getMessages(). */
export function getMatTypeMessages(messages: AbstractIntlMessages, subtype: MatSubtype) {
  return (messages.MatTypes as unknown as Record<MatSubtype, MatTypeMessages>)[subtype]
}

/**
 * Alle logomatten in de huidige taal.
 * Gebruik: getMatTypes(useMessages()) of getMatTypes(await getMessages()).
 */
export function getMatTypes(messages: AbstractIntlMessages) {
  const all = messages.MatTypes as unknown as Record<MatSubtype, MatTypeMessages>
  return Object.fromEntries(
    [...INDOOR_SUBTYPES, ...OUTDOOR_SUBTYPES].map((s) => [s, buildMatType(s, all[s])])
  ) as Record<MatSubtype, MatTypeEntry>
}
