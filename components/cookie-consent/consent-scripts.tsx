"use client"

import Script from "next/script"
import { useConsent } from "@/lib/cookie-consent"

/**
 * Laadt tracking-scripts pas NA toestemming.
 * Nieuwe scripts (Google Analytics, Meta-pixel, ...) horen hier, onder de juiste categorie.
 */
export function ConsentScripts() {
  const { consent } = useConsent()

  return (
    <>
      {consent?.statistics && (
        <Script
          id="clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "y929gps4zk");
            `,
          }}
        />
      )}

      {consent?.marketing && (
        <>
          {/* Marketing-pixels (bv. Meta, Google Ads, LinkedIn) komen hier. */}
        </>
      )}
    </>
  )
}
