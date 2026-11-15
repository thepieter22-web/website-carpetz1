// Enkel gebruiken in API-routes (server): roept de Europese VIES-dienst aan.
import { OWN_VAT, hasValidVatFormat, type ViesResult } from "@/lib/vat";

const VIES_URL = "https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number";
const CACHE_TTL_MS = 10 * 60 * 1000;

// Korte cache per serverinstantie: de winkelwagen controleert live en de checkout
// controleert daarna opnieuw; zo vragen we VIES niet twee keer na elkaar hetzelfde.
// Enkel definitieve antwoorden (geldig/ongeldig) worden bewaard.
const cache = new Map<string, { result: ViesResult; expires: number }>();

/**
 * Controleert een btw-nummer bij de officiële Europese VIES-dienst.
 * Geeft nooit een fout: bij storing of time-out is de status "unavailable".
 */
export async function checkVies(country: string, number: string): Promise<ViesResult> {
  const vatNumber = `${country}${number}`;
  const checkedAt = new Date().toISOString();

  // Verkeerd formaat: zeker ongeldig, VIES hoeft niet gevraagd te worden.
  if (!hasValidVatFormat(country, number)) {
    return { status: "invalid", vatNumber, checkedAt };
  }

  const cached = cache.get(vatNumber);
  if (cached && cached.expires > Date.now()) return cached.result;

  try {
    const response = await fetch(VIES_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        countryCode: country,
        vatNumber: number,
        requesterMemberStateCode: OWN_VAT.country,
        requesterNumber: OWN_VAT.number,
      }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!response.ok) return { status: "unavailable", vatNumber, checkedAt };

    const data = await response.json();
    // Storing bij VIES of de lidstaat: { actionSucceed: false, errorWrappers: [...] }
    if (typeof data?.valid !== "boolean") {
      console.warn("VIES onbereikbaar:", JSON.stringify(data?.errorWrappers ?? data));
      return { status: "unavailable", vatNumber, checkedAt };
    }

    const clean = (value: unknown) =>
      typeof value === "string" && value.trim() && value.trim() !== "---" ? value.trim() : undefined;

    const result: ViesResult = {
      status: data.valid ? "valid" : "invalid",
      vatNumber,
      name: data.valid ? clean(data.name) : undefined,
      requestId: clean(data.requestIdentifier),
      checkedAt: clean(data.requestDate) ?? checkedAt,
    };
    cache.set(vatNumber, { result, expires: Date.now() + CACHE_TTL_MS });
    return result;
  } catch (error) {
    console.warn("VIES-controle mislukt:", error);
    return { status: "unavailable", vatNumber, checkedAt };
  }
}
