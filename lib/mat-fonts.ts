// Lettertypes voor eigen tekst op de logomat (stap 5 van de configurator).
// Via next/font: zelf gehost (geen verzoeken naar Google, AVG-vriendelijk) en
// zonder preload, zodat ze pas downloaden wanneer de klant de tekststap opent.
import {
  Abril_Fatface,
  Anton,
  Archivo_Black,
  Bebas_Neue,
  Cinzel,
  Dancing_Script,
  Great_Vibes,
  Lato,
  Lobster,
  Lora,
  Merriweather,
  Montserrat,
  Orbitron,
  Oswald,
  Pacifico,
  Permanent_Marker,
  Playfair_Display,
  Poppins,
  Raleway,
  Righteous,
  Roboto,
  Satisfy,
} from "next/font/google"

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false })
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false })
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false })
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false })
const raleway = Raleway({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false })
const oswald = Oswald({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false })
const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: "400", display: "swap", preload: false })
const anton = Anton({ subsets: ["latin"], weight: "400", display: "swap", preload: false })
const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: "400", display: "swap", preload: false })
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false })
const merriweather = Merriweather({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false })
const lora = Lora({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false })
const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false })
const abrilFatface = Abril_Fatface({ subsets: ["latin"], weight: "400", display: "swap", preload: false })
const dancingScript = Dancing_Script({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false })
const pacifico = Pacifico({ subsets: ["latin"], weight: "400", display: "swap", preload: false })
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", display: "swap", preload: false })
const lobster = Lobster({ subsets: ["latin"], weight: "400", display: "swap", preload: false })
const satisfy = Satisfy({ subsets: ["latin"], weight: "400", display: "swap", preload: false })
const permanentMarker = Permanent_Marker({ subsets: ["latin"], weight: "400", display: "swap", preload: false })
const righteous = Righteous({ subsets: ["latin"], weight: "400", display: "swap", preload: false })
const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false })

export type FontCategory = "sans" | "serif" | "script" | "display"

export interface MatFont {
  id: string
  /** Naam van het lettertype (merknaam, niet vertalen). */
  label: string
  category: FontCategory
  /** CSS font-family (ook bruikbaar op canvas). */
  family: string
  /** Heeft een vette variant. */
  hasBold: boolean
}

const font = (
  id: string,
  label: string,
  category: FontCategory,
  loaded: { style: { fontFamily: string } },
  hasBold: boolean
): MatFont => ({ id, label, category, family: loaded.style.fontFamily, hasBold })

export const MAT_FONTS: readonly MatFont[] = [
  font("montserrat", "Montserrat", "sans", montserrat, true),
  font("poppins", "Poppins", "sans", poppins, true),
  font("roboto", "Roboto", "sans", roboto, true),
  font("lato", "Lato", "sans", lato, true),
  font("raleway", "Raleway", "sans", raleway, true),
  font("oswald", "Oswald", "sans", oswald, true),
  font("bebas-neue", "Bebas Neue", "sans", bebasNeue, false),
  font("anton", "Anton", "sans", anton, false),
  font("archivo-black", "Archivo Black", "sans", archivoBlack, false),
  font("playfair", "Playfair Display", "serif", playfair, true),
  font("merriweather", "Merriweather", "serif", merriweather, true),
  font("lora", "Lora", "serif", lora, true),
  font("cinzel", "Cinzel", "serif", cinzel, true),
  font("abril-fatface", "Abril Fatface", "serif", abrilFatface, false),
  font("dancing-script", "Dancing Script", "script", dancingScript, true),
  font("pacifico", "Pacifico", "script", pacifico, false),
  font("great-vibes", "Great Vibes", "script", greatVibes, false),
  font("lobster", "Lobster", "script", lobster, false),
  font("satisfy", "Satisfy", "script", satisfy, false),
  font("permanent-marker", "Permanent Marker", "display", permanentMarker, false),
  font("righteous", "Righteous", "display", righteous, false),
  font("orbitron", "Orbitron", "display", orbitron, true),
]

export const FONT_CATEGORIES: readonly FontCategory[] = ["sans", "serif", "script", "display"]

export const DEFAULT_FONT_ID = "montserrat"

export function getMatFont(id: string): MatFont {
  return MAT_FONTS.find((f) => f.id === id) ?? MAT_FONTS[0]
}

/** CSS/canvas font-shorthand voor een tekstblok. */
export function canvasFont(fontId: string, bold: boolean, sizePx: number) {
  const f = getMatFont(fontId)
  return `${bold && f.hasBold ? 700 : 400} ${sizePx}px ${f.family}`
}
