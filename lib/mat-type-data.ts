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
} from "lucide-react"
import type { MatTypeFeature, MatTypeSpec } from "@/components/mat-type-page"

export interface MatTypeEntry {
  title: string
  tagline: string
  description: string
  heroImage: string
  features: MatTypeFeature[]
  specs: MatTypeSpec[]
}

export const MAT_TYPE_DATA: Record<"go" | "green" | "studio" | "pro", MatTypeEntry> = {
  go: {
    title: "Carpetz Go",
    tagline: "Instapmodel",
    description:
      "Carpetz Go is onze toegankelijke logomat voor wie een betrouwbare, scherp bedrukte mat zoekt zonder in te leveren op basiskwaliteit. Ideaal voor bedrijven die met een beperkt budget toch representatief willen binnenkomen.",
    heroImage: "/images/logomat-CarpetzGo-detail.webp",
    features: [
      { icon: Recycle, label: "Materiaal", value: "Min. 75% gerecycleerd nylon" },
      { icon: ShieldCheck, label: "Rugmateriaal", value: "Phthalaatvrij nitrilrubber" },
      { icon: Home, label: "Gebruik", value: "Indoor" },
      { icon: Flame, label: "Brandgedrag", value: "EN13501-1 / Cfl-s1" },
      { icon: Zap, label: "Vloerverwarming", value: "Geschikt" },
      { icon: Droplet, label: "Vochtabsorptie", value: "2 – 3 l/m²" },
      { icon: BadgeCheck, label: "Kleurvastheid", value: "Licht- en kleurecht" },
      { icon: Globe, label: "Herkomst", value: "Made in Europe" },
    ],
    specs: [
      { label: "Gewicht", value: "1,9 kg/m²" },
      { label: "Randen", value: "0 of 10 mm" },
      { label: "Rugmateriaal", value: "100% phthalaatvrij nitrilrubber" },
      { label: "Rugdikte", value: "0,9 mm" },
      { label: "Randdikte", value: "1,9 mm" },
      { label: "Vuil absorptie", value: "470 g/m²" },
      { label: "Vocht absorptie", value: "2 – 3 l/m²" },
      { label: "Pool", value: "High-Twist Nylon PA 6.6 (min. 75% gerecycleerd)" },
      { label: "Pool gewicht", value: "630 g/m²" },
      { label: "Pool hoogte", value: "± 6 mm" },
      { label: "Mat hoogte", value: "± 7 mm" },
      { label: "Brandgedrag", value: "EN13501-1 / Cfl-s1" },
    ],
  },
  green: {
    title: "Carpetz Green",
    tagline: "Duurzaam",
    description:
      "Carpetz Green combineert een lage milieu-impact met stevige prestaties. Gemaakt uit minstens 75% gerecycleerd materiaal, zonder in te leveren op slipweerstand of duurzaamheid.",
    heroImage: "/images/logomat-CarpetzGreen-detail.webp",
    features: [
      { icon: Recycle, label: "Materiaal", value: "Min. 75% gerecycleerd nylon" },
      { icon: ShieldCheck, label: "Rugmateriaal", value: "Phthalaatvrij nitrilrubber" },
      { icon: Zap, label: "Slipweerstand", value: "NFSI High-Traction" },
      { icon: BadgeCheck, label: "Antistatisch", value: "EN14041" },
      { icon: Flame, label: "Brandgedrag", value: "EN13501-1 / Cfl-s1" },
      { icon: Home, label: "Vloerverwarming", value: "Geschikt" },
      { icon: Droplet, label: "Vochtabsorptie", value: "3 – 4 l/m²" },
      { icon: Globe, label: "Herkomst", value: "Made in Europe" },
    ],
    specs: [
      { label: "Gewicht", value: "2,43 kg/m²" },
      { label: "Randen", value: "20 mm" },
      { label: "Rugmateriaal", value: "100% phthalaatvrij nitrilrubber" },
      { label: "Rugdikte", value: "1,4 mm" },
      { label: "Randdikte", value: "2,4 mm" },
      { label: "Vuil absorptie", value: "600 g/m²" },
      { label: "Vocht absorptie", value: "3 – 4 l/m²" },
      { label: "Pool", value: "High-Twist Nylon PA 6.6 (min. 75% gerecycleerd)" },
      { label: "Pool gewicht", value: "730 g/m²" },
      { label: "Pool hoogte", value: "± 8 mm" },
      { label: "Mat hoogte", value: "± 9 mm" },
      { label: "Slipweerstand", value: "NFSI High-Traction" },
      { label: "Brandgedrag", value: "EN13501-1 / Cfl-s1" },
    ],
  },
  studio: {
    title: "Carpetz Studio",
    tagline: "Mooiste printkwaliteit",
    description:
      "Carpetz Studio staat voor de scherpste, meest kleurrijke print in ons gamma. Met 100 standaardkleuren en een hoge-definitie afdruk breng je zowel fotorealistische beelden als complexe logo's tot leven.",
    heroImage: "/images/logomat-CarpetzStudio-detail.jpg",
    features: [
      { icon: Palette, label: "Kleuren", value: "100 standaardkleuren" },
      { icon: Recycle, label: "Materiaal", value: "100% gerecycleerd PET" },
      { icon: ShieldCheck, label: "Rugmateriaal", value: "Nitrilrubber (34% gerecycleerd)" },
      { icon: BadgeCheck, label: "Statisch getest", value: "ISO 6356, -0,3 kVolt" },
      { icon: Flame, label: "Brandgedrag", value: "Cfl / s1" },
      { icon: Home, label: "Toepassing", value: "Lobby's, receptie, ingangen" },
      { icon: Award, label: "Randafwerking", value: "Versterkte rubberen rand" },
      { icon: Globe, label: "Max. afmeting", value: "200 × 550 cm" },
    ],
    specs: [
      { label: "Garen", value: "100% gerecycleerd, hittebestendig multifilament" },
      { label: "Garen gewicht", value: "935 g/m²" },
      { label: "Onderlaag", value: "Non-woven PET" },
      { label: "Rugmateriaal", value: "100% nitrilrubber (34% postindustrieel gerecycleerd)" },
      { label: "Rugdikte", value: "1,4 mm" },
      { label: "Randdikte", value: "2,5 mm" },
      { label: "Randbreedte", value: "2 cm" },
      { label: "Stapeldikte", value: "7 mm" },
      { label: "Totaalgewicht", value: "2935 g/m²" },
      { label: "Kleuren", value: "100 standaardkleuren" },
      { label: "Brandgedrag", value: "Cfl / s1 (EN13501-1)" },
      { label: "Max. afmeting", value: "200 × 550 cm" },
    ],
  },
  pro: {
    title: "Carpetz Pro",
    tagline: "Hoogste prestaties",
    description:
      "Carpetz Pro is onze premium logomat voor intensief gebruik. Zwaarder, dikker en met de langste garantie van ons gamma — gebouwd voor drukke ingangen die dag na dag representatief moeten blijven.",
    heroImage: "/images/logomat-CarpetzPro-detail.webp",
    features: [
      { icon: ShieldCheck, label: "Rugmateriaal", value: "100% nitrilrubber" },
      { icon: Award, label: "Garantie", value: "5 jaar (2 jaar industriële was)" },
      { icon: Home, label: "Vloerverwarming", value: "Geschikt" },
      { icon: Droplet, label: "Vochtabsorptie", value: "4 – 5 l/m²" },
      { icon: BadgeCheck, label: "Kleurvastheid", value: "Licht- en kleurecht" },
      { icon: Globe, label: "Herkomst", value: "Made in Europe" },
      { icon: Recycle, label: "Pool", value: "100% high-twist nylon" },
      { icon: Zap, label: "Poolgewicht", value: "1050 g/m²" },
    ],
    specs: [
      { label: "Gewicht", value: "2,75 kg/m²" },
      { label: "Randen", value: "0 of 20 mm" },
      { label: "Rugmateriaal", value: "100% nitrilrubber" },
      { label: "Rugdikte", value: "1,4 mm" },
      { label: "Randdikte", value: "2,4 mm" },
      { label: "Vuil absorptie", value: "800 g/m²" },
      { label: "Vocht absorptie", value: "4 – 5 l/m²" },
      { label: "Pool", value: "100% High-Twist Nylon PA 6.6" },
      { label: "Pool gewicht", value: "1050 g/m²" },
      { label: "Pool hoogte", value: "± 9 mm" },
      { label: "Mat hoogte", value: "± 10 mm" },
      { label: "Garantie", value: "5 jaar (2 jaar bij industriële was)" },
    ],
  },
}
