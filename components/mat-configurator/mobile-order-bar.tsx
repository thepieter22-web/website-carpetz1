"use client"

import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MatConfig } from "@/lib/mat-config"
import { usePriceFormatter } from "@/lib/format"
import { getPriceSummary } from "./price-calculator"
import { MatArViewer } from "./mat-ar-viewer"

interface MobileOrderBarProps {
  config: MatConfig
  onOrder: () => void
  /** Id van het volledige prijsoverzicht: zolang dat in beeld is, verdwijnt de balk. */
  summaryId: string
}

/**
 * Vaste balk onderaan op smartphone/tablet met totaalprijs, 3D/AR en bestellen.
 * Enkel zichtbaar terwijl de configurator in beeld is.
 */
export function MobileOrderBar({ config, onOrder, summaryId }: MobileOrderBarProps) {
  const t = useTranslations("Configurator")
  const formatPrice = usePriceFormatter()
  const { finalTotal } = getPriceSummary(config)
  const anchorRef = useRef<HTMLDivElement>(null)
  const [inConfigurator, setInConfigurator] = useState(false)
  const [summaryVisible, setSummaryVisible] = useState(false)

  useEffect(() => {
    const root = anchorRef.current?.closest("main")
    const summary = document.getElementById(summaryId)
    if (!root) return

    const rootObserver = new IntersectionObserver(([entry]) => setInConfigurator(entry.isIntersecting))
    rootObserver.observe(root)

    const summaryObserver = new IntersectionObserver(([entry]) => setSummaryVisible(entry.isIntersecting), {
      threshold: 0.25,
    })
    if (summary) summaryObserver.observe(summary)

    return () => {
      rootObserver.disconnect()
      summaryObserver.disconnect()
    }
  }, [summaryId])

  const visible = inConfigurator && !summaryVisible

  return (
    <div ref={anchorRef}>
      <div
        role="region"
        aria-label={t("mobileBarLabel")}
        aria-hidden={!visible}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 shadow-[0_-6px_24px_rgba(0,0,0,0.08)] transition-transform duration-200 motion-reduce:transition-none lg:hidden ${
          visible ? "translate-y-0" : "pointer-events-none translate-y-full"
        }`}
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-3 pt-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {t("mobileTotal")}
            </p>
            <p className="text-lg font-bold leading-tight text-[#3B2A1A]">{formatPrice(finalTotal)}</p>
          </div>
          <MatArViewer config={config} variant="compact" />
          <Button className="h-12 bg-[#C69C4D] px-4 text-base text-white hover:bg-[#B88D3C]" onClick={onOrder}>
            {t("mobileOrder")}
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
