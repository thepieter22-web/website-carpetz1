import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "info@jpsinterior.be",
      subject: "Carpetz Testmail",
      html: `
        <h2>✅ Resend werkt</h2>

        <p>
          Deze mail werd verzonden vanuit Carpetz.
        </p>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Mail verzenden mislukt" },
      { status: 500 }
    );
  }
}
