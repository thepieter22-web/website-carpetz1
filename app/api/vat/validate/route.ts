import { NextResponse } from "next/server";
import { checkVies } from "@/lib/vies";
import { determineVat, isCountryCode, normalizeVatNumber } from "@/lib/vat";

/**
 * Live controle van een btw-nummer (winkelwagen).
 * Ter info voor de klant: de checkout controleert zelf opnieuw en vertrouwt dit antwoord niet.
 */
export async function POST(request: Request) {
  let body: { vatNumber?: unknown; country?: unknown; deliveryCountry?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag" }, { status: 400 });
  }

  const vatInput = typeof body.vatNumber === "string" ? body.vatNumber.slice(0, 40) : "";
  if (!vatInput.trim() || !isCountryCode(body.country) || !isCountryCode(body.deliveryCountry)) {
    return NextResponse.json({ error: "Ongeldige aanvraag" }, { status: 400 });
  }

  const { country, number } = normalizeVatNumber(vatInput, body.country);
  const vies = await checkVies(country, number);
  const vat = determineVat({ deliveryCountry: body.deliveryCountry, isBusiness: true, vies });

  return NextResponse.json(
    {
      status: vies.status,
      vatNumber: vies.vatNumber,
      name: vies.name ?? null,
      treatment: vat.treatment,
      rate: vat.rate,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
