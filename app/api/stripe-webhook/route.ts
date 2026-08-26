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
      const session = event.data.object;

      const paymentIntent =
        await stripe.paymentIntents.retrieve(
          session.payment_intent
        );

      const data = paymentIntent.metadata;

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
        Name:
          `${data.firstName} ${data.lastName}`.trim(),

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
          Description:
            `Logomat op maat ${data.width} x ${data.height} cm`,
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

console.log(
  "BILLIT STATUS:",
  billitResponse.status
);

console.log(
  "BILLIT RESPONSE:",
  await billitResponse.text()
);

      await resend.emails.send({
  from: "Carpetz <noreply@carpetz.be>",
  to: "info@carpetz.be",
  subject: `Nieuwe bestelling ${data.orderNumber}`,
  html: `
    <h2>Nieuwe bestelling ontvangen</h2>

    <p><strong>Bestelnummer:</strong> ${data.orderNumber}</p>

    <p><strong>Klant:</strong>
    ${data.firstName} ${data.lastName}</p>

    <p><strong>E-mail:</strong>
    ${data.email}</p>

    <p><strong>Afmeting:</strong>
    ${data.width} × ${data.height} cm</p>

    <p><strong>Aantal:</strong>
    ${data.quantity}</p>

    <p><strong>Totaal:</strong>
    €${data.grandTotal}</p>
  `,
});

await resend.emails.send({
  from: "Carpetz <noreply@carpetz.be>",
  to: data.email,

  subject: `Bedankt voor je bestelling ${data.orderNumber}`,

  html: `
    <h2>Bedankt voor je bestelling</h2>

    <p>Beste ${data.firstName},</p>

    <p>
      Bedankt voor je bestelling bij Carpetz.
    </p>

    <p>
      <strong>Bestelnummer:</strong>
      ${data.orderNumber}
    </p>

    <p>
      <strong>Afmetingen:</strong>
      ${data.width} × ${data.height} cm
    </p>

    <p>
      <strong>Aantal:</strong>
      ${data.quantity}
    </p>

    <p>
      <strong>Totaal:</strong>
      €${data.grandTotal}
    </p>

    <p>
      Binnenkort ontvang je een digitale proefdruk ter goedkeuring.
    </p>

    <p>
      De productie start pas na jouw akkoord.
    </p>

    <p>
      Met vriendelijke groeten,<br>
      Team Carpetz
    </p>
  `,
});

      
``

      console.log("BESTELLING:");
      console.log({
        orderNumber: data.orderNumber,
        subtotal: data.subtotal,
vat: data.vat,
shipping: data.shipping,
grandTotal: data.grandTotal,
        customerType: data.customerType,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        company: data.company,
        vatNumber: data.vatNumber,

        street: data.street,
postalCode: data.postalCode,
city: data.city,
country: data.country,

        
        width: data.width,
        height: data.height,
        quantity: data.quantity,
        total: data.total,
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
