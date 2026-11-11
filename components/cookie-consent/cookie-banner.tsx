"use client"

import { useEffect, useState } from "react"
import { Link } from "@/navigation"
import { useTranslations } from "next-intl"
import { Cookie } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import {
  onOpenCookieSettings,
  saveConsent,
  useConsent,
  type ConsentCategory,
  type ConsentChoices,
} from "@/lib/cookie-consent"

const OPTIONAL_CATEGORIES: ConsentCategory[] = ["statistics", "marketing"]

export function CookieBanner() {
  const t = useTranslations("CookieConsent")
  const { ready, consent } = useConsent()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [choices, setChoices] = useState<ConsentChoices>({ statistics: false, marketing: false })

  // Voorkeurenvenster openen vanuit de footer-link.
  useEffect(() => onOpenCookieSettings(() => setSettingsOpen(true)), [])

  // Bij openen: huidige keuze tonen (of alles uit als er nog geen keuze is).
  useEffect(() => {
    if (settingsOpen) {
      setChoices({ statistics: consent?.statistics ?? false, marketing: consent?.marketing ?? false })
    }
  }, [settingsOpen, consent])

  const acceptAll = () => {
    saveConsent({ statistics: true, marketing: true })
    setSettingsOpen(false)
  }
  const rejectAll = () => {
    saveConsent({ statistics: false, marketing: false })
    setSettingsOpen(false)
  }
  const saveChoices = () => {
    saveConsent(choices)
    setSettingsOpen(false)
  }

  // Pas renderen in de browser: zo flitst de banner niet bij bezoekers die al gekozen hebben.
  const showBanner = ready && !consent && !settingsOpen

  return (
    <>
      {showBanner && (
        <div
          role="region"
          aria-labelledby="cookie-banner-title"
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-card/95 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm animate-in slide-in-from-bottom duration-300 motion-reduce:animate-none"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:gap-8 lg:px-8">
            <div className="flex gap-3 lg:flex-1">
              <Cookie className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              <div className="space-y-1">
                <p id="cookie-banner-title" className="text-sm font-semibold text-foreground">
                  {t("title")}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("text")}{" "}
                  <Link href="/privacybeleid" className="font-medium text-foreground underline underline-offset-2 hover:text-accent">
                    {t("privacyLink")}
                  </Link>
                </p>
              </div>
            </div>

            {/* Accepteren en weigeren even zichtbaar: vereist door de GBA. */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex lg:shrink-0">
              <Button variant="outline" onClick={() => setSettingsOpen(true)}>
                {t("customize")}
              </Button>
              <Button variant="outline" onClick={rejectAll}>
                {t("rejectAll")}
              </Button>
              <Button onClick={acceptAll}>{t("acceptAll")}</Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("settingsTitle")}</DialogTitle>
            <DialogDescription>{t("settingsText")}</DialogDescription>
          </DialogHeader>

          <ul className="divide-y divide-border rounded-lg border border-border">
            <li className="flex items-start justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-medium">{t("necessary.title")}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t("necessary.text")}</p>
              </div>
              <span className="shrink-0 text-xs font-medium text-muted-foreground">{t("alwaysOn")}</span>
            </li>

            {OPTIONAL_CATEGORIES.map((category) => (
              <li key={category} className="flex items-start justify-between gap-4 p-4">
                <label htmlFor={`cookie-${category}`} className="cursor-pointer">
                  <span className="block text-sm font-medium">{t(`${category}.title`)}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    {t(`${category}.text`)}
                  </span>
                </label>
                <Switch
                  id={`cookie-${category}`}
                  className="mt-0.5"
                  checked={choices[category]}
                  onCheckedChange={(checked) => setChoices((prev) => ({ ...prev, [category]: checked }))}
                />
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Button variant="outline" onClick={rejectAll}>
              {t("rejectAll")}
            </Button>
            <Button variant="outline" onClick={saveChoices}>
              {t("save")}
            </Button>
            <Button onClick={acceptAll}>{t("acceptAll")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
