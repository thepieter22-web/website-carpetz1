import Stripe from "stripe";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Leest het bestelnummer uit de URL: altijd per bezoek opbouwen, nooit vooraf.
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "Meta.success" });
  return { title: t("title"), robots: { index: false } };
}

export default async function SuccessPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { session_id?: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("Success");
  const sessionId = searchParams.session_id;

  let orderNumber = t("unknown");

  if (sessionId) {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });
    const paymentIntent = session.payment_intent as Stripe.PaymentIntent;
    orderNumber = paymentIntent.metadata.orderNumber || t("unknown");
  }

  const steps = t.raw("steps") as string[];

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-secondary/20">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="rounded-2xl border bg-card p-10 text-center shadow-sm">
            <div className="mb-6 text-6xl">✅</div>

            <h1 className="font-serif text-4xl font-semibold">{t("title")}</h1>
            <p className="mt-4 text-muted-foreground">{t("paymentReceived")}</p>
            <p className="mt-4 font-medium text-[#C69C4D]">{t("orderNumber", { number: orderNumber })}</p>
            <p className="mt-2 text-muted-foreground">{t("proofComing")}</p>

            <div className="mt-8 rounded-lg bg-muted p-6 text-left">
              {steps.map((step) => (
                <p key={step}>{step}</p>
              ))}
            </div>

            <div className="mt-6 text-sm text-muted-foreground">
              <p>{t("questions")}</p>
              <p className="mt-1">{t("contact")}</p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
