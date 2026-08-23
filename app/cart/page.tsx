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
    <main className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-4xl font-serif font-semibold">
        Winkelwagen
      </h1>

      <div className="mt-10 rounded-xl border p-6">
        <h2 className="text-xl font-semibold">
          Jouw logomat
        </h2>

        <div className="mt-6 space-y-2">
          <p>Type: {searchParams.type}</p>
          <p>Afmetingen: {searchParams.width} × {searchParams.height} cm</p>
          <p>Aantal: {searchParams.quantity}</p>
          <p>Totaal: {searchParams.total}</p>
        </div>
      </div>
    </main>
  )
}
