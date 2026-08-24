import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    companyId: process.env.BILLIT_COMPANY_ID,
    apiKeyExists: !!process.env.BILLIT_API_KEY,
  });
}
