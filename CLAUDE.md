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
- **Grids**: meerdere kolommen enkel vanaf een breakpoint (`grid-cols-1 sm:grid-cols-3`), behalve bewuste mini-layouts (kleurstalen, keuzeknoppen, productkaartjes 2 per rij).
- **Zijmarge**: elke sectie/container minstens `px-4` op smartphone (`px-4 sm:px-6 lg:px-8`); niets tegen de schermrand.
- **Koppen** schalen mee: `text-3xl sm:text-4xl`, `text-3xl sm:text-5xl lg:text-6xl`; nooit `text-4xl`+ zonder kleinere basismaat.
- **Geen negatieve marges op smartphone** om blokken over een titelbalk te laten hangen (`mt-6 sm:-mt-24`).
- **Header**: is `sticky` (4.5rem hoog); `scroll-padding-top` in `globals.css` zorgt dat ankers er niet achter vallen. Nieuwe vaste (`fixed`) elementen houden rekening met `env(safe-area-inset-bottom)`.
- **Knoppen** mogen op smartphone afbreken (zit in `components/ui/button.tsx`): geef ze geen vaste `h-*` maar `min-h-*`.
- Testen op een smal scherm (360 px breed) in beide talen; Franse teksten zijn vaak langer.
