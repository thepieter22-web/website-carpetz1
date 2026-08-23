import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function CartPage({
  searchParams,
}: {
  searchParams: {
    type?: string
    width?: string
    height?: string
    quantity?: string
    total?: string
  }
}) {
  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-secondary/20">
        <div className="mx-auto max-w-5xl px-6 py-16">

          <h1 className="font-serif text-5xl font-semibold">
            Winkelwagen
          </h1>

          <p className="mt-3 text-muted-foreground">
            Controleer jouw configuratie voordat je afrekent.
          </p>

          <div className="mt-10 rounded-xl border bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">
              Jouw logomat
            </h2>

            <div className="mt-6 space-y-3">
              <p>Type: {searchParams.type}</p>
              <p>Afmetingen: {searchParams.width} × {searchParams.height} cm</p>
              <p>Aantal: {searchParams.quantity}</p>
              <p>Totaal: {searchParams.total}</p>
            </div>
          </div>

        </div>
      </main>

      <SiteFooter />
    </>
  )
}
