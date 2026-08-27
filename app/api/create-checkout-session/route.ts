import { put } from "@vercel/blob";
import Stripe from "stripe";
import { NextResponse } from "next/server";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const previewImage = body.previewImage || "";

console.log("BODY PREVIEW IMAGE:");
console.log(previewImage ? "AANWEZIG" : "LEEG");

let previewUrl = "";

if (previewImage) {
  const base64Data = previewImage.split(",")[1];

  const buffer = Buffer.from(
    base64Data,
    "base64"
  );

  const blob = await put(
  `previews/${Date.now()}.png`,
  buffer,
  {
    access: "public",
  }
);

previewUrl = blob.url;

console.log("PREVIEW URL AFTER BLOB:");
console.log(previewUrl);

console.log("PREVIEW URL TO STRIPE:");
console.log(previewUrl);
``

}



    const today = new Date();

const datePart =
  today.getFullYear().toString() +
  String(today.getMonth() + 1).padStart(2, "0") +
  String(today.getDate()).padStart(2, "0");

const randomPart = Math.floor(
  Math.random() * 9000 + 1000
);

const orderNumber =
  `CAR-${datePart}-${randomPart}`;

  console.log("PREVIEW URL TO STRIPE:");
console.log(previewUrl);

    const session = await stripe.checkout.sessions.create({
  mode: "payment",

  payment_intent_data: {
    metadata: {
      orderNumber,
      previewUrl: String(previewUrl),


      subtotal: String(body.subtotal || ""),
vat: String(body.vat || ""),
shipping: String(body.shipping || ""),
grandTotal: String(body.grandTotal || ""),
      
      customerType: body.customerType || "",
      firstName: body.firstName || "",
      lastName: body.lastName || "",
      email: body.email || "",
      phone: body.phone || "",
      company: body.company || "",
      vatNumber: body.vatNumber || "",
      street: body.street || "",
postalCode: body.postalCode || "",
city: body.city || "",
country: body.country || "",
      
matType: body.matType || "",
width: body.width || "",
height: body.height || "",
quantity: body.quantity || "",
total: String(body.total || ""),

      
    },
  },

  line_items: [
        {
          price_data: {
            currency: "eur",

            product_data: {
              name: "Logomat op maat",
            },

            unit_amount: Math.round(body.amount * 100),
          },

          quantity: 1,
        },
      ],

      success_url: `${request.headers.get(
        "origin"
      )}/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${request.headers.get(
        "origin"
      )}/cart`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Stripe fout" },
      { status: 500 }
    );
  }
}
