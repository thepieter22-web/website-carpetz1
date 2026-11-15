/**
 * Tijdelijke onderhoudspagina (NL + FR) voor het live domein, zie middleware.ts.
 * Status 503 + Retry-After vertelt Google dat dit tijdelijk is: de vindbaarheid blijft behouden.
 */

const TEXT = {
  nl: {
    lang: 'nl',
    eyebrow: 'Binnenkort vernieuwd',
    title: 'We vernieuwen onze website',
    text: 'Onze nieuwe webshop voor logomatten, geprint tapijt en event tapijt op maat wordt op dit moment klaargezet. Binnenkort ben je weer welkom.',
    help: 'Een vraag of een dringende bestelling? We helpen je graag verder.',
    call: 'Bel ons',
    mail: 'Mail ons',
  },
  fr: {
    lang: 'fr',
    eyebrow: 'Bientôt de retour',
    title: 'Notre site fait peau neuve',
    text: 'Notre nouvelle boutique en ligne de tapis logo, tapis imprimés et tapis événementiels sur mesure est en cours de préparation. À très bientôt !',
    help: 'Une question ou une commande urgente ? Nous vous aidons volontiers.',
    call: 'Appelez-nous',
    mail: 'Écrivez-nous',
  },
} as const

function block(t: (typeof TEXT)['nl' | 'fr'], primary: boolean) {
  return `
    <section lang="${t.lang}" class="${primary ? 'primary' : 'secondary'}">
      <p class="eyebrow">${t.eyebrow}</p>
      <h${primary ? 1 : 2}>${t.title}</h${primary ? 1 : 2}>
      <p class="text">${t.text}</p>
      <p class="help">${t.help}</p>
      <div class="actions">
        <a class="btn btn-gold" href="tel:+32488236581">${t.call} · +32 488 23 65 81</a>
        <a class="btn btn-line" href="mailto:info@carpetz.be">${t.mail} · info@carpetz.be</a>
      </div>
    </section>`
}

export function GET(request: Request) {
  // Franstalige bezoekers zien eerst het Frans.
  const prefersFr = (request.headers.get('accept-language') ?? '').toLowerCase().startsWith('fr')
  const [first, second] = prefersFr ? [TEXT.fr, TEXT.nl] : [TEXT.nl, TEXT.fr]

  const html = `<!DOCTYPE html>
<html lang="${first.lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>Carpetz — ${first.title}</title>
  <meta name="description" content="${first.text}" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{min-height:100%}
    body{
      min-height:100vh;min-height:100dvh;display:flex;align-items:center;justify-content:center;
      padding:max(1.5rem,env(safe-area-inset-top)) 1rem max(1.5rem,env(safe-area-inset-bottom));
      font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#f7f4ee;
      background:#2a1e14 url('/images/hero-event-carpet.webp') center/cover no-repeat fixed;
    }
    body::before{content:"";position:fixed;inset:0;background:linear-gradient(120deg,rgba(33,24,16,.96),rgba(33,24,16,.82));}
    main{position:relative;width:100%;max-width:640px}
    .brand{font-family:Georgia,"Times New Roman",serif;font-size:1.75rem;font-weight:600;letter-spacing:-.01em;margin-bottom:2rem;display:flex;align-items:center;gap:.4rem}
    .brand span{width:.4rem;height:.4rem;border-radius:999px;background:#c69c4d;margin-top:.6rem}
    section{padding:2rem 1.5rem;border:1px solid rgba(198,156,77,.35);border-radius:6px;background:rgba(20,14,9,.55)}
    section.secondary{margin-top:1rem;padding:1.5rem}
    .eyebrow{color:#c69c4d;font-size:.75rem;font-weight:600;letter-spacing:.25em;text-transform:uppercase}
    h1,h2{font-family:Georgia,"Times New Roman",serif;font-weight:600;line-height:1.15;margin-top:.75rem;overflow-wrap:break-word}
    h1{font-size:clamp(1.75rem,6vw,2.5rem)}
    h2{font-size:clamp(1.25rem,4.5vw,1.6rem)}
    .text{margin-top:1rem;line-height:1.65;color:rgba(247,244,238,.85)}
    .help{margin-top:1rem;font-size:.9rem;color:rgba(247,244,238,.7)}
    .actions{margin-top:1.5rem;display:flex;flex-wrap:wrap;gap:.75rem}
    .btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:.75rem 1.25rem;border-radius:3px;font-size:.9rem;font-weight:600;text-decoration:none;text-align:center}
    .btn-gold{background:#c69c4d;color:#2a1e14}
    .btn-line{border:1px solid rgba(247,244,238,.45);color:#f7f4ee}
    .btn:focus-visible{outline:2px solid #c69c4d;outline-offset:3px}
    .secondary .text,.secondary .help{font-size:.9rem}
    @media (max-width:480px){.btn{width:100%}}
  </style>
</head>
<body>
  <main>
    <div class="brand">Carpetz<span aria-hidden="true"></span></div>
    ${block(first, true)}
    ${block(second, false)}
  </main>
</body>
</html>`

  return new Response(html, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': '86400',
      'Cache-Control': 'no-store',
    },
  })
}
