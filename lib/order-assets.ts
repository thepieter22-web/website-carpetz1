/**
 * Bewaart het voorbeeld en het originele logo tussen configurator en winkelwagen.
 *
 * Eerst sessionStorage (overleeft een herlaadbeurt). Grote logo's (bv. een foto
 * van een smartphone) passen daar vaak niet in (limiet ~5 MB); dan blijven ze
 * in het geheugen, wat volstaat omdat de overgang naar de winkelwagen een
 * client-side navigatie is.
 */
const memory = new Map<string, string>()

export type OrderAssetKey = "matPreview" | "matLogo"

export function saveOrderAsset(key: OrderAssetKey, value: string) {
  memory.set(key, value)
  try {
    sessionStorage.setItem(key, value)
  } catch {
    // Te groot voor sessionStorage: oude waarde wissen zodat er geen verkeerd logo blijft hangen.
    try {
      sessionStorage.removeItem(key)
    } catch {}
  }
}

export function readOrderAsset(key: OrderAssetKey): string {
  try {
    const stored = sessionStorage.getItem(key)
    if (stored) return stored
  } catch {}
  return memory.get(key) ?? ""
}
