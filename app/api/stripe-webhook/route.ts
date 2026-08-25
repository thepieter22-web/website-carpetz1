import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.text();

  console.log("Webhook ontvangen");

  const event = JSON.parse(body);

  console.log("TYPE:");
  console.log(event.type);

  console.log("OBJECT:");
  console.log(event.data.object);

  return NextResponse.json({
    received: true,
  });
}
