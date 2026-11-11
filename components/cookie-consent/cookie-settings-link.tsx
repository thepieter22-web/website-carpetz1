"use client"

import { useTranslations } from "next-intl"
import { openCookieSettings } from "@/lib/cookie-consent"

export function CookieSettingsLink({ className }: { className?: string }) {
  const t = useTranslations("Footer")
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      {t("cookieSettings")}
    </button>
  )
}
