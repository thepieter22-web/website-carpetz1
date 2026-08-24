import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "info@jpsinterior.be",
      subject: "Carpetz testmail",
      html: "<p>✅ Resend werkt correct voor Carpetz.</p>",
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
