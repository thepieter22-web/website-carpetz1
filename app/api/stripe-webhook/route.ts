import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
