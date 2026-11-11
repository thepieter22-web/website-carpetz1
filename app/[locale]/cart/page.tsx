"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { calculateOrderTotals, parseOrderSpec } from "@/lib/mat-config";
import { usePriceFormatter } from "@/lib/format";
import { readOrderAsset } from "@/lib/order-assets";

export default function CartPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const t = useTranslations("Cart");
  const tAll = useTranslations();
  const locale = useLocale();
  const formatPrice = usePriceFormatter();

  // Enkel specificaties komen uit de URL; prijzen worden hier alleen
  // voor weergave berekend. De checkout API rekent zelf opnieuw.
  const spec = parseOrderSpec(searchParams);
  const totals = spec ? calculateOrderTotals(spec) : null;

  const grandTotal = totals?.grandTotal ?? 0;
  const shipping = totals?.shipping ?? 0;
  const vatAmount = totals?.vat ?? 0;
  const productExclVat = totals?.productExclVat ?? 0;

  const matName = spec
    ? tAll(`MatTypes.${spec.type === "outdoor" ? spec.outdoorSubtype : spec.indoorSubtype}.title`)
    : "";

  const [customerType, setCustomerType] = useState("particulier");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState(t("defaultCountry"));
  const [sameAddress, setSameAddress] = useState(true);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    const image = readOrderAsset("matPreview");
    if (image) setPreviewImage(image);
  }, []);

  const isBusiness = customerType === "zakelijk";
  const perks = t.raw("perks") as string[];

  const handleCheckout = async () => {
    if (!spec) return;

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        previewImage: readOrderAsset("matPreview"),
        logoImage: readOrderAsset("matLogo"),
        // Taal van de klant: bepaalt de taal van Stripe, de bevestigingsmail en de factuur.
        locale,
        // Enkel productspecificaties, geen prijzen
        product: spec,
        customerType,
        firstName,
        lastName,
        email,
        phone,
        company,
        vatNumber,
        street,
        postalCode,
        city,
        country,
      }),
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || t("checkoutError"));
    }
  };

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16">
          <div className="mb-10">
            <h1 className="font-serif text-3xl font-semibold sm:text-5xl">{t("title")}</h1>
            <p className="mt-3 text-muted-foreground">{t("intro")}</p>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
            {/* Linkerkolom */}
            <div className="min-w-0">
              <div className="rounded-xl border bg-card p-5 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold">{t("customerDetails")}</h2>

                <div className="mt-6 flex gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setCustomerType("particulier")}
                    className={`min-h-12 flex-1 rounded-lg border px-4 py-3 sm:flex-none ${!isBusiness ? "bg-[#C69C4D] text-white" : ""}`}
                  >
                    {t("private")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomerType("zakelijk")}
                    className={`min-h-12 flex-1 rounded-lg border px-4 py-3 sm:flex-none ${isBusiness ? "bg-[#C69C4D] text-white" : ""}`}
                  >
                    {t("business")}
                  </button>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                  {isBusiness && (
                    <>
                      <input
                        required
                        className="rounded-lg border p-3"
                        placeholder={t("companyName")}
                        autoComplete="organization"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                      <input
                        required
                        className="rounded-lg border p-3"
                        placeholder={t("vatNumber")}
                        value={vatNumber}
                        onChange={(e) => setVatNumber(e.target.value)}
                      />
                    </>
                  )}

                  <input
                    required
                    className="rounded-lg border p-3"
                    placeholder={t("firstName")}
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    required
                    className="rounded-lg border p-3"
                    placeholder={t("lastName")}
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <input
                    required
                    type="email"
                    className="rounded-lg border p-3"
                    placeholder={t("email")}
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    required
                    type="tel"
                    className="rounded-lg border p-3"
                    placeholder={t("phone")}
                    autoComplete="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />

                  <h3 className="mt-8 text-lg font-semibold">
                    {isBusiness ? t("invoiceAddress") : t("deliveryAddress")}
                  </h3>

                  <input
                    required
                    className="rounded-lg border p-3"
                    placeholder={t("street")}
                    autoComplete="street-address"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                  <input
                    required
                    className="rounded-lg border p-3"
                    placeholder={t("postalCode")}
                    autoComplete="postal-code"
                    inputMode="numeric"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                  <input
                    required
                    className="rounded-lg border p-3"
                    placeholder={t("city")}
                    autoComplete="address-level2"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <input
                    required
                    className="rounded-lg border p-3"
                    placeholder={t("country")}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />

                  {isBusiness && (
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={sameAddress}
                        onChange={(e) => setSameAddress(e.target.checked)}
                      />
                      {t("sameAddress")}
                    </label>
                  )}

                  {isBusiness && !sameAddress && (
                    <>
                      <h3 className="mt-4 text-lg font-semibold">{t("deliveryAddress")}</h3>
                      <input className="rounded-lg border p-3" placeholder={t("street")} />
                      <input className="rounded-lg border p-3" placeholder={t("postalCode")} />
                      <input className="rounded-lg border p-3" placeholder={t("city")} />
                      <input
                        className="rounded-lg border p-3"
                        placeholder={t("countryRequired")}
                        defaultValue={t("defaultCountry")}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Rechterkolom */}
            <div className="self-start rounded-xl border bg-card p-5 shadow-sm sm:p-8 lg:sticky lg:top-24">
              <h2 className="mb-4 text-xl font-semibold">{t("summary")}</h2>

              {previewImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewImage}
                  alt={t("previewAlt")}
                  className="mb-6 max-h-[300px] w-full rounded-lg border object-contain"
                />
              )}

              <div className="rounded-lg border p-4">
                <h3 className="mb-2 text-base font-semibold">{t("yourMat")}</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("type")}</p>
                    <p className="font-medium">{matName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("dimensions")}</p>
                    <p className="font-medium">
                      {spec?.width} × {spec?.height} cm
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("quantity")}</p>
                    <p className="font-medium">{spec?.quantity}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span>{t("productPrice")}</span>
                  <span>{formatPrice(productExclVat)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("shipping")}</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("vat")}</span>
                  <span>{formatPrice(vatAmount)}</span>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <span className="font-semibold">{t("total")}</span>
                  <span className="text-2xl font-bold text-[#C69C4D]">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                {perks.map((perk) => (
                  <p key={perk}>{perk}</p>
                ))}
              </div>

              <button
                className="mt-8 w-full rounded-lg bg-[#C69C4D] px-6 py-4 font-medium text-white hover:bg-[#B88D3C] disabled:opacity-50"
                disabled={!spec}
                onClick={handleCheckout}
              >
                {t("checkout")}
              </button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
