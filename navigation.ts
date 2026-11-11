import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import { locales } from './i18n'

/**
 * Taalbewuste navigatie. Gebruik deze `Link`, `redirect`, `usePathname` en `useRouter`
 * in plaats van die van `next/link` / `next/navigation`: ze zetten automatisch
 * de huidige taal (/nl of /fr) voor elk pad.
 */
export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({ locales })
