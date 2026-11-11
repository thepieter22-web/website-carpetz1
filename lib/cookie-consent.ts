"use client"

import { useEffect, useState } from "react"

/**
 * Cookietoestemming (GDPR/AVG + Belgische Gegevensbeschermingsautoriteit).
 *
 * - Noodzakelijke cookies staan altijd aan en hebben geen toestemming nodig.
 * - Statistieken en marketing staan standaard UIT tot de bezoeker akkoord geeft.
 * - De keuze vervalt na CONSENT_MAX_AGE_DAYS of als CONSENT_VERSION verhoogd wordt
 *   (verhoog die als je nieuwe soorten tracking toevoegt: dan moet je opnieuw vragen).
 */

export type ConsentCategory = "statistics" | "marketing"

export type ConsentChoices = Record<ConsentCategory, boolean>

export interface StoredConsent extends ConsentChoices {
  necessary: true
  version: number
  updatedAt: string
}

const STORAGE_KEY = "carpetz-cookie-consent"
export const CONSENT_VERSION = 1
const CONSENT_MAX_AGE_DAYS = 182
const CHANGE_EVENT = "carpetz:consent-change"
const OPEN_SETTINGS_EVENT = "carpetz:open-cookie-settings"

/** First-party cookies die tracking-scripts zetten; worden gewist bij intrekken. */
const TRACKING_COOKIES: Record<ConsentCategory, string[]> = {
  statistics: ["_clck", "_clsk"], // Microsoft Clarity
  marketing: [], // bv. "_fbp" voor de Meta-pixel
}

export function readConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredConsent
    const ageMs = Date.now() - new Date(parsed.updatedAt).getTime()
    const expired = !Number.isFinite(ageMs) || ageMs > CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000
    if (parsed.version !== CONSENT_VERSION || expired) return null
    return parsed
  } catch {
    return null
  }
}

function deleteCookie(name: string) {
  const host = window.location.hostname
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`]
  for (const domain of domains) {
    document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`
  }
}

export function saveConsent(choices: ConsentChoices) {
  const previous = readConsent()
  const consent: StoredConsent = {
    necessary: true,
    statistics: choices.statistics,
    marketing: choices.marketing,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))

  // Toestemming ingetrokken? Cookies wissen en herladen, zodat al geladen scripts stoppen.
  const withdrawn = (Object.keys(TRACKING_COOKIES) as ConsentCategory[]).filter(
    (category) => previous?.[category] && !choices[category]
  )
  if (withdrawn.length > 0) {
    withdrawn.forEach((category) => TRACKING_COOKIES[category].forEach(deleteCookie))
    window.location.reload()
    return
  }

  window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
}

/** Opent het voorkeurenvenster opnieuw (bv. via "Cookie-instellingen" in de footer). */
export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT))
}

export function onOpenCookieSettings(handler: () => void) {
  window.addEventListener(OPEN_SETTINGS_EVENT, handler)
  return () => window.removeEventListener(OPEN_SETTINGS_EVENT, handler)
}

/** Huidige toestemming. `ready` is false tot de opgeslagen keuze in de browser gelezen is. */
export function useConsent() {
  const [state, setState] = useState<{ ready: boolean; consent: StoredConsent | null }>({
    ready: false,
    consent: null,
  })

  useEffect(() => {
    const update = () => setState({ ready: true, consent: readConsent() })
    update()
    window.addEventListener(CHANGE_EVENT, update)
    // Keuze gemaakt in een ander tabblad.
    window.addEventListener("storage", update)
    return () => {
      window.removeEventListener(CHANGE_EVENT, update)
      window.removeEventListener("storage", update)
    }
  }, [])

  return state
}
