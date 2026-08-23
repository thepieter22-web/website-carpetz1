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
        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="mb-10">
            <h1 className="font-serif text-5xl font-semibold">
              Winkelwagen
            </h1>

            <p className="mt-3 text-muted-foreground">
              Controleer jouw configuratie voordat je afrekent.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

            {/* Product */}
            <div className="rounded-xl border bg-card p-8 shadow-sm">
              <h2 className="text-2xl font-semibold">
                Jouw logomat
              </h2>

              <div className="mt-8 space-y-4">
                <div>
                  <span className="text-muted-foreground">Type</span>
                  <p className="font-medium">{searchParams.type}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">Afmetingen</span>
                  <p className="font-medium">
                    {searchParams.width} × {searchParams.height} cm
                  </p>
                </div>

                <div>
                  <span className="text-muted-foreground">Aantal</span>
                  <p className="font-medium">{searchParams.quantity}</p>
                </div>
              </div>
            </div>

            {/* Samenvatting */}
            <div className="rounded-xl border bg-card p-8 shadow-sm h-fit sticky top-24">

              <h2 className="text-xl font-semibold">
                Bestelsamenvatting
              </h2>

              <div className="mt-6 flex justify-between">
                <span>Totaal</span>
                <span className="text-2xl font-bold text-[#C69C4D]">
                  {searchParams.total}
                </span>
              </div>

              <button
                className="mt-8 w-full rounded-lg bg-[#C69C4D] px-6 py-4 text-white font-medium hover:bg-[#B88D3C]"
              >
                Doorgaan naar afrekenen
              </button>

              <p className="mt-4 text-xs text-muted-foreground">
                Veilige betaling via Stripe volgt in de volgende stap.
              </p>

            </div>

          </div>

        </div>
      </main>

      <SiteFooter />
    </>
  )
}
