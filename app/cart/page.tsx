"use client";

import { useEffect } from "react";
import { useState } from "react";
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

const vatRate = 0.21;

const shipping = 15;

const productExclVat = subtotal / (1 + vatRate);

const vatAmount =
  (productExclVat + shipping) * vatRate;

const grandTotal =
  productExclVat +
  shipping +
  vatAmount;


  const matNames: Record<string, string> = {
    normal: "Classic",
    eco: "Eco",
    budget: "Professional",
    luxe: "Elite",
  };
  
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

useEffect(() => {
  const image = sessionStorage.getItem("matPreview");

  if (image) {
    setPreviewImage(image);
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

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

            {/* Linkerkolom */}
<div>

  {previewImage && (
    <div className="mb-6 rounded-xl border bg-card p-4 shadow-sm">
      <img
        src={previewImage}
        alt="Logomatunded-xl border bg-card p-8 shadow-sm">
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
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground">Aantal</span>
                    <p className="font-medium">
                      {searchParams.quantity}
                    </p>
                  </div>

                </div>
              </div>

              <div className="mt-8 rounded-xl border bg-card p-8 shadow-sm">
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

                <div className="mt-6 grid gap-4 md:grid-cols-2">

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

                  <h3 className="mt-8 text-lg font-semibold">
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
            <div className="rounded-xl border bg-card p-8 shadow-sm h-fit sticky top-24">

              <h2 className="text-xl font-semibold">
                Bestelsamenvatting
              </h2>

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
  className="mt-8 w-full rounded-lg bg-[#C69C4D] px-6 py-4 text-white font-medium hover:bg-[#B88D3C]"
  onClick={async () => { 

    const canvas = document.getElementById(
  "carpetz-mat-preview-canvas"
) as HTMLCanvasElement | null;

let previewImage = "";

if (canvas) {
  previewImage = canvas.toDataURL("image/png");
}
    
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

    
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  amount: grandTotal,
        subtotal: productExclVat.toFixed(2),
vat: vatAmount.toFixed(2),
shipping: shipping.toFixed(2),
grandTotal: grandTotal.toFixed(2),

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

  matType: searchParams.type,
width: searchParams.width,
height: searchParams.height,
quantity: searchParams.quantity,
total: grandTotal,
        
        
}),
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
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
