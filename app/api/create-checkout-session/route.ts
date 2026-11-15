import { put } from "@vercel/blob";
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { calculateOrderTotals, parseOrderSpec } from "@/lib/mat-config";
import {
  INTRA_COMMUNITY_NOTE,
  determineVat,
  isCountryCode,
  needsViesCheck,
  normalizeVatNumber,
  type CountryCode,
  type ViesResult,
} from "@/lib/vat";
import { checkVies } from "@/lib/vies";
import { locales, defaultLocale, type Locale } from "@/i18n";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Taal van de klant (nl/fr): bepaalt Stripe-taal, terugkeer-URL's, e-mail en factuur.
    const locale: Locale = locales.includes(body?.locale) ? body.locale : defaultLocale;
    const t = await getTranslations({ locale, namespace: "Checkout" });

    // Prijzen worden NOOIT uit de body gelezen: de server berekent alles
    // opnieuw op basis van de productspecificaties.
    const spec = parseOrderSpec(body?.product ?? {});
    if (!spec) {
      return NextResponse.json(
        { error: t("invalidConfig") },
        { status: 400 }
      );
    }
    // Klantgegevens: alles verplicht (ook als iemand de controle in de browser omzeilt).
    const str = (value: unknown) => (typeof value === "string" ? value.trim().slice(0, 200) : "");
    const customerType = body.customerType === "zakelijk" ? "zakelijk" : "particulier";
    const customer = {
      firstName: str(body.firstName),
      lastName: str(body.lastName),
      email: str(body.email),
      phone: str(body.phone),
      company: customerType === "zakelijk" ? str(body.company) : "",
      vatNumber: customerType === "zakelijk" ? str(body.vatNumber) : "",
      street: str(body.street),
      postalCode: str(body.postalCode),
      city: str(body.city),
      country: str(body.country),
      deliveryStreet: str(body.deliveryStreet),
      deliveryPostalCode: str(body.deliveryPostalCode),
      deliveryCity: str(body.deliveryCity),
      deliveryCountry: str(body.deliveryCountry),
    };
    const hasSeparateDelivery = customerType === "zakelijk" && Boolean(
      customer.deliveryStreet || customer.deliveryPostalCode || customer.deliveryCity
    );
    const requiredFields: (keyof typeof customer)[] = [
      "firstName", "lastName", "email", "phone", "street", "postalCode", "city", "country",
      ...(customerType === "zakelijk" ? (["company", "vatNumber"] as const) : []),
      ...(hasSeparateDelivery
        ? (["deliveryStreet", "deliveryPostalCode", "deliveryCity", "deliveryCountry"] as const)
        : []),
    ];
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customer.email);
    const phoneValid = customer.phone.replace(/\D/g, "").length >= 8;
    const countriesValid =
      isCountryCode(customer.country) && (!hasSeparateDelivery || isCountryCode(customer.deliveryCountry));
    if (requiredFields.some((key) => !customer[key]) || !emailValid || !phoneValid || !countriesValid) {
      return NextResponse.json({ error: t("missingFields") }, { status: 400 });
    }
    if (!hasSeparateDelivery) {
      customer.deliveryStreet = "";
      customer.deliveryPostalCode = "";
      customer.deliveryCity = "";
      customer.deliveryCountry = "";
    }

    // Btw: het leveringsland beslist. Het btw-nummer wordt hier ZELF opnieuw bij VIES
    // gecontroleerd; een tarief of status uit de browser wordt nooit vertrouwd.
    const invoiceCountry = customer.country as CountryCode;
    const deliveryCountry = (hasSeparateDelivery ? customer.deliveryCountry : customer.country) as CountryCode;
    let vies: ViesResult | null = null;
    if (customer.vatNumber) {
      const normalized = normalizeVatNumber(customer.vatNumber, invoiceCountry);
      customer.vatNumber = normalized.full;
      if (needsViesCheck(deliveryCountry, customerType === "zakelijk")) {
        vies = await checkVies(normalized.country, normalized.number);
      }
    }
    const vatDecision = determineVat({ deliveryCountry, isBusiness: customerType === "zakelijk", vies });
    const totals = calculateOrderTotals(spec, vatDecision.rate);
    const isIntraCommunity = vatDecision.treatment === "intra_community";

    // Eigen teksten op de mat, samengevat voor productie (Stripe-metadata: max. 500 tekens).
    const customTexts = (Array.isArray(body.customTexts) ? body.customTexts : [])
      .slice(0, 5)
      .map((item: Record<string, unknown>) => {
        const content = str(item?.content).replace(/\s*\n\s*/g, " / ").slice(0, 60);
        if (!content) return "";
        const font = str(item?.font).slice(0, 30);
        const colorCode = str(item?.colorCode).slice(0, 10);
        return `«${content}» ${font}${item?.bold === true ? " vet" : ""}, kleur ${colorCode}`;
      })
      .filter(Boolean)
      .join(" | ")
      .slice(0, 500);

    const previewImage = body.previewImage || "";
    let previewUrl = "";
    if (previewImage) {
      const base64Data = previewImage.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      const blob = await put(`previews/${Date.now()}.png`, buffer, {
        access: "public",
      });
      previewUrl = blob.url;
    }

    const logoImage = body.logoImage || "";
    let logoUrl = "";
    if (logoImage) {
      const logoBase64 = logoImage.split(",")[1];
      const logoBuffer = Buffer.from(logoBase64, "base64");
      const logoBlob = await put(`logos/${Date.now()}.png`, logoBuffer, {
        access: "public",
      });
      logoUrl = logoBlob.url;
    }

    const today = new Date();
    const datePart =
      today.getFullYear().toString() +
      String(today.getMonth() + 1).padStart(2, "0") +
      String(today.getDate()).padStart(2, "0");

    const randomPart = Math.floor(Math.random() * 9000 + 1000);
    const orderNumber = `CAR-${datePart}-${randomPart}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale,
      // Klant hoeft zijn e-mailadres niet opnieuw te typen bij Stripe.
      customer_email: customer.email,

      payment_intent_data: {
        metadata: {
          orderNumber,
          locale,
          previewUrl: previewUrl || "",
          logoUrl: logoUrl || "",

          subtotal: totals.productExclVat.toFixed(2),
          vat: totals.vat.toFixed(2),
          shipping: totals.shipping.toFixed(2),
          grandTotal: totals.grandTotal.toFixed(2),

          // Klant- en adresgegevens veilig omgezet naarstrings (voor Billit)
          customerType,
          ...customer,

          // Btw-behandeling (voor boekhouding, factuur en mails)
          vatTreatment: isIntraCommunity ? "reverse_charge" : "domestic",
          vatRate: String(Math.round(vatDecision.rate * 100)),
          vatDeliveryCountry: deliveryCountry,
          vatExemptionNote: isIntraCommunity ? INTRA_COMMUNITY_NOTE : "",
          viesStatus: vies?.status ?? "not_checked",
          viesRequestId: vies?.requestId ?? "",
          viesCheckedAt: vies?.checkedAt ?? "",
          viesName: (vies?.name ?? "").slice(0, 200),

          // Productspecificaties veilig omgezet naar strings
          matType: spec.type || "",
          matSubtype:
            spec.type === "outdoor"
              ? spec.outdoorSubtype || ""
              : spec.indoorSubtype || "",
          width: String(spec.width || ""),
          height: String(spec.height || ""),
          quantity: String(spec.quantity || ""),
          logoColors: String(spec.logoColors ?? ""),
          colorCode: spec.colorCode || "",
          customTexts,
          placement: spec.placement || "",
          rubberBorder: String(spec.rubberBorder ?? ""),
          unitPrice: totals.unitPrice.toFixed(2),
          total: totals.grandTotal.toFixed(2),
        },
      },

      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: t("productName"),
            },
            unit_amount: Math.round(totals.grandTotal * 100),
          },
          quantity: 1,
        },
      ],

      success_url: `${request.headers.get("origin")}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${request.headers.get("origin")}/${locale}/cart`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error: any) {
    console.error("STRIPE ERROR:", error);

    return NextResponse.json(
      { error: error?.message || "Stripe error" },
      { status: 500 }
    );
  }
}