import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function SuccessPage() {
  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-secondary/20">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="rounded-2xl border bg-card p-10 shadow-sm text-center">
            <div className="text-6xl mb-6">✅</div>

            <h1 className="text-4xl font-serif font-semibold">
              Bedankt voor je bestelling
            </h1>

            <p className="mt-4 text-muted-foreground">
              Je betaling werd succesvol ontvangen.
            </p>

            <p className="mt-2 text-muted-foreground">
              We bezorgen je binnenkort een digitale proefdruk ter goedkeuring.
            </p>

            <div className="mt-8 rounded-lg bg-muted p-6 text-left">
              
              <p>✅ Betaling ontvangen</p>
              <p>✅ Digitale proefdruk volgt</p>
              <p>✅ Productie na jouw goedkeuring</p>
              <p>✅ Levering in België & Nederland</p>
            </div>

            <div className="mt-6 text-sm text-muted-foreground">
  <p>
    Heb je vragen over je bestelling?
  </p>

  <p className="mt-1">
    Contacteer ons via info@jpsinterior.be
  </p>
</div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
