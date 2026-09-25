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
  whyChoose: {
    text: string
    idealFor: string[]
  }
}

export const MAT_TYPE_DATA: Record<"go" | "green" | "studio" | "pro", MatTypeEntry> = {
    go: {
    title: "Carpetz Go",
    tagline: "Instapmodel",
    description:
      "Carpetz Go is onze toegankelijke logomat voor wie een betrouwbare, scherp bedrukte mat zoekt zonder in te leveren op basiskwaliteit. Ideaal voor bedrijven die met een beperkt budget toch representatief willen binnenkomen.",
    heroImage: "/images/logomat-CarpetzGo-detail.webp",
    whyChoose: {
      text: "Carpetz Go is de slimme keuze wanneer je snel en betaalbaar een professionele eerste indruk wil maken, zonder in te leveren op basiskwaliteit. Perfect voor bedrijven die hun eerste logomat testen, een beperkt budget hebben, of een mat nodig hebben voor een tijdelijke locatie of pop-up.",
      idealFor: ["Starters & kmo's", "Pop-upstores", "Tijdelijke locaties", "Beperkt budget"],
    },
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
        whyChoose: {
      text: "Kiest je organisatie bewust voor duurzaamheid? Carpetz Green is gemaakt met minstens 75% gerecycleerd materiaal, zonder concessies op slipweerstand of levensduur. Zo communiceer je je merk én je waarden vanaf de allereerste stap in je zaak.",
      idealFor: ["Bedrijven met MVO-beleid", "Groene retailers", "Organisaties die duurzaamheid uitstralen"],
    },
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
        whyChoose: {
      text: "Wil je meer dan een logo — een echte blikvanger? Carpetz Studio biedt de scherpste, meest kleurrijke print in ons gamma met 100 standaardkleuren, ideaal voor fotorealistische beelden of complexe designs die er tot in het kleinste detail perfect moeten uitzien.",
      idealFor: ["Flagshipstores", "Hotels & horeca", "Campagnes met veel kleur of detail"],
    },
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
        whyChoose: {
      text: "Voor ingangen die dag na dag intensief gebruikt worden, is Carpetz Pro de betrouwbare werkkracht. Zwaarder, dikker en met de langste garantie van ons gamma (5 jaar) — gebouwd om jarenlang representatief te blijven, ook bij hoge voetgangersaantallen.",
      idealFor: ["Kantoren met veel doorstroom", "Drukke retail-ingangen", "Langdurige inzet"],
    },
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

export const MAT_TYPE_DATA_OUTDOOR: Record<"grip" | "scrape", MatTypeEntry> = {
  grip: {
    title: "Carpetz Grip",
    tagline: "Weerbestendig",
    description:
      "Carpetz Grip is onze standaard buitenmat, gebouwd om jaar na jaar weerstand te bieden aan regen, wind en intensief voetgangersverkeer. Robuust monofilament materiaal zorgt voor duurzame, scherpe print ook onder extreme omstandigheden.",
    heroImage: "/images/logomat-printgrass-detail.webp",
    whyChoose: {
      text: "Voor ingangen, events of stands die blootstaan aan weer en wind is Carpetz Grip de betrouwbare keuze. Het monofilament materiaal is bestand tegen vocht en intensief gebruik, terwijl je logo scherp en herkenbaar blijft.",
      idealFor: ["Buiteningangen", "Events & beurzen", "Terrassen", "Alle weersomstandigheden"],
    },
    features: [
      { icon: ShieldCheck, label: "Rugmateriaal", value: "Phthalaatvrij nitrilrubber" },
      { icon: Recycle, label: "Pool", value: "100% monofilament PA6" },
      { icon: Home, label: "Gebruik", value: "Geschikt voor buiten" },
      { icon: Flame, label: "Brandgedrag", value: "EN13501-1 / Bfl-s1" },
      { icon: Zap, label: "Vloerverwarming", value: "Geschikt" },
      { icon: BadgeCheck, label: "Kleurvastheid", value: "Licht- en kleurecht" },
      { icon: Globe, label: "Herkomst", value: "Made in Europe" },
      { icon: Droplet, label: "Weerbestendig", value: "Regen & vocht" },
    ],
    specs: [
      { label: "Gewicht", value: "3,6 kg/m²" },
      { label: "Randen", value: "0 of 20 mm" },
      { label: "Rugmateriaal", value: "100% phthalaatvrij nitrilrubber" },
      { label: "Rugdikte", value: "1,8 mm" },
      { label: "Pool", value: "100% monofilament PA6" },
      { label: "Pool gewicht", value: "1420 g/m²" },
      { label: "Pool hoogte", value: "± 6 mm" },
      { label: "Mat hoogte", value: "± 8 mm" },
      { label: "Brandgedrag", value: "EN13501-1 / Bfl-s1" },
      { label: "Geschikt voor", value: "Buitengebruik" },
    ],
  },
  scrape: {
    title: "Carpetz Scrape",
    tagline: "Superieure schrapwerking",
    description:
      "Carpetz Scrape combineert een unieke nylonvezelmix met een superieure schrapende werking tegen vuil en afval. Gemaakt uit ECONYL geregenereerd nylon, inzetbaar zowel binnen als buiten, met optionele afwateringsgaten voor extra vochtafvoer.",
    heroImage: "/images/logomat-signature-detail.webp",
    whyChoose: {
      text: "Wil je vuil en afval al bij de deur tegenhouden? Carpetz Scrape is ontworpen met een schurende vezelmix die grondig schraapt, terwijl de briljante kleurechtheid je logo of ontwerp jarenlang scherp houdt — zowel binnen als buiten inzetbaar.",
      idealFor: ["Drukke in- en uitgangen", "Horeca & retail", "Binnen & buiten", "Extra vuilafvoer nodig"],
    },
    features: [
      { icon: Recycle, label: "Garen", value: "ECONYL geregenereerd nylon" },
      { icon: ShieldCheck, label: "Rugmateriaal", value: "Nitrilrubber (34% gerecycleerd)" },
      { icon: Droplet, label: "Afwateringsgaten", value: "Optioneel, Ø 7mm" },
      { icon: Home, label: "Gebruik", value: "Binnen & buiten" },
      { icon: BadgeCheck, label: "Kleurechtheid", value: "Briljant & duurzaam" },
      { icon: Zap, label: "Schrapwerking", value: "Superieur tegen vuil" },
      { icon: Globe, label: "Wasbaar", value: "Volledig wasbaar" },
      { icon: Award, label: "Ontwerp", value: "Eigen ontwerpers, snelle doorlooptijd" },
    ],
    specs: [
      { label: "Garen", value: "ECONYL geregenereerd nylon, 1/8th gesneden pool" },
      { label: "Matgewicht", value: "3,9 kg/m²" },
      { label: "Onderlaag", value: "Non-woven gesponnen gebonden polyester" },
      { label: "Rugmateriaal", value: "100% nitrilrubber (34% postindustrieel gerecycleerd)" },
      { label: "Patroon", value: "Klauw" },
      { label: "Dikte", value: "3 mm" },
      { label: "Afwateringsgaten", value: "Ø 7mm (optioneel, tot 130×200cm)" },
      { label: "Randdikte", value: "2,5 mm" },
      { label: "Randbreedte", value: "20 mm" },
      { label: "Stapelgewicht", value: "715 g/m²" },
      { label: "Stapelhoogte", value: "7 mm" },
      { label: "Max. afmeting", value: "210×600cm (zonder afwateringsgaten)" },
    ],
  },
}
