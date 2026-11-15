"use client";

import { useEffect, useRef, useState, type InputHTMLAttributes } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { calculateOrderTotals, parseOrderSpec } from "@/lib/mat-config";
import { usePriceFormatter } from "@/lib/format";
import { readOrderAsset } from "@/lib/order-assets";

type FieldName =
  | "company"
  | "vatNumber"
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "street"
  | "postalCode"
  | "city"
  | "country"
  | "deliveryStreet"
  | "deliveryPostalCode"
  | "deliveryCity"
  | "deliveryCountry";

type FieldErrorKey = "required" | "invalidEmail" | "invalidPhone";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Volgorde = volgorde op het scherm (eerste fout krijgt de focus).
const FIELD_ORDER: FieldName[] = [
  "company",
  "vatNumber",
  "firstName",
  "lastName",
  "email",
  "phone",
  "street",
  "postalCode",
  "city",
  "country",
  "deliveryStreet",
  "deliveryPostalCode",
  "deliveryCity",
  "deliveryCountry",
];

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
  const [sameAddress, setSameAddress] = useState(true);
  const [values, setValues] = useState<Record<FieldName, string>>({
    company: "",
    vatNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    postalCode: "",
    city: "",
    country: t("defaultCountry"),
    deliveryStreet: "",
    deliveryPostalCode: "",
    deliveryCity: "",
    deliveryCountry: t("defaultCountry"),
  });
  const [errors, setErrors] = useState<Partial<Record<FieldName, FieldErrorKey>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const fieldRefs = useRef<Partial<Record<FieldName, HTMLInputElement | null>>>({});

  useEffect(() => {
    const image = readOrderAsset("matPreview");
    if (image) setPreviewImage(image);
  }, []);

  const isBusiness = customerType === "zakelijk";
  const hasSeparateDelivery = isBusiness && !sameAddress;
  const perks = t.raw("perks") as string[];

  const activeFields = FIELD_ORDER.filter((name) => {
    if (name === "company" || name === "vatNumber") return isBusiness;
    if (name.startsWith("delivery")) return hasSeparateDelivery;
    return true;
  });

  const validateField = (name: FieldName, value: string): FieldErrorKey | undefined => {
    const trimmed = value.trim();
    if (!trimmed) return "required";
    if (name === "email" && !EMAIL_PATTERN.test(trimmed)) return "invalidEmail";
    if (name === "phone" && trimmed.replace(/\D/g, "").length < 8) return "invalidPhone";
    return undefined;
  };

  const setValue = (name: FieldName, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Een getoonde fout verdwijnt zodra het veld correct is.
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleCheckout = async () => {
    if (!spec || submitting) return;

    const newErrors: Partial<Record<FieldName, FieldErrorKey>> = {};
    for (const name of activeFields) {
      const error = validateField(name, values[name]);
      if (error) newErrors[name] = error;
    }
    setErrors(newErrors);

    const firstInvalid = activeFields.find((name) => newErrors[name]);
    if (firstInvalid) {
      const input = fieldRefs.current[firstInvalid];
      input?.focus({ preventScroll: true });
      input?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      const trimmed = Object.fromEntries(
        activeFields.map((name) => [name, values[name].trim()])
      ) as Partial<Record<FieldName, string>>;

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
          ...trimmed,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      }
      alert(data.error || t("checkoutError"));
    } catch {
      alert(t("checkoutError"));
    }
    setSubmitting(false);
  };

  const field = (
    name: FieldName,
    placeholder: string,
    extra: InputHTMLAttributes<HTMLInputElement> = {}
  ) => {
    const error = errors[name];
    const errorId = `${name}-error`;
    return (
      <div className="flex flex-col gap-1">
        <input
          ref={(el) => {
            fieldRefs.current[name] = el;
          }}
          id={name}
          name={name}
          required
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          aria-label={placeholder}
          className={`min-h-12 rounded-lg border p-3 text-base sm:text-sm ${
            error ? "border-destructive ring-1 ring-destructive" : ""
          }`}
          placeholder={placeholder}
          value={values[name]}
          onChange={(e) => setValue(name, e.target.value)}
          onBlur={(e) => {
            // Na een eerste poging tot afrekenen: meteen terugkoppeling bij elk veld.
            if (Object.keys(errors).length > 0) {
              setErrors((prev) => ({ ...prev, [name]: validateField(name, e.target.value) }));
            }
          }}
          {...extra}
        />
        {error && (
          <p id={errorId} className="text-sm text-destructive">
            {t(`errors.${error}`)}
          </p>
        )}
      </div>
    );
  };

  const hasErrors = Object.values(errors).some(Boolean);

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
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCheckout();
                }}
                className="rounded-xl border bg-card p-5 shadow-sm sm:p-8"
              >
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
                      {field("company", t("companyName"), { autoComplete: "organization" })}
                      {field("vatNumber", t("vatNumber"))}
                    </>
                  )}

                  {field("firstName", t("firstName"), { autoComplete: "given-name" })}
                  {field("lastName", t("lastName"), { autoComplete: "family-name" })}
                  {field("email", t("email"), { type: "email", autoComplete: "email", inputMode: "email" })}
                  {field("phone", t("phone"), { type: "tel", autoComplete: "tel", inputMode: "tel" })}

                  <h3 className="mt-8 text-lg font-semibold">
                    {isBusiness ? t("invoiceAddress") : t("deliveryAddress")}
                  </h3>

                  {field("street", t("street"), { autoComplete: "street-address" })}
                  {field("postalCode", t("postalCode"), { autoComplete: "postal-code" })}
                  {field("city", t("city"), { autoComplete: "address-level2" })}
                  {field("country", t("country"), { autoComplete: "country-name" })}

                  {isBusiness && (
                    <label className="flex min-h-12 items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        className="size-5 shrink-0"
                        checked={sameAddress}
                        onChange={(e) => setSameAddress(e.target.checked)}
                      />
                      {t("sameAddress")}
                    </label>
                  )}

                  {hasSeparateDelivery && (
                    <>
                      <h3 className="mt-4 text-lg font-semibold">{t("deliveryAddress")}</h3>
                      {field("deliveryStreet", t("street"), { autoComplete: "shipping street-address" })}
                      {field("deliveryPostalCode", t("postalCode"), { autoComplete: "shipping postal-code" })}
                      {field("deliveryCity", t("city"), { autoComplete: "shipping address-level2" })}
                      {field("deliveryCountry", t("countryRequired"), { autoComplete: "shipping country-name" })}
                    </>
                  )}
                </div>

                {/* Met Enter in een veld kan de klant ook verder (onzichtbare verzendknop). */}
                <button type="submit" className="sr-only" tabIndex={-1} aria-hidden="true" />
              </form>
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

              {hasErrors && (
                <p role="alert" className="mt-6 text-sm font-medium text-destructive">
                  {t("errors.formIncomplete")}
                </p>
              )}

              <button
                type="button"
                className="mt-4 min-h-12 w-full rounded-lg bg-[#C69C4D] px-6 py-4 font-medium text-white hover:bg-[#B88D3C] disabled:opacity-50"
                disabled={!spec || submitting}
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
