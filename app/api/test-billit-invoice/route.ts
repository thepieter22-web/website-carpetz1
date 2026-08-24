import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    billitReady: true,
    partyIdExists: !!process.env.BILLIT_PARTY_ID,
    apiKeyExists: !!process.env.BILLIT_API_KEY,
  });
}
