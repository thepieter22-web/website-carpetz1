# Carpetz — werkafspraken

## Tweetalige website (NL + FR) — verplicht bij elke wijziging

De site is volledig tweetalig: Nederlands (`/nl`) en Frans (`/fr`). Elke wijziging die tekst toevoegt of aanpast, moet in **dezelfde wijziging** in beide talen gebeuren. Er gaat nooit iets live in maar één taal.

**Regels**
1. **Geen hardcoded tekst in componenten.** Alle zichtbare tekst (koppen, knoppen, labels, placeholders, `alt`, `aria-label`, foutmeldingen, `alert()`, metadata/SEO, e-mails, factuurregels) staat in `messages/nl.json` én `messages/fr.json`, onder dezelfde sleutel.
   - Componenten: `useTranslations('Namespace')`; async server-code en API-routes: `getTranslations({ locale, namespace })`.
   - Lijsten (arrays): `t.raw('sleutel') as string[]`. Geneste objecten (bv. `MatTypes`): `useMessages()` / `getMessages()`.
   - Variabelen via ICU-placeholders: `"Bestelnummer: {number}"` → `t('orderNumber', { number })`.
2. **Links altijd via `@/navigation`** (`Link`, `useRouter`, `usePathname`, `redirect`), nooit `next/link` of `window.location` met een vast pad. Zo blijft de bezoeker in zijn taal.
3. **Prijzen** via `usePriceFormatter()` uit `@/lib/format` (nl: `€ 17,50`, fr: `17,50 €`).
4. **Nieuwe pagina's** krijgen `generateMetadata` met vertaalde titel/omschrijving en `alternates: localizedAlternates(locale, '/pad')` uit `@/lib/seo` (canonical + hreflang). Voeg publieke pagina's ook toe aan `app/sitemap.ts`.
5. **Productdata** van de logomatten staat in `messages/*.json` onder `MatTypes`; `lib/mat-type-data.ts` bevat enkel foto's en iconen.
6. **Client-componenten** (`'use client'`) met een nieuwe namespace: voeg die toe aan `CLIENT_NAMESPACES` in `app/[locale]/layout.tsx`, anders ontbreekt de vertaling in de browser.
7. **Controleer altijd** met `pnpm i18n:check` (zelfde sleutels in beide talen, geen lege of onvertaalde Franse teksten) en `npx tsc --noEmit` (onbekende sleutels geven een typefout via `global.d.ts`).

**Toon van het Frans**
- Professioneel B2B/e-commerce, Belgisch Frans, altijd de **vous**-vorm.
- Vaste termen: logomat → *tapis logo*; geprint tapijt → *tapis imprimé* (vloertapijt → *moquette imprimée*); event tapijt → *tapis événementiel*; rode loper → *tapis rouge*; offerte → *devis*; proefdruk → *épreuve numérique (BAT)*; configurator → *configurateur*; excl./incl. btw → *hors TVA* / *TVA comprise*; rugmateriaal → *dossier*; pool → *velours*; brandgedrag → *réaction au feu*; schoonloopmat → *tapis anti-salissures*.
- Typografie: spatie vóór `:`, `?`, `!` en `%` (`Total : 25 %`), Franse aanhalingstekens « … », typografische apostrof `’`.
- Merknamen (Carpetz Go/Green/Studio/Pro/Grip/Scrape, Velvet, Globosoft, Pxl) en normen (EN13501-1, NFSI) blijven onvertaald.

**Uitzondering:** de interne bestelmail naar info@carpetz.be blijft Nederlands (vermeldt wel de taal van de klant).

## Mobiel eerst

Mobiele bezoekers hebben prioriteit. Bij elke wijziging:
- Aanraakdoelen minstens 48×48 px op touchtoestellen (gebruik `pointer-coarse:`; de knoppen en velden in `components/ui` doen dit al).
- Invoervelden op touch minimaal 16px tekst (anders zoomt iOS in), met passende `inputMode`/`autoComplete`.
- Afbeeldingen altijd via `next/image` met een passende `sizes`; geen grote bestanden rechtstreeks laden.
- Zware berekeningen (canvas, pixelbewerkingen) niet bij elke beweging herhalen: resultaten bewaren.
- Testen op een smal scherm (360 px breed) in beide talen; Franse teksten zijn vaak langer.
