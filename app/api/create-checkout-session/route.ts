import { put } from "@vercel/blob";
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { calculateOrderTotals, parseOrderSpec } from "@/lib/mat-config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Prijzen worden NOOIT uit de body gelezen: de server berekent alles
    // opnieuw op basis van de productspecificaties.
    const spec = parseOrderSpec(body?.product ?? {});
    if (!spec) {
      return NextResponse.json(
        { error: "Ongeldige productconfiguratie" },
        { status: 400 }
      );
    }
    const totals = calculateOrderTotals(spec);

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

      payment_intent_data: {
        metadata: {
          orderNumber,
          previewUrl: previewUrl || "",
          logoUrl: logoUrl || "",

          subtotal: totals.productExclVat.toFixed(2),
          vat: totals.vat.toFixed(2),
          shipping: totals.shipping.toFixed(2),
          grandTotal: totals.grandTotal.toFixed(2),

          // Klant- en adresgegevens veilig omgezet naarstrings (voor Billit)
          customerType: body.customerType || "particulier",
          firstName: body.firstName || "",
          lastName: body.lastName || "",
          email: body.email || "",
          phone: body.phone || "",
          company: body.company || "",
          vatNumber: body.vatNumber || "",
          street: body.street || "",
          postalCode: body.postalCode || "",
          city: body.city || "",
          country: body.country || "België",

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
              name: "Logomat op maat",
            },
            unit_amount: Math.round(totals.grandTotal * 100),
          },
          quantity: 1,
        },
      ],

      success_url: `${request.headers.get(
        "origin"
      )}/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${request.headers.get("origin")}/cart`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error: any) {
    console.error("STRIPE ERROR:", error);

    return NextResponse.json(
      { error: error?.message || "Stripe fout" },
      { status: 500 }
    );
  }
}