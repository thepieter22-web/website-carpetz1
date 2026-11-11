"use client"

import { useCallback, useEffect, useState } from "react"
import type React from "react"
import { Box, Loader2, Smartphone } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { MatConfig } from "@/lib/mat-config"
import { buildMatGlb } from "@/lib/mat-glb"

// Laat TypeScript het <model-viewer>-element in JSX toe.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string
        alt?: string
        ar?: string
        "ar-modes"?: string
        "ar-scale"?: string
        "ar-placement"?: string
        "camera-controls"?: string
        "camera-orbit"?: string
        "shadow-intensity"?: string
        "environment-image"?: string
        exposure?: string
        "touch-action"?: string
      }
    }
  }
}

const MAT_THICKNESS_M = 0.009
const MAX_TEXTURE_SIZE = 2048
const RUBBER_COLOR: [number, number, number] = [0.06, 0.06, 0.06]

/** Zelfde logica als de preview: bij "liggend" is de langste zijde de breedte. */
function getMatDimensionsCm(config: MatConfig) {
  const { width, height } = config.size
  const isLandscape = config.orientation === "landscape"
  return {
    widthCm: isLandscape ? Math.max(width, height) : Math.min(width, height),
    depthCm: isLandscape ? Math.min(width, height) : Math.max(width, height),
  }
}

/** Neemt het ontwerp uit de bestaande preview-canvas (zonder inbouwframe) als PNG. */
async function captureDesignPng(): Promise<Uint8Array | null> {
  const source = document.getElementById("carpetz-mat-preview-canvas") as HTMLCanvasElement | null
  if (!source || source.width === 0) return null

  const cssWidth = parseFloat(source.style.width) || source.width
  const ratio = source.width / cssWidth
  const inset = (parseFloat(source.dataset.matInset ?? "0") || 0) * ratio

  const sw = source.width - inset * 2
  const sh = source.height - inset * 2
  const scale = Math.min(1, MAX_TEXTURE_SIZE / Math.max(sw, sh))

  const out = document.createElement("canvas")
  out.width = Math.round(sw * scale)
  out.height = Math.round(sh * scale)
  const ctx = out.getContext("2d")
  if (!ctx) return null

  // Afgeronde hoeken in de preview zijn transparant: vul ze met de randkleur.
  ctx.fillStyle = "#101010"
  ctx.fillRect(0, 0, out.width, out.height)
  ctx.drawImage(source, inset, inset, sw, sh, 0, 0, out.width, out.height)

  const blob = await new Promise<Blob | null>((resolve) => out.toBlob(resolve, "image/png"))
  return blob ? new Uint8Array(await blob.arrayBuffer()) : null
}

interface MatArViewerProps {
  config: MatConfig
  /** "full": brede knop in het prijsoverzicht; "compact": kleine knop in de mobiele bestelbalk. */
  variant?: "full" | "compact"
}

/** model-viewer één keer inladen (gedeeld door alle knoppen). */
let modelViewerImport: Promise<unknown> | null = null
function loadModelViewer() {
  modelViewerImport ??= import("@google/model-viewer")
  return modelViewerImport
}

export function MatArViewer({ config, variant = "full" }: MatArViewerProps) {
  const t = useTranslations("ArViewer")
  const [open, setOpen] = useState(false)
  const [isBuilding, setIsBuilding] = useState(false)
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [canUseAr, setCanUseAr] = useState<boolean | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [arFailed, setArFailed] = useState(false)

  const { widthCm, depthCm } = getMatDimensionsCm(config)

  // Op smartphones/tablets model-viewer alvast op de achtergrond laden, zodat 3D/AR meteen opent.
  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return
    const preload = () => void loadModelViewer()
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(preload, { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const timer = setTimeout(preload, 2500)
    return () => clearTimeout(timer)
  }, [])

  // Oude blob-URL opruimen zodra er een nieuwe is of de component verdwijnt.
  useEffect(() => {
    return () => {
      if (modelUrl) URL.revokeObjectURL(modelUrl)
    }
  }, [modelUrl])

  // Na het laden weet model-viewer of dit toestel AR ondersteunt; ook mislukte AR-sessies opvangen.
  const viewerRef = useCallback((viewer: HTMLElement | null) => {
    if (!viewer) return
    viewer.addEventListener("load", () => {
      setIsLoaded(true)
      setCanUseAr(Boolean((viewer as HTMLElement & { canActivateAR?: boolean }).canActivateAR))
    })
    viewer.addEventListener("ar-status", (event) => {
      const status = (event as CustomEvent<{ status: string }>).detail?.status
      if (status === "failed") setArFailed(true)
    })
  }, [])

  const handleOpen = useCallback(async () => {
    setIsBuilding(true)
    setError(null)
    setCanUseAr(null)
    setIsLoaded(false)
    setArFailed(false)
    try {
      // 3D-bestand bouwen en model-viewer laden gebeuren tegelijk.
      const [png] = await Promise.all([captureDesignPng(), loadModelViewer()])
      if (!png) throw new Error("preview canvas not found")

      const glb = buildMatGlb({
        widthM: widthCm / 100,
        depthM: depthCm / 100,
        thicknessM: MAT_THICKNESS_M,
        texturePng: png,
        edgeColor: RUBBER_COLOR,
      })
      setModelUrl(URL.createObjectURL(glb))
      setOpen(true)
    } catch {
      if (variant === "compact") alert(t("error"))
      else setError(t("error"))
    } finally {
      setIsBuilding(false)
    }
  }, [widthCm, depthCm, t, variant])

  const icon = isBuilding ? <Loader2 className="size-4 animate-spin" /> : <Box className="size-4" />

  return (
    <>
      {variant === "compact" ? (
        <Button
          type="button"
          variant="outline"
          className="h-12 shrink-0 gap-1.5 border-[#C69C4D] px-3 text-[#3B2A1A]"
          onClick={handleOpen}
          disabled={isBuilding}
          aria-label={t("button")}
        >
          {icon}
          {t("compact")}
        </Button>
      ) : (
        <>
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full gap-2 border-[#C69C4D] text-base text-[#3B2A1A] hover:bg-[#FFF8EB]"
            onClick={handleOpen}
            disabled={isBuilding}
          >
            {icon}
            {t("button")}
          </Button>
          {error && (
            <p className="text-xs text-destructive" role="alert">
              {error}
            </p>
          )}
        </>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        {/* Op smartphone schermvullend; op groter scherm een venster. */}
        <DialogContent className="flex flex-col max-sm:inset-0 max-sm:top-0 max-sm:left-0 max-sm:h-[100dvh] max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
          </DialogHeader>

          {modelUrl && (
            <div className="relative min-h-[320px] w-full flex-1 overflow-hidden rounded-lg bg-[#F4EFE6] sm:h-[60vh] sm:flex-none">
              <model-viewer
                ref={viewerRef}
                src={modelUrl}
                alt={t("alt", { width: widthCm, depth: depthCm })}
                ar=""
                ar-modes="webxr quick-look"
                ar-scale="fixed"
                ar-placement="floor"
                camera-controls=""
                camera-orbit="0deg 55deg auto"
                shadow-intensity="1"
                environment-image="neutral"
                exposure="1"
                touch-action="pan-y"
                style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
              >
                <button
                  slot="ar-button"
                  type="button"
                  className="absolute bottom-4 left-1/2 flex h-12 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center justify-center gap-2 rounded-full bg-[#C69C4D] px-6 text-base font-semibold text-white shadow-lg active:scale-[0.98]"
                >
                  <Smartphone className="size-5" />
                  {t("viewInRoom")}
                </button>
              </model-viewer>

              {!isLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-6 animate-spin text-[#C69C4D]" />
                  {t("loading")}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              {t("trueSize")} <strong className="text-foreground">{widthCm} × {depthCm} cm</strong>
            </span>
            <span>{t("controls")}</span>
          </div>

          {canUseAr === true && !arFailed && (
            <p className="rounded-md bg-[#FFF8EB] p-3 text-xs text-[#3B2A1A]">{t("arHint")}</p>
          )}
          {arFailed && (
            <p className="rounded-md bg-muted p-3 text-xs text-muted-foreground" role="alert">
              {t("arFailed")}
            </p>
          )}
          {canUseAr === false && <p className="rounded-md bg-muted p-3 text-xs text-muted-foreground">{t("noAr")}</p>}
        </DialogContent>
      </Dialog>
    </>
  )
}
