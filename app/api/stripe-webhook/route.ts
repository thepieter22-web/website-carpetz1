import { Resend } from "resend";
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(request: Request) {
  const body = await request.text();

  try {
    const event = JSON.parse(body);

    if (event.type === "checkout.session.completed") {
      console.log("WEBHOOK VERSION 999");
      
      const session = event.data.object;

      const paymentIntent =
  await stripe.paymentIntents.retrieve(
    session.payment_intent
  );

  const data = {
    ...session.metadata,
    ...paymentIntent.metadata,
  };

      const today = new Date();
      const orderDate = today.toISOString().split("T")[0];
      const expiryDate = new Date(
        today.getTime() + 30 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0];

      const billitResponse = await fetch(
  "https://api.sandbox.billit.be/v1/orders",
  {
    method: "POST",
    headers: {
      apiKey: process.env.BILLIT_API_KEY!,
      PartyID: process.env.BILLIT_PARTY_ID!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      OrderType: "Invoice",
      OrderDirection: "Income",
      OrderNumber: data.orderNumber,
      OrderDate: orderDate,
      DeliveryDate: orderDate,
      ExpiryDate: expiryDate,

      Customer: {
        Name: `${data.firstName} ${data.lastName}`.trim(),
        PartyType: "Customer",
        Email: data.email,
        Addresses: [
          {
            AddressType: "InvoiceAddress",
            Street: data.street,
            City: data.city,
            Zipcode: data.postalCode,
            CountryCode: "BE",
          },
        ],
      },

      OrderLines: [
        {
          Quantity: 1,
          UnitPriceExcl: Number(data.subtotal),
          Description: `Logomat op maat ${data.width} x ${data.height} cm`,
          VATPercentage: 21,
        },
        {
          Quantity: 1,
          UnitPriceExcl: Number(data.shipping),
          Description: "Leveringskost",
          VATPercentage: 21,
        },
      ],
    }),
  }
);

      // Ophalen afbeeldingen voor bijlagen / embedded tonen
      let imageBuffer: Buffer | null = null;
      if (data.previewUrl) {
        const imageResponse = await fetch(data.previewUrl);
        imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
      }

      let logoBuffer: Buffer | null = null;
      if (data.logoUrl) {
        const logoResponse = await fetch(data.logoUrl);
        logoBuffer = Buffer.from(await logoResponse.arrayBuffer());
      }

      // --- Interne mail (beheerdersmail) ---
      await resend.emails.send({
        from: "Carpetz <noreply@carpetz.be>",
        to: "info@carpetz.be",
        subject: `Nieuwe bestelling ${data.orderNumber}`,
        html: `
          <h2>Nieuwe bestelling ontvangen</h2>
          <p><strong>Bestelnummer:</strong> ${data.orderNumber}</p>
          <p><strong>Preview:</strong></p>
          <p><a href="${data.previewUrl}">Bekijk ontwerp</a></p>
          <p><strong>E-mail:</strong> ${data.email}</p>
          <p><strong>Afmeting:</strong> ${data.width} × ${data.height} cm</p>
          <p><strong>Aantal:</strong> ${data.quantity}</p>
          <p><strong>Totaal:</strong> €${data.grandTotal}</p>
        `,
        attachments: [
          ...(imageBuffer ? [{ filename: "preview.png", content: imageBuffer, cid: "preview-admin" }] : []),
          ...(logoBuffer ? [{ filename: "logo-origineel.png", content: logoBuffer }] : []),
        ],
      });

      // --- Klantmail (Geoptimaliseerd en strak opgemaakt) ---
      const customerFirstName = data.firstName ? data.firstName.charAt(0).toUpperCase() + data.firstName.slice(1) : "Beste";

      await resend.emails.send({
        from: "Carpetz <noreply@carpetz.be>",
        to: data.email,
        subject: `Bedankt voor je bestelling ${data.orderNumber}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bedankt voor je bestelling</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; color: #333333;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f4f4f4; padding: 20px 0;">
              <tr>
                <td align="center">
                  <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 6px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                    
                    <!-- USP Header Bar -->
                    <tr>
                      <td style="background-color: #C69C4D; color: #ffffff; padding: 10px 20px; font-size: 11px; font-weight: bold; text-align: center;">
                        ✓ Hoge kwaliteit voor scherpe prijs &nbsp;&nbsp;|&nbsp;&nbsp; ✓ Veilig betalen &nbsp;&nbsp;|&nbsp;&nbsp; ✓ Betrouwbare levering
                      </td>
                    </tr>

                    <!-- Sfeervolle Header Banner -->
                    <tr>
                      <td style="background-color: #1a1a1a; padding: 35px 20px; text-align: center; color: #ffffff;">
                        <h1 style="margin: 0; font-size: 22px; font-family: Georgia, serif; font-weight: normal; letter-spacing: 0.5px; color: #ffffff;">Bedankt voor je bestelling!</h1>
                      </td>
                    </tr>

                    <!-- Hoofdinhoud -->
                    <tr>
                      <td style="padding: 30px 40px;">
                        <p style="margin: 0 0 15px 0; font-size: 15px; line-height: 1.5;">Beste ${customerFirstName},</p>
                        <p style="margin: 0 0 25px 0; font-size: 15px; line-height: 1.5; color: #555555;">We hebben je bestelling in goede orde ontvangen en gaan er direct met de productie mee aan de slag.</p>

                        <!-- Overzichtstabel van de bestelling -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafafa; border: 1px solid #eeeeee; border-radius: 6px; padding: 15px; margin-bottom: 25px;">
                          <tr>
                            <td colspan="2" style="padding-bottom: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold; font-size: 13px; color: #C69C4D; text-transform: uppercase; letter-spacing: 0.5px;">
                              Besteloverzichtsdetails
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; font-size: 14px; color: #666666; width: 40%;">Bestelnummer:</td>
                            <td style="padding: 10px 0; font-size: 14px; font-weight: bold; color: #333333; text-align: right; width: 60%;">${data.orderNumber}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; font-size: 14px; color: #666666; border-top: 1px solid #f0f0f0;">Type logomat:</td>
                            <td style="padding: 10px 0; font-size: 14px; font-weight: bold; color: #333333; text-align: right; border-top: 1px solid #f0f0f0;">Op maat (${data.width} × ${data.height} cm)</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; font-size: 14px; color: #666666; border-top: 1px solid #f0f0f0;">Aantal:</td>
                            <td style="padding: 10px 0; font-size: 14px; font-weight: bold; color: #333333; text-align: right; border-top: 1px solid #f0f0f0;">${data.quantity}</td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0 5px 0; font-size: 15px; font-weight: bold; color: #333333; border-top: 2px solid #e0e0e0;">Totaal (incl. btw):</td>
                            <td style="padding: 12px 0 5px 0; font-size: 16px; font-weight: bold; color: #C69C4D; text-align: right; border-top: 2px solid #e0e0e0;">€${data.grandTotal}</td>
                          </tr>
                        </table>

                        <!-- Visuele Proefdruk Sectie -->
                        ${data.previewUrl ? `
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
                            <tr>
                              <td style="font-size: 14px; font-weight: bold; padding-bottom: 8px; color: #333333;">Jouw gekozen ontwerp / proefdruk:</td>
                            </tr>
                            <tr>
                              <td align="center" style="background-color: #f0f0f0; border: 1px dashed #cccccc; border-radius: 6px; padding: 15px;">
                                <img src="${data.previewUrl}" alt="Logomat Proefdruk" style="max-width: 100%; height: auto; max-height: 220px; display: block; border-radius: 4px;" />
                              </td>
                            </tr>
                          </table>
                        ` : ''}

                        <!-- Info Box over volgende stappen -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fcf8f0; border-left: 4px solid #C69C4D; border-radius: 0 4px 4px 0; margin-bottom: 25px;">
                          <tr>
                            <td style="padding: 15px; font-size: 13px; line-height: 1.5; color: #555555;">
                              <p style="margin: 0 0 8px 0;"><strong>✅ Wat gebeurt er nu?</strong> Binnen enkele werkdagen ontvang je van ons een definitieve digitale proefdruk per e-mail.</p>
                              <p style="margin: 0;"><strong>✅</strong> De fysieke productie van je mat start pas nadat jij deze proefdruk hebt goedgekeurd.</p>
                            </td>
                          </tr>
                        </table>

                        <p style="margin: 0 0 5px 0; font-size: 15px; line-height: 1.5;">Met vriendelijke groet,</p>
                        <p style="margin: 0; font-size: 15px; font-weight: bold; color: #1a1a1a;">Team Carpetz</p>
                      </td>
                    </tr>

                    <!-- Donkere Footer -->
                    <tr>
                      <td style="background-color: #1a1a1a; color: #aaaaaa; padding: 30px 40px; font-size: 12px; text-align: center;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td align="center" style="padding-bottom: 15px; border-bottom: 1px solid #333333;">
                              <a href="https://www.carpetz.be" style="color: #ffffff; text-decoration: none; font-weight: bold; margin: 0 15px;">Website</a>
                              <a href="https://www.carpetz.be/contact" style="color: #cccccc; text-decoration: none; margin: 0 15px;">Klantenservice</a>
                              <a href="https://www.carpetz.be/algemene-voorwaarden" style="color: #cccccc; text-decoration: none; margin: 0 15px;">Voorwaarden</a>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="padding-top: 20px; color: #777777;">
                              &copy; ${new Date().getFullYear()} Carpetz. Alle rechten voorbehouden.
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
        attachments: imageBuffer
          ? [{ filename: "proefdruk-logomat.png", content: imageBuffer }]
          : [],
      });

    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Webhook fout" },
      { status: 500 }
    );
  }
}