import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getTranslations } from "next-intl/server";
import { locales } from "@/i18n";

/**
 * Offerte-/contactformulier:
 * 1. mail naar info@carpetz.be (intern, Nederlands, met de taal van de klant),
 * 2. bevestiging naar de klant in zijn eigen taal.
 * Antwoordt pas "ok" als de interne mail echt vertrokken is.
 */

const TO = "info@carpetz.be";
const FROM = "Carpetz <noreply@carpetz.be>";

const LIMITS = { name: 120, company: 160, email: 200, phone: 40, product: 120, message: 5000, page: 300 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Sneller dan dit ingevuld = bot. */
const MIN_FILL_MS = 2500;

// Eenvoudige rem tegen misbruik: max. 5 aanvragen per IP per 10 minuten (per serverinstantie).
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 1000) hits.clear();
  return recent.length > RATE_MAX;
}

const esc = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const nl2br = (value: string) => esc(value).replace(/\r?\n/g, "<br>");

const str = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  // Bots: honeypot ingevuld of formulier te snel verstuurd → stil "ok", niets versturen.
  const startedAt = Number(body.startedAt);
  if (str(body.website, 200) || (Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_MS)) {
    return NextResponse.json({ ok: true });
  }

  const locale = locales.includes(body.locale as (typeof locales)[number]) ? (body.locale as string) : "nl";
  const data = {
    name: str(body.name, LIMITS.name),
    company: str(body.company, LIMITS.company),
    email: str(body.email, LIMITS.email),
    phone: str(body.phone, LIMITS.phone),
    product: str(body.product, LIMITS.product),
    message: str(body.message, LIMITS.message),
    page: str(body.page, LIMITS.page),
  };

  if (!data.name || !data.message || !EMAIL_RE.test(data.email)) {
    return NextResponse.json({ error: "missing" }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "onbekend";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate" }, { status: 429 });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("Contactformulier: RESEND_API_KEY ontbreekt");
    return NextResponse.json({ error: "send" }, { status: 500 });
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  // 1. Interne mail (Nederlands). "Beantwoorden" gaat rechtstreeks naar de klant.
  const rows: [string, string][] = [
    ["Naam", data.name],
    ["Bedrijf", data.company || "–"],
    ["E-mail", data.email],
    ["Telefoon", data.phone || "–"],
    ["Onderwerp", data.product || "–"],
    ["Taal klant", locale === "fr" ? "Frans (FR)" : "Nederlands (NL)"],
    ["Verstuurd vanaf", data.page || "–"],
  ];
  const adminHtml = `
    <h2 style="font-family:Arial,sans-serif">Nieuwe aanvraag via carpetz.be</h2>
    <table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:4px 16px 4px 0;color:#666;vertical-align:top">${label}</td><td style="padding:4px 0">${esc(value)}</td></tr>`
        )
        .join("")}
    </table>
    <h3 style="font-family:Arial,sans-serif;margin-top:20px">Bericht</h3>
    <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5">${nl2br(data.message)}</p>`;

  const admin = await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: data.email,
    subject: `Nieuwe aanvraag: ${data.product || "contact"} – ${data.name}${data.company ? ` (${data.company})` : ""}`,
    html: adminHtml,
  });
  if (admin.error) {
    console.error("Contactformulier: interne mail mislukt", admin.error);
    return NextResponse.json({ error: "send" }, { status: 500 });
  }

  // 2. Bevestiging naar de klant (mag mislukken zonder dat de aanvraag verloren gaat).
  try {
    const t = await getTranslations({ locale, namespace: "ContactEmail" });
    const customerHtml = `
      <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#222">
        <p>${esc(t("greeting", { name: data.name }))}</p>
        <p>${esc(t("intro"))}</p>
        <p style="margin-top:20px;color:#666">${esc(t("yourMessage"))}</p>
        <blockquote style="margin:0;padding:12px 16px;border-left:3px solid #c9974b;background:#f7f4ef">${nl2br(data.message)}</blockquote>
        <p style="margin-top:20px">${esc(t("questions"))}</p>
        <p>${esc(t("signature"))}<br>Carpetz<br>+32 488 23 65 81<br>info@carpetz.be</p>
      </div>`;
    const confirmation = await resend.emails.send({
      from: FROM,
      to: data.email,
      replyTo: TO,
      subject: t("subject"),
      html: customerHtml,
    });
    if (confirmation.error) console.error("Contactformulier: bevestiging mislukt", confirmation.error);
  } catch (error) {
    console.error("Contactformulier: bevestiging mislukt", error);
  }

  return NextResponse.json({ ok: true });
}
