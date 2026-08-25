import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();

  const event = JSON.parse(body);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent
    );

    console.log("METADATA:");
    console.log(paymentIntent.metadata);
  }

  return NextResponse.json({
    received: true,
  });
}
