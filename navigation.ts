import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

/**
 * Taalbewuste navigatie. Gebruik deze `Link`, `redirect`, `usePathname` en `useRouter`
 * in plaats van die van `next/link` / `next/navigation`: ze zetten automatisch
 * de huidige taal (/nl of /fr) voor elk pad, en vertalen het pad waar nodig
 * (bv. /event-tapijt → /fr/tapis-evenementiel, zie `routing.ts`).
 * Gebruik altijd het interne (Nederlandse) pad als href.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
