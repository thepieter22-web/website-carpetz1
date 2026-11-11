"use client"
import { getMatTypes } from "@/lib/mat-type-data"
import { useMessages, useTranslations } from "next-intl"
import { useRouter } from "@/navigation"
import { Check as CheckIcon, Sparkles } from "lucide-react"
import Image from "next/image"
import { PRINTGRASS_COLORS } from "@/lib/printgrass-colors"
import { useState, useCallback, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ColorPalette } from "./color-palette"
import { MatCanvas } from "./mat-canvas"
import { LogoUploader } from "./logo-uploader"
import { PriceCalculator } from "./price-calculator"
import { MobileOrderBar } from "./mobile-order-bar"
import { saveOrderAsset } from "@/lib/order-assets"
import { STANDARD_SIZES, type MatConfig, MAT_COLORS } from "@/lib/mat-config"
import { SIGNATURE_COLORS } from "@/lib/signature-colors"
import { useSearchParams } from "next/navigation"
import {
  Layers,
  Image as ImageIcon,
  ShoppingCart,
  RotateCcw,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Check,
  Palette as PaletteIcon,
} from "lucide-react"

const TYPE_PREVIEW_IMAGES: Record<string, string> = {
  "indoor-go": "/images/logomat-CarpetzGo-detail.webp",
  "indoor-green": "/images/logomat-CarpetzGreen-detail.webp",
  "indoor-studio": "/images/logomat-CarpetzStudio-detail.webp",
  "indoor-pro": "/images/logomat-CarpetzPro-detail.webp",
    "outdoor-grip": "/images/logomat-printgrass-detail.webp",
  "outdoor-scrape": "/images/logomat-signature-detail.webp",
}

const DEFAULT_CONFIG: MatConfig = {
  type: "indoor",
  indoorSubtype: "go",
  outdoorSubtype: "grip",
  placement: "floor",
  orientation: "landscape",
  rubberBorder: true,
  size: {
    width: 85,
    height: 115,
    isCustom: false,
  },
  colorCode: "C1",
  logo: {
    file: null,
    dataUrl: null,
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    rotation: 0,
  },
  quantity: 1,
  logoColors: 1,
}

type IndoorSubtype = "go" | "green" | "studio" | "pro"
type OutdoorSubtype = "grip" | "scrape"
type VisibleTypeBlock = "indoor" | "outdoor" | null

export function MatConfigurator() {
  const t = useTranslations("Configurator")
  const mats = getMatTypes(useMessages())
  const router = useRouter()
  const searchParams = useSearchParams()
  const [config, setConfig] = useState<MatConfig>(DEFAULT_CONFIG)
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [maxStepReached, setMaxStepReached] = useState<number>(1)
  const [suggestedColorCodes, setSuggestedColorCodes] = useState<string[]>([])
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null)
  const [logoInfo, setLogoInfo] = useState({
    width: 0,
    height: 0,
    format: "",
    colors: 0,
  })

  const [indoorSubtype, setIndoorSubtype] = useState<IndoorSubtype>(DEFAULT_CONFIG.indoorSubtype)
    const [outdoorSubtype, setOutdoorSubtype] = useState<OutdoorSubtype>("grip")
  const [visibleTypeBlock, setVisibleTypeBlock] = useState<VisibleTypeBlock>(null)

    useEffect(() => {
    if (config.logo.dataUrl) {
      const img = new window.Image()
      img.crossOrigin = "anonymous"
      img.onload = () => setLogoImage(img)
      img.src = config.logo.dataUrl
    } else {
      setLogoImage(null)
    }
  }, [config.logo.dataUrl])

  useEffect(() => {
    const typeParam = searchParams.get("type")
    if (!typeParam) return

        const indoorOptions = ["go", "green", "studio", "pro"] as const
    const outdoorOptions = ["grip", "scrape"] as const

    if (indoorOptions.includes(typeParam as (typeof indoorOptions)[number])) {
      const subtype = typeParam as IndoorSubtype
      setIndoorSubtype(subtype)
      setVisibleTypeBlock("indoor")
      setConfig((prev) => ({ ...prev, type: "indoor", indoorSubtype: subtype }))
      return
    }

    if (outdoorOptions.includes(typeParam as (typeof outdoorOptions)[number])) {
      const subtype = typeParam as OutdoorSubtype
      setOutdoorSubtype(subtype)
      setVisibleTypeBlock("outdoor")
      setConfig((prev) => ({ ...prev, type: "outdoor", outdoorSubtype: subtype }))
    }
  }, [searchParams])

  const updateConfig = useCallback((updates: Partial<MatConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }, [])

  const stepRefs = useRef<Record<number, HTMLDivElement | null>>({})

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step)
    setMaxStepReached((prev) => Math.max(prev, step))
    // Op smartphone/tablet de nieuwe stap bovenaan in beeld brengen (na het openklappen).
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      requestAnimationFrame(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        stepRefs.current[step]?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" })
      })
    }
  }, [])

  const scrollToSummary = useCallback(() => {
    document.getElementById("order-summary-mobile")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  const handleMatTypeChange = useCallback(
    (type: "indoor" | "outdoor") => {
      updateConfig({ type })
      setVisibleTypeBlock(type)

                 if (type === "indoor") {
        setIndoorSubtype("go")
        updateConfig({ type, indoorSubtype: "go" })
        return
      }

            if (type === "outdoor") {
        setOutdoorSubtype("grip")
        updateConfig({ type, outdoorSubtype: "grip" })
      }
    },
    [updateConfig]
  )

  const handleLogoInfoFound = useCallback(
    (info: { width: number; height: number; format: string; colors: number }) => {
      setLogoInfo(info)

      if (info.width < 1000 || info.height < 1000) {
        alert(t("alertLowResolution"))
      }

      if (info.format === "image/jpeg" || info.format === "image/jpg") {
        alert(t("alertJpg"))
      }
    },
    [t]
  )

  const handleLogoUpload = useCallback(
    (file: File, dataUrl: string) => {
      setSuggestedColorCodes([])

      updateConfig({
        logo: {
          ...config.logo,
          file,
          dataUrl,
          position: { x: 0.5, y: 0.5 },
          scale: 1,
          rotation: 0,
        },
      })
    },
    [config.logo, updateConfig]
  )

  const handleLogoUpdate = useCallback(
    (updates: Partial<MatConfig["logo"]>) => {
      updateConfig({
        logo: { ...config.logo, ...updates },
      })
    },
    [config.logo, updateConfig]
  )

  const handleReset = useCallback(() => {
    setConfig(DEFAULT_CONFIG)
    setSuggestedColorCodes([])
    setLogoImage(null)
    setIndoorSubtype("go")
       setOutdoorSubtype("grip")
    setVisibleTypeBlock(null)
    setCurrentStep(1)
    setMaxStepReached(1)
  }, [])

    const handleOrder = useCallback(() => {
    const canvas = document.getElementById("carpetz-mat-preview-canvas") as HTMLCanvasElement | null

    if (canvas) {
      saveOrderAsset("matPreview", canvas.toDataURL("image/png"))
    }

    if (config.logo.dataUrl) {
      saveOrderAsset("matLogo", config.logo.dataUrl)
    }

    // Enkel productspecificaties; de prijs wordt altijd opnieuw berekend.
    const params = new URLSearchParams({
      type: config.type,
      indoorSubtype: config.indoorSubtype,
      outdoorSubtype: config.outdoorSubtype,
      width: String(config.size.width),
      height: String(config.size.height),
      quantity: String(config.quantity),
      logoColors: String(config.logoColors),
      colorCode: config.colorCode,
      placement: config.placement,
      rubberBorder: String(config.rubberBorder),
    })

    router.push(`/cart?${params.toString()}`)
  }, [config, router])

  const parseEuroAmount = (value: string): number | null => {
    if (!value) return null

    let cleaned = value.replace(/€/g, "").replace(/\s/g, "").trim()

    if (cleaned.includes(".") && cleaned.includes(",")) {
      const lastDot = cleaned.lastIndexOf(".")
      const lastComma = cleaned.lastIndexOf(",")

      if (lastComma > lastDot) {
        cleaned = cleaned.replace(/\./g, "").replace(",", ".")
      } else {
        cleaned = cleaned.replace(/,/g, "")
      }
    } else if (cleaned.includes(",")) {
      cleaned = cleaned.replace(",", ".")
    }

    const parsed = Number(cleaned)
    return Number.isFinite(parsed) ? parsed : null
  }

  const getDisplayedConfiguratorTotal = (): number | null => {
    const bodyText = document.body.innerText || ""

    const totalMatch = bodyText.match(/Total[\s\S]{0,80}?€\s*[\d.,]+/i)
    if (totalMatch) {
      const euroMatch = totalMatch[0].match(/€\s*[\d.,]+/)
      if (euroMatch) {
        return parseEuroAmount(euroMatch[0])
      }
    }

    const allMatches = [...bodyText.matchAll(/€\s*[\d.,]+/g)]
    if (allMatches.length > 0) {
      const lastMatch = allMatches[allMatches.length - 1][0]
      return parseEuroAmount(lastMatch)
    }

    return null
  }

  const handleColorSuggestionsFound = useCallback((codes: string[]) => {
    setSuggestedColorCodes(codes)
  }, [])

  const handleResetSuggestions = useCallback(() => {
    setSuggestedColorCodes([])
  }, [])

                const activeColors =
    visibleTypeBlock === "outdoor" && outdoorSubtype === "grip"
      ? PRINTGRASS_COLORS
      : visibleTypeBlock === "outdoor" && outdoorSubtype === "scrape"
      ? SIGNATURE_COLORS
      : MAT_COLORS

  const selectedColor = activeColors.find((c) => c.code === config.colorCode)

   const hasGoodResolution = logoInfo.width >= 1000 && logoInfo.height >= 1000
  const isPng = logoInfo.format === "image/png"

  const activePreviewKey = visibleTypeBlock
    ? `${visibleTypeBlock}-${visibleTypeBlock === "indoor" ? indoorSubtype : outdoorSubtype}`
    : null

  const step1Complete = Boolean(config.logo.file)
  const step2Complete = maxStepReached > 2

  const steps = [
    { number: 1, title: t("steps.type"), icon: Layers },
    { number: 2, title: t("steps.size"), icon: Layers },
    { number: 3, title: t("steps.logo"), icon: ImageIcon },
    { number: 4, title: t("steps.colors"), icon: PaletteIcon },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
            <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-2 sm:py-4 flex items-center justify-end">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t("reset")}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-3 py-4 pb-28 sm:px-6 sm:py-6 lg:pb-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)_300px]">
          {/* Configuration Panel — verticale stappen-accordion */}
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("panelTitle")}</CardTitle>
              <div className="mt-2 space-y-1.5" aria-live="polite">
                <p className="text-xs font-medium text-muted-foreground">
                  {t("stepOf", { current: currentStep, total: steps.length })}
                </p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-[#C69C4D] transition-[width] duration-300"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {steps.map((step) => {
                const isOpen = currentStep === step.number
                const isComplete =
                  step.number === 1
                    ? visibleTypeBlock !== null
                    : step.number === 2
                    ? true
                    : step.number === 3
                    ? Boolean(config.logo.file)
                    : false

                return (
                  <div
                    key={step.number}
                    ref={(el) => {
                      stepRefs.current[step.number] = el
                    }}
                    className={`scroll-mt-20 ${step.number !== 4 ? "border-b border-border" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => goToStep(step.number)}
                      aria-expanded={isOpen}
                      className="w-full min-h-14 flex items-center justify-between gap-3 px-4 py-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                            isOpen
                              ? "bg-[#C69C4D] text-white"
                              : isComplete
                              ? "bg-[#C69C4D]/15 text-[#C69C4D]"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isComplete && !isOpen ? <Check className="size-4" /> : step.number}
                        </span>
                        <div>
                          <div className="font-medium text-sm">{step.title}</div>
                                                                              {!isOpen && step.number === 1 && visibleTypeBlock && (
                            <div className="text-xs text-muted-foreground">
                              {mats[visibleTypeBlock === "indoor" ? indoorSubtype : outdoorSubtype].title}
                            </div>
                          )}
                          {!isOpen && step.number === 2 && (
                            <div className="text-xs text-muted-foreground">
                              {config.size.width}×{config.size.height} cm
                            </div>
                          )}
                          {!isOpen && step.number === 3 && config.logo.file && (
                            <div className="text-xs text-muted-foreground">{config.logo.file.name}</div>
                          )}
                        </div>
                      </div>
                      <ChevronDown
                        className={`size-4 shrink-0 text-muted-foreground transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-6 space-y-6">
                                                                       {step.number === 1 && (
                          <>
                            {/* Mat Type */}
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">{t("matType")}</Label>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleMatTypeChange("indoor")}
                                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                                    visibleTypeBlock === "indoor"
                                      ? "border-foreground bg-foreground/5"
                                      : "border-border hover:border-muted-foreground"
                                  }`}
                                >
                                  <div className="font-medium text-sm">{t("indoor")}</div>
                                  <div className="text-xs text-muted-foreground">{t("indoorText")}</div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleMatTypeChange("outdoor")}
                                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                                    visibleTypeBlock === "outdoor"
                                      ? "border-foreground bg-foreground/5"
                                      : "border-border hover:border-muted-foreground"
                                  }`}
                                >
                                  <div className="font-medium text-sm">{t("outdoor")}</div>
                                  <div className="text-xs text-muted-foreground">{t("outdoorText")}</div>
                                </button>
                              </div>
                            </div>

                            {visibleTypeBlock === "indoor" && (
                              <div className="space-y-3">
                                <Label className="text-sm font-medium">{t("indoorType")}</Label>
                                                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                    type="button"
                                    onClick={() => {
                                      setIndoorSubtype("go")
                                      updateConfig({ indoorSubtype: "go" })
                                    }}
                                    className={`overflow-hidden rounded-lg border-2 text-left transition-all ${
                                      config.indoorSubtype === "go"
                                        ? "border-[#C69C4D] bg-[#FFF8EB] shadow-sm"
                                        : "border-border hover:border-[#C69C4D]"
                                    }`}
                                  >
                                    <div className="relative aspect-[4/3] w-full">
                                      <Image src={TYPE_PREVIEW_IMAGES["indoor-go"]} alt="" fill sizes="180px" className="object-cover" />
                                    </div>
                                    <div className="p-3">
                                      <div className="font-medium text-sm">{mats.go.title}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {t("subtypes.go")}
                                      </div>
                                    </div>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIndoorSubtype("green")
                                      updateConfig({ indoorSubtype: "green" })
                                    }}
                                    className={`overflow-hidden rounded-lg border-2 text-left transition-all ${
                                      config.indoorSubtype === "green"
                                        ? "border-[#C69C4D] bg-[#FFF8EB] shadow-sm"
                                        : "border-border hover:border-[#C69C4D]"
                                    }`}
                                  >
                                    <div className="relative aspect-[4/3] w-full">
                                      <Image src={TYPE_PREVIEW_IMAGES["indoor-green"]} alt="" fill sizes="180px" className="object-cover" />
                                    </div>
                                    <div className="p-3">
                                      <div className="font-medium text-sm">{mats.green.title}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {t("subtypes.green")}
                                      </div>
                                    </div>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIndoorSubtype("studio")
                                      updateConfig({ indoorSubtype: "studio" })
                                    }}
                                    className={`overflow-hidden rounded-lg border-2 text-left transition-all ${
                                      config.indoorSubtype === "studio"
                                        ? "border-[#C69C4D] bg-[#FFF8EB] shadow-sm"
                                        : "border-border hover:border-[#C69C4D]"
                                    }`}
                                  >
                                    <div className="relative aspect-[4/3] w-full">
                                      <Image src={TYPE_PREVIEW_IMAGES["indoor-studio"]} alt="" fill sizes="180px" className="object-cover" />
                                    </div>
                                    <div className="p-3">
                                      <div className="font-medium text-sm">{mats.studio.title}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {t("subtypes.studio")}
                                      </div>
                                    </div>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIndoorSubtype("pro")
                                      updateConfig({ indoorSubtype: "pro" })
                                    }}
                                    className={`overflow-hidden rounded-lg border-2 text-left transition-all ${
                                      config.indoorSubtype === "pro"
                                        ? "border-[#C69C4D] bg-[#FFF8EB] shadow-sm"
                                        : "border-border hover:border-[#C69C4D]"
                                    }`}
                                  >
                                    <div className="relative aspect-[4/3] w-full">
                                      <Image src={TYPE_PREVIEW_IMAGES["indoor-pro"]} alt="" fill sizes="180px" className="object-cover" />
                                    </div>
                                    <div className="p-3">
                                      <div className="font-medium text-sm">{mats.pro.title}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {t("subtypes.pro")}
                                      </div>
                                    </div>
                                  </button>
                                </div>
                              </div>
                            )}

                            {visibleTypeBlock === "outdoor" && (
                              <div className="space-y-3">
                                <Label className="text-sm font-medium">{t("outdoorType")}</Label>
                                <div className="grid grid-cols-2 gap-2">
                                                                     <button
                                    type="button"
                                    onClick={() => {
                                      setOutdoorSubtype("grip")
                                      updateConfig({ outdoorSubtype: "grip" })
                                    }}
                                    className={`overflow-hidden rounded-lg border-2 text-left transition-all ${
                                      outdoorSubtype === "grip"
                                        ? "border-foreground bg-foreground/5"
                                        : "border-border hover:border-muted-foreground"
                                    }`}
                                  >
                                    <div className="relative aspect-[4/3] w-full">
                                      <Image src={TYPE_PREVIEW_IMAGES["outdoor-grip"]} alt="" fill sizes="180px" className="object-cover" />
                                    </div>
                                    <div className="p-3">
                                      <div className="font-medium text-sm">{mats.grip.title}</div>
                                      <div className="text-xs text-muted-foreground">{t("subtypes.grip")}</div>
                                    </div>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOutdoorSubtype("scrape")
                                      updateConfig({ outdoorSubtype: "scrape" })
                                    }}
                                    className={`overflow-hidden rounded-lg border-2 text-left transition-all ${
                                      outdoorSubtype === "scrape"
                                        ? "border-foreground bg-foreground/5"
                                        : "border-border hover:border-muted-foreground"
                                    }`}
                                  >
                                    <div className="relative aspect-[4/3] w-full">
                                      <Image src={TYPE_PREVIEW_IMAGES["outdoor-scrape"]} alt="" fill sizes="180px" className="object-cover" />
                                    </div>
                                    <div className="p-3">
                                      <div className="font-medium text-sm">{mats.scrape.title}</div>
                                      <div className="text-xs text-muted-foreground">{t("subtypes.scrape")}</div>
                                    </div>
                                  </button>
                                </div>
                              </div>
                            )}

                            <div className="space-y-3">
                              <Label className="text-sm font-medium">{t("placement")}</Label>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateConfig({ placement: "floor", rubberBorder: true })}
                                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                                    config.placement === "floor"
                                      ? "border-foreground bg-foreground/5"
                                      : "border-border hover:border-muted-foreground"
                                  }`}
                                >
                                  <div className="font-medium text-sm">{t("floor")}</div>
                                  <div className="text-xs text-muted-foreground">{t("floorText")}</div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => updateConfig({ placement: "frame", rubberBorder: false })}
                                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                                    config.placement === "frame"
                                      ? "border-foreground bg-foreground/5"
                                      : "border-border hover:border-muted-foreground"
                                  }`}
                                >
                                  <div className="font-medium text-sm">{t("frame")}</div>
                                  <div className="text-xs text-muted-foreground">{t("frameText")}</div>
                                </button>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <Label className="text-sm font-medium">{t("orientation")}</Label>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateConfig({ orientation: "landscape" })}
                                  className={`p-3 rounded-lg border-2 transition-all ${
                                    config.orientation === "landscape"
                                      ? "border-foreground bg-foreground/5"
                                      : "border-border hover:border-muted-foreground"
                                  }`}
                                >
                                  <div className="w-12 h-8 mx-auto mb-2 bg-muted-foreground/20 rounded" />
                                  <div className="text-xs">{t("landscape")}</div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => updateConfig({ orientation: "portrait" })}
                                  className={`p-3 rounded-lg border-2 transition-all ${
                                    config.orientation === "portrait"
                                      ? "border-foreground bg-foreground/5"
                                      : "border-border hover:border-muted-foreground"
                                  }`}
                                >
                                  <div className="w-8 h-12 mx-auto mb-2 bg-muted-foreground/20 rounded" />
                                  <div className="text-xs">{t("portrait")}</div>
                                </button>
                              </div>
                            </div>

                            {config.placement !== "frame" && (
                              <>
                                <Separator />
                                <div className="flex items-center justify-between">
                                  <div className="space-y-0.5">
                                    <Label className="text-sm font-medium">{t("rubberBorder")}</Label>
                                  </div>
                                  <Switch
                                    checked={config.rubberBorder}
                                    onCheckedChange={(v) => updateConfig({ rubberBorder: v })}
                                  />
                                </div>
                                <Separator />
                              </>
                            )}

                            <Button className="w-full" onClick={() => goToStep(2)}>
                              {t("toSize")}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </>
                        )}

                        {step.number === 2 && (
                          <>
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">{t("sizeLabel")}</Label>

                              <div className="grid grid-cols-2 gap-2">
                                {STANDARD_SIZES.map((size) => {
                                  const isSelected =
                                    !config.size.isCustom &&
                                    config.size.width === size.width &&
                                    config.size.height === size.height

                                  return (
                                    <button
                                      key={size.label}
                                      type="button"
                                      onClick={() =>
                                        updateConfig({
                                          size: { width: size.width, height: size.height, isCustom: false },
                                        })
                                      }
                                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                                        isSelected
                                          ? "border-foreground bg-foreground/5"
                                          : "border-border hover:border-muted-foreground"
                                      }`}
                                    >
                                      <div className="font-medium text-sm">{size.label}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {size.width} × {size.height} cm
                                      </div>
                                    </button>
                                  )
                                })}

                                <button
                                  type="button"
                                  onClick={() => updateConfig({ size: { ...config.size, isCustom: true } })}
                                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                                    config.size.isCustom
                                      ? "border-foreground bg-foreground/5"
                                      : "border-border hover:border-muted-foreground"
                                  }`}
                                >
                                  <div className="font-medium text-sm">{t("customSize")}</div>
                                  <div className="text-xs text-muted-foreground">{t("customSizeText")}</div>
                                </button>
                              </div>

                              {config.size.isCustom && (
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                  <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">{t("width")}</Label>
                                    <Input
                                      type="number"
                                      min={30}
                                      max={300}
                                      value={config.size.width}
                                      onChange={(e) =>
                                        updateConfig({
                                          size: {
                                            ...config.size,
                                            width: parseInt(e.target.value) || 30,
                                            isCustom: true,
                                          },
                                        })
                                      }
                                    />
                                  </div>

                                  <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">{t("height")}</Label>
                                    <Input
                                      type="number"
                                      min={30}
                                      max={300}
                                      value={config.size.height}
                                      onChange={(e) =>
                                        updateConfig({
                                          size: {
                                            ...config.size,
                                            height: parseInt(e.target.value) || 30,
                                            isCustom: true,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-[auto_1fr] gap-2">
                              <Button variant="outline" onClick={() => goToStep(1)}>
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                {t("back")}
                              </Button>
                              <Button onClick={() => goToStep(3)}>
                                {t("toLogo")}
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </div>
                          </>
                        )}

                        {step.number === 3 && (
                          <>
                            <LogoUploader
                              currentFile={config.logo.file}
                              onUpload={handleLogoUpload}
                              onColorSuggestionsFound={handleColorSuggestionsFound}
                              onLogoInfoFound={handleLogoInfoFound}
                            />

                            {logoInfo.width > 0 && (
                              <div className="rounded-lg border p-4 bg-muted/30 space-y-2">
                                <h4 className="font-medium">{t("logoAnalysis")}</h4>
                                <div className="text-sm">
                                  {t("resolution", { width: logoInfo.width, height: logoInfo.height })}
                                </div>
                                <div className="text-sm">
                                  {hasGoodResolution ? (
                                    <span className="text-green-600">{t("resolutionGood")}</span>
                                  ) : (
                                    <span className="text-amber-600">{t("resolutionLow")}</span>
                                  )}
                                </div>
                                <div className="text-sm">{t("fileType", { format: logoInfo.format })}</div>
                                <div className="text-sm">
                                  {isPng ? (
                                    <span className="text-green-600">{t("pngDetected")}</span>
                                  ) : (
                                    <span className="text-amber-600">
                                      {t("notPng")}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-[auto_1fr] gap-2">
                              <Button variant="outline" onClick={() => goToStep(2)}>
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                {t("back")}
                              </Button>
                              <Button onClick={() => goToStep(4)}>
                                {t("toColors")}
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </div>
                          </>
                        )}

                        {step.number === 4 && (
                          <>
                            {selectedColor && (
                              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                <div
                                  className="w-10 h-10 rounded-md border border-border"
                                  style={{ backgroundColor: selectedColor.hex }}
                                />
                                <div>
                                  <p className="font-medium text-sm">{selectedColor.name}</p>
                                  <p className="text-xs text-muted-foreground">{selectedColor.code}</p>
                                </div>
                              </div>
                            )}

                                                       <ColorPalette
                              selectedCode={config.colorCode}
                              onSelect={(code) => updateConfig({ colorCode: code })}
                              suggestedCodes={suggestedColorCodes}
                              onResetSuggestions={handleResetSuggestions}
                                                                                                                       colorSet={
                                visibleTypeBlock === "outdoor" && outdoorSubtype === "grip"
                                  ? "printgrass"
                                  : visibleTypeBlock === "outdoor" && outdoorSubtype === "scrape"
                                  ? "signature"
                                  : "standard"
                              }
                            />

                            <div className="space-y-3">
                              <Label className="text-sm font-medium">{t("quantity")}</Label>
                              <div className="flex items-center gap-3">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => updateConfig({ quantity: Math.max(1, config.quantity - 1) })}
                                  disabled={config.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>

                                <Input
                                  type="number"
                                  min={1}
                                  max={100}
                                  value={config.quantity}
                                  onChange={(e) =>
                                    updateConfig({
                                      quantity: Math.max(1, Math.min(100, parseInt(e.target.value) || 1)),
                                    })
                                  }
                                  className="w-20 text-center"
                                />

                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => updateConfig({ quantity: Math.min(100, config.quantity + 1) })}
                                  disabled={config.quantity >= 100}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>

                              {config.quantity >= 5 && (
                                <Badge variant="secondary" className="text-xs">
                                  {t("volumeDiscount")}
                                </Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-[auto_1fr] gap-2 lg:hidden">
                              <Button variant="outline" onClick={() => goToStep(3)}>
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                {t("back")}
                              </Button>
                              <Button onClick={scrollToSummary}>
                                {t("toSummary")}
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

                   {/* Preview Panel — op smartphone bovenaan, zodat je het resultaat meteen ziet */}
          <div className="order-first min-w-0 space-y-6 lg:order-none">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{t("previewTitle")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <MatCanvas config={config} onLogoUpdate={handleLogoUpdate} />
              </CardContent>
            </Card>

                     </div>

          {/* Price Calculator - Desktop */}
          <div className="hidden min-w-0 xl:block">
            <div className="sticky top-24">
              <PriceCalculator config={config} onOrder={handleOrder} />
            </div>
          </div>
        </div>

        {/* Price Calculator - Mobile/Tablet */}
        <div className="mt-6 xl:hidden">
          <PriceCalculator id="order-summary-mobile" config={config} onOrder={handleOrder} />
        </div>

        {/* Vaste bestelbalk onderaan op smartphone/tablet */}
        <MobileOrderBar config={config} onOrder={handleOrder} summaryId="order-summary-mobile" />

                        {(visibleTypeBlock === "indoor" || visibleTypeBlock === "outdoor") && (() => {
          const typeData = mats[visibleTypeBlock === "indoor" ? indoorSubtype : outdoorSubtype]
          return (
            <div className="mt-6 space-y-6">
              {/* Waarom deze mat kiezen */}
              <Card className="border-2 border-[#C69C4D]/30 bg-[#FFFCF7]">
                <CardHeader>
                  <CardTitle className="text-xl">{t("whyChoose", { name: typeData.title })}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {typeData.whyChoose.text}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {typeData.whyChoose.idealFor.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#C69C4D]/40 bg-[#FFF8EB] px-3 py-1 text-xs font-medium text-[#3B2A1A]"
                      >
                        <Check className="size-3 text-[#C69C4D]" />
                        {item}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Eigenschappen */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("properties")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
                    {typeData.features.map((feature) => {
                      const Icon = feature.icon
                      return (
                        <div key={feature.label} className="flex items-center gap-3">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                            <Icon className="size-4" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                            <p className="text-xs text-muted-foreground">{feature.value}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Productspecificaties */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("specs")}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-hidden rounded-b-xl">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-primary text-primary-foreground">
                          <th className="px-5 py-3 font-semibold">{t("feature")}</th>
                          <th className="px-5 py-3 font-semibold">{t("property")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {typeData.specs.map((spec, index) => (
                          <tr key={spec.label} className={index % 2 === 1 ? "bg-secondary/40" : "bg-card"}>
                            <td className="border-t border-border px-5 py-3 text-muted-foreground">
                              {spec.label}
                            </td>
                            <td className="border-t border-border px-5 py-3 font-medium text-foreground">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })()}
      </main>
    </div>
  )
}
