
import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(
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
        OrderNumber: `TEST-${Date.now()}`,
        OrderDate: "2026-01-01",
        ExpiryDate: "2026-02-01",
        Customer: {
          Name: "Test Customer",
          VATNumber: "BE0563846944",
          PartyType: "Customer",
        },
        OrderLines: [
          {
            Quantity: 1,
            UnitPriceExcl: 10,
            Description: "Test invoice",
            VATPercentage: 21,
          },
        ],
      }),
    }
  );

  const data = await response.text();

  return NextResponse.json({
    status: response.status,
    data,
  });
}
