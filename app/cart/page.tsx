import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function CartPage({
  searchParams,
}: {
  searchParams: {
    type?: string;
    width?: string;
    height?: string;
    quantity?: string;
    total?: string;
  };
}) {
  const subtotal = Number(
    (searchParams.total || "0")
      .replace("€", "")
      .replace(",", ".")
  );

  const shipping = 15;
  const grandTotal = subtotal + shipping;

  const matNames: Record<string, string> = {
    normal: "Classic",
    eco: "Eco",
    budget: "Professional",
    luxe: "Elite",
  };

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

            <div>
              <div className="rounded-xl border bg-card p-8 shadow-sm">
                <h2 className="text-2xl font-semibold">
                  Jouw logomat
                </h2>

                <div className="mt-8 space-y-4">
                  <div>
                    <span className="text-muted-foreground">Type</span>
                    <p className="font-medium">
                      {matNames[searchParams.type || ""] ||
                        searchParams.type}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground">
                      Afmetingen
                    </span>
                    <p className="font-medium">
                      {searchParams.width} × {searchParams.height} cm
