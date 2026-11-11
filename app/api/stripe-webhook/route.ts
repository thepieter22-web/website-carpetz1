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

      // --- Klantmail (Luxueus HTML Template in Wovar/Carpetz stijl) ---
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
            <style>
              body { font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 0; color: #333333; }
              .email-wrapper { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
              
              /* USP Header Bar */
              .usp-bar { background-color: #C69C4D; color: #ffffff; padding: 10px 15px; font-size: 11px; font-weight: bold; text-align: center; }
              .usp-item { display: inline-block; margin: 0 8px; }

              /* Banner */
              .banner { background-color: #222222; padding: 40px 20px; text-align: center; color: #ffffff; }
              .banner h1 { margin: 0; font-size: 24px; color: #ffffff; font-family: 'Georgia', serif; }

              /* Content */
              .content { padding: 30px; background-color: #ffffff; }
              .divider { border: none; border-top: 1px solid #C69C4D; margin: 20px 0; }
              
              /* Preview image inside email */
              .preview-container { text-align: center; margin: 20px 0; background: #f0f0f0; padding: 15px; border-radius: 8px; }
              .preview-container img { max-width: 100%; height: auto; max-height: 250px; border-radius: 4px; }

              /* Order details table */
              .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
              .details-table td { padding: 8px 0; border-bottom: 1px solid #eeeeee; }
              .details-table td.label { color: #666666; font-weight: bold; }
              .details-table td.value { text-align: right; }

              /* Footer */
              .footer { background-color: #222222; color: #cccccc; padding: 30px 20px; text-align: font-size: 13px; }
              .footer-columns { width: 100%; margin-bottom: 20px; }
              .footer-col { width: 33.33%; vertical-align: top; padding: 0 10px; box-sizing: border-box; }
              .footer-col h4 { color: #ffffff; font-size: 14px; margin-bottom: 10px; border-bottom: 1px solid #444; padding-bottom: 5px; }
              .footer-col a { color: #cccccc; text-decoration: none; display: block; margin-bottom: 5px; font-size: 12px; }
              .footer-col a:hover { color: #C69C4D; }
              .social-links { text-align: center; margin: 20px 0; }
              .social-links img { width: 24px; height: 24px; margin: 0 5px; }
              .copyright { text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #333; padding-top: 15px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="email-wrapper">
              
              <!-- USP Header -->
              <div class="usp-bar">
                <span class="usp-item">✓ Hoge kwaliteit voor scherpe prijs</span>
                <span class="usp-item">✓ Veilig betalen</span>
                <span class="usp-item">✓ Betrouwbare levering</span>
              </div>

              <!-- Sfeervolle Banner -->
              <div class="banner">
                <h1>Bedankt voor je bestelling!</h1>
              </div>

              <!-- Body Inhoud -->
              <div class="content">
                <p>Beste ${customerFirstName},</p>
                <p>We hebben je bestelling in goede orde ontvangen en gaan er direct mee aan de slag.</p>

                <hr class="divider">

                <p><strong>Gegevens van je bestelling:</strong></p>
                <table class="details-table">
                  <tr>
                    <td class="label">Bestelnummer:</td>
                    <td class="value">${data.orderNumber}</td>
                  </tr>
                  <tr>
                    <td class="label">Type logomat:</td>
                    <td class="value">Op maat (${data.width} × ${data.height} cm)</td>
                  </tr>
                  <tr>
                    <td class="label">Aantal:</td>
                    <td class="value">${data.quantity}</td>
                  </tr>
                  <tr>
                    <td class="label">Totaal (incl. btw):</td>
                    <td class="value" style="font-weight: bold; color: #C69C4D;">€${data.grandTotal}</td>
                  </tr>
                </table>

                ${imageBuffer ? `
                  <p style="margin-top: 20px; font-weight: bold;">Jouw gekozen ontwerp / proefdruk:</p>
                  <div class="preview-container">
                    <img src="cid:preview-customer" alt="Logomat Proefdruk">
                  </div>
                ` : ''}

                <div style="background-color: #fcf8f0; border-left: 4px solid #C69C4D; padding: 12px; margin: 20px 0; font-size: 13px;">
                  <p style="margin: 0 0 8px 0;">✅ <strong>Wat gebeurt er nu?</strong> Binnen enkele werkdagen ontvang je van ons een definitieve digitale proefdruk per e-mail.</p>
                  <p style="margin: 0;">✅ De fysieke productie van je mat start pas nadat jij deze proefdruk hebt goedgekeurd.</p>
                </div>

                <p>Met vriendelijke groet,</p>
                <p><strong>Team Carpetz</strong></p>
              </div>

              <!-- Donkere Footer -->
              <div class="footer">
                <table class="footer-columns">
                  <tr>
                    <td class="footer-col">
                      <h4>Klantenservice</h4>
                      <a href="https://carpetz.be/contact">Contact</a>
                      <a href="https://carpetz.be/faq">Veelgestelde vragen</a>
                      <a href="https://carpetz.be/levering">Leveringsinformatie</a>
                    </td>
                    <td class="footer-col">
                      <h4>Carpetz</h4>
                      <p style="font-size: 12px; color: #cccccc; margin: 0 0 5px 0;">Professionele logomats & evenementenlopers op maat.</p>
                      <a href="https://www.carpetz.be">www.carpetz.be</a>
                    </td>
                    <td class="footer-col">
                      <h4>Meer</h4>
                      <a href="https://carpetz.be/zakelijk">Zakelijk bestellen</a>
                      <a href="https://carpetz.be/algemene-voorwaarden">Algemene voorwaarden</a>
                    </td>
                  </tr>
                </table>

                <div class="copyright">
                  &copy; ${new Date().getFullYear()} Carpetz. Alle rechten voorbehouden.
                </div>
              </div>

            </div>
          </body>
          </html>
        `,
        attachments: imageBuffer
          ? [{ filename: "proefdruk-logomat.png", content: imageBuffer, cid: "preview-customer" }]
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