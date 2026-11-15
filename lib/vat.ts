// Btw-regels voor de checkout (gedeeld door winkelwagen, checkout-API en webhook).
//
// - Levering in België: altijd 21% Belgische btw.
// - Levering in een ander EU-land (nu enkel NL) aan een bedrijf met een geldig,
//   via VIES gecontroleerd btw-nummer uit dat land: 0% (intracommunautaire levering).
// - Anders (particulier, geen/ongeldig nummer, VIES onbereikbaar): 21%.

/** Landen waar we leveren. Volgorde = volgorde in de keuzelijst. */
export const DELIVERY_COUNTRIES = ["BE", "NL"] as const;
export type CountryCode = (typeof DELIVERY_COUNTRIES)[number];

export const HOME_COUNTRY: CountryCode = "BE";
export const STANDARD_VAT_RATE = 0.21;

/** Ons eigen btw-nummer: als aanvrager bij VIES levert dit een raadplegingsnummer op (bewijs). */
export const OWN_VAT = { country: "BE", number: "0726661444" } as const;

/** Wettelijke vermelding op factuur en mails bij 0%. */
export const INTRA_COMMUNITY_NOTE =
  "Vrijgesteld van btw op grond van art. 39bis WBTW – intracommunautaire levering";

/** Billit-ventilatiecode voor intracommunautaire levering van goederen. */
export const BILLIT_VENTILATION_INTRA_COMMUNITY = "51";

export function isCountryCode(value: unknown): value is CountryCode {
  return typeof value === "string" && (DELIVERY_COUNTRIES as readonly string[]).includes(value);
}

/** Formaat per land (zonder landprefix). */
const VAT_FORMATS: Record<CountryCode, RegExp> = {
  BE: /^[01]\d{9}$/,
  NL: /^\d{9}B\d{2}$/,
};

/**
 * Maakt een ingevuld btw-nummer netjes: hoofdletters, zonder spaties/punten.
 * Zonder landprefix wordt het land van de klant gebruikt.
 */
export function normalizeVatNumber(input: string, fallbackCountry: CountryCode) {
  const cleaned = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const hasPrefix = /^[A-Z]{2}/.test(cleaned);
  const country = hasPrefix ? cleaned.slice(0, 2) : fallbackCountry;
  const number = hasPrefix ? cleaned.slice(2) : cleaned;
  return { country, number, full: `${country}${number}` };
}

export function hasValidVatFormat(country: string, number: string) {
  return isCountryCode(country) && VAT_FORMATS[country].test(number);
}

export type ViesStatus = "valid" | "invalid" | "unavailable";

export interface ViesResult {
  status: ViesStatus;
  /** Genormaliseerd nummer incl. landprefix, bv. NL123456789B01. */
  vatNumber: string;
  /** Naam volgens VIES (kan ontbreken). */
  name?: string;
  /** Raadplegingsnummer van VIES (bewijs voor de boekhouding). */
  requestId?: string;
  /** Tijdstip van de controle (ISO). */
  checkedAt: string;
}

export type VatTreatment = "domestic" | "intra_community";

export interface VatDecision {
  treatment: VatTreatment;
  rate: number;
}

/**
 * Bepaalt het btw-tarief. Het LEVERINGSLAND beslist: de vrijstelling geldt enkel
 * als de goederen België verlaten, naar een bedrijf dat in dat land btw-plichtig is.
 */
export function determineVat({
  deliveryCountry,
  isBusiness,
  vies,
}: {
  deliveryCountry: CountryCode;
  isBusiness: boolean;
  vies?: Pick<ViesResult, "status" | "vatNumber"> | null;
}): VatDecision {
  const qualifies =
    deliveryCountry !== HOME_COUNTRY &&
    isBusiness &&
    vies?.status === "valid" &&
    vies.vatNumber.startsWith(deliveryCountry);

  return qualifies
    ? { treatment: "intra_community", rate: 0 }
    : { treatment: "domestic", rate: STANDARD_VAT_RATE };
}

/** Moet dit btw-nummer gecontroleerd worden (kan het tot 0% leiden)? */
export function needsViesCheck(deliveryCountry: CountryCode, isBusiness: boolean) {
  return isBusiness && deliveryCountry !== HOME_COUNTRY;
}
