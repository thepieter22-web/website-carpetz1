
"use client";

import { useEffect } from "react";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { calculateOrderTotals, parseOrderSpec } from "@/lib/mat-config";

export default function CartPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  // Enkel specificaties komen uit de URL; prijzen worden hier alleen
  // voor weergave berekend. De checkout API rekent zelf opnieuw.
  const spec = parseOrderSpec(searchParams);
  const totals = spec ? calculateOrderTotals(spec) : null;

  const grandTotal = totals?.grandTotal ?? 0;
  const shipping = totals?.shipping ?? 0;
  const vatAmount = totals?.vat ?? 0;
  const productExclVat = totals?.productExclVat ?? 0;

  const matNames: Record<string, string> = {
    go: "Carpetz Go",
    green: "Carpetz Green",
    studio: "Carpetz Studio",
    pro: "Carpetz Pro",
    grip: "Carpetz Grip",
    scrape: "Carpetz Scrape",
  };
  const matName = spec
    ? matNames[spec.type === "outdoor" ? spec.outdoorSubtype : spec.indoorSubtype]
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
const [country, setCountry] = useState("België");
  const [sameAddress, setSameAddress] = useState(true);
  const [previewImage, setPreviewImage] = useState("");
  const [logoImage, setLogoImage] = useState("");

useEffect(() => {
  const image = sessionStorage.getItem("matPreview");
  if (image) {
    setPreviewImage(image);
  }

  const logo = sessionStorage.getItem("matLogo");
  if (logo) {
    setLogoImage(logo);
  }
}, []);

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

          <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">

           {/* Linkerkolom */}
<div className="min-w-0">

  

              <div className="rounded-xl border bg-card p-8 shadow-sm">
                <h2 className="text-2xl font-semibold">
                  Klantgegevens
                </h2>

                <div className="mt-6 flex gap-4">
  <button
    type="button"
    onClick={() => setCustomerType("particulier")}
    className={`rounded-lg border px-4 py-2 ${
      customerType === "particulier"
        ? "bg-[#C69C4D] text-white"
        : ""
    }`}
  >
    Particulier
  </button>

  <button
    type="button"
    onClick={() => setCustomerType("zakelijk")}
    className={`rounded-lg border px-4 py-2 ${
      customerType === "zakelijk"
        ? "bg-[#C69C4D] text-white"
        : ""
    }`}
  >
    Zakelijk
  </button>
</div>

                <div className="mt-6 flex flex-col gap-4">

                  {customerType === "zakelijk" && (
  <>
    <input
  required
  className="rounded-lg border p-3"
  placeholder="Bedrijfsnaam *"
  value={company}
  onChange={(e) => setCompany(e.target.value)}
/>

    <input
  required
  className="rounded-lg border p-3"
  placeholder="BTW-nummer *"
  value={vatNumber}
  onChange={(e) => setVatNumber(e.target.value)}
/>
  </>
)}

                 <input
  required
  className="rounded-lg border p-3"
  placeholder="Voornaam *"
  value={firstName}
  onChange={(e) => setFirstName(e.target.value)}
/>

                  <input
  required
  className="rounded-lg border p-3"
  placeholder="Achternaam *"
  value={lastName}
  onChange={(e) => setLastName(e.target.value)}
/>
 
                  <input
  required
  className="rounded-lg border p-3"
  placeholder="E-mailadres *"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

                  <input
  required
  className="rounded-lg border p-3"
  placeholder="Telefoonnummer *"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
/>

                  <h3 className="col-span-1 md:col-span-2 mt-8 text-lg font-semibold">
  {customerType === "zakelijk"
    ? "Factuuradres"
    : "Leveringsadres"}
</h3>


                 
                  

<input
  required
  className="col-span-2 rounded-lg border p-3"
  placeholder="Straat en huisnummer *"
  value={street}
  onChange={(e) => setStreet(e.target.value)}
/>

<input
  required
  className="rounded-lg border p-3"
  placeholder="Postcode *"
  value={postalCode}
  onChange={(e) => setPostalCode(e.target.value)}
/>

<input
  required
  className="rounded-lg border p-3"
  placeholder="Gemeente *"
  value={city}
  onChange={(e) => setCity(e.target.value)}
/>

<input
  required
  className="rounded-lg border p-3"
  placeholder="Land"
  value={country}
  onChange={(e) => setCountry(e.target.value)}
/>
                  
{customerType === "zakelijk" && (
  <label className="col-span-2 flex items-center gap-2 text-sm">
    <input
      type="checkbox"
      checked={sameAddress}
      onChange={(e) => setSameAddress(e.target.checked)}
    />
    Leveradres is hetzelfde als factuuradres
  </label>
)}

{customerType === "zakelijk" && !sameAddress && (
  <>
    <h3 className="col-span-2 mt-4 text-lg font-semibold">
      Leveringsadres
    </h3>

    <input
      className="col-span-2 rounded-lg border p-3"
      placeholder="Straat en huisnummer *"
    />

    <input
      className="rounded-lg border p-3"
      placeholder="Postcode *"
    />

    <input
      className="rounded-lg border p-3"
      placeholder="Gemeente *"
    />

    <input
      className="rounded-lg border p-3"
      placeholder="Land *"
      defaultValue="België"
    />
  </>
)}
                  
                  

                </div>
              </div>

            </div>

            {/* Rechterkolom */}
            <div className="rounded-xl border bg-card p-8 shadow-sm sticky top-24 self-start">

              <h2 className="text-xl font-semibold mb-4">
  Bestelsamenvatting
</h2>

              {previewImage && (
    <img
      src={previewImage}
      alt="Logomat preview"
      className="mb-6 max-h-[300px] w-full object-contain rounded-lg border"  />
)}
 

   

              <div className="rounded-lg border p-4">
 <h3 className="mb-2 text-base font-semibold">
  Jouw logomat
</h3>

  <div className="grid grid-cols-3 gap-4">
    <div>
      <p className="text-sm text-muted-foreground">Type</p>
      <p className="font-medium">
        {matName}
      </p>
    </div>

    <div>
      <p className="text-sm text-muted-foreground">Afmetingen</p>
      <p className="font-medium">
        {spec?.width} × {spec?.height} cm
      </p>
    </div>

    <div>
      <p className="text-sm text-muted-foreground">Aantal</p>
      <p className="font-medium">
        {spec?.quantity}
      </p>
    </div>
  </div>
</div>

              <div className="mt-6 space-y-4">

               <div className="flex justify-between">
  <span>Productprijs excl. btw</span>
  <span>€{productExclVat.toFixed(2)}</span>
</div>

<div className="flex justify-between">
  <span>Leveringskost excl. btw</span>
  <span>€{shipping.toFixed(2)}</span>
</div>

<div className="flex justify-between">
  <span>BTW (21%)</span>
  <span>€{vatAmount.toFixed(2)}</span>
</div>

                <div className="border-t pt-4 flex justify-between">
                  <span className="font-semibold">Totaal incl. btw</span>

                  <span className="text-2xl font-bold text-[#C69C4D]">
                    €{grandTotal.toFixed(2)}
                  </span>
                </div>

              </div>

              <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                <p>✅ Digitale proefdruk inbegrepen</p>
                <p>✅ Productie na goedkeuring</p>
                <p>✅ Levering België & Nederland</p>
              </div>

              <button
  className="mt-8 w-full rounded-lg bg-[#C69C4D] px-6 py-4 text-white font-medium hover:bg-[#B88D3C] disabled:opacity-50"
  disabled={!spec}
  onClick={async () => {
  if (!spec) return;

  const previewImage =
  sessionStorage.getItem("matPreview") || "";

const logoImage =
  sessionStorage.getItem("matLogo") || "";



console.log("TEST BUTTON");
console.log({
  customerType,
  firstName,
  lastName,
  email,
  phone,
  company,
  vatNumber,
});

console.log("PREVIEW IMAGE IN CART:");
console.log(previewImage);    

const response = await fetch("/api/create-checkout-session", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    previewImage,
    logoImage,

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
      alert(data.error || "Er ging iets mis bij het afrekenen.");
    }
  }}
>
  Doorgaan naar afrekenen
</button>

            </div>

          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
