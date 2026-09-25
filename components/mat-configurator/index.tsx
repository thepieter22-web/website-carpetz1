"use client"
import { MAT_TYPE_DATA, MAT_TYPE_DATA_OUTDOOR } from "@/lib/mat-type-data"
import { Check as CheckIcon, Sparkles } from "lucide-react"
import Image from "next/image"
import { PRINTGRASS_COLORS } from "@/lib/printgrass-colors"
import { useState, useCallback, useEffect } from "react"
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

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step)
    setMaxStepReached((prev) => Math.max(prev, step))
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
        alert(
          "⚠️ Dit logo heeft een lage resolutie. Voor een optimaal drukresultaat raden wij minimaal 1000 × 1000 pixels aan."
        )
      }

      if (info.format === "image/jpeg" || info.format === "image/jpg") {
        alert("⚠️ JPG-bestand gedetecteerd. Upload bij voorkeur een PNG met transparante achtergrond.")
      }
    },
    []
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
      sessionStorage.setItem("matPreview", canvas.toDataURL("image/png"))
    }

    if (config.logo.dataUrl) {
      sessionStorage.setItem("matLogo", config.logo.dataUrl)
    }

    const params = new URLSearchParams({
      type: config.indoorSubtype,
      width: String(config.size.width),
      height: String(config.size.height),
      quantity: String(config.quantity),
      total: String(document.body.innerText.match(/€[\d,.]+/)?.[0] || ""),
    })

    window.location.href = `/cart?${params.toString()}`
  }, [config])

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

        const indoorInfo = {
    go: { title: "Carpetz Go", description: "Instapmodel — betrouwbaar en toegankelijk geprijsd." },
    green: { title: "Carpetz Green", description: "Duurzame logomat met gerecycleerde materialen." },
    studio: { title: "Carpetz Studio", description: "Onze mooiste printkwaliteit, 100 kleuren." },
    pro: { title: "Carpetz Pro", description: "Hoogste prestaties voor intensief gebruik." },
  }

   const outdoorInfo = {
    grip: { title: "Carpetz Grip", description: "Weerbestendige buitenmat voor intensief gebruik." },
    scrape: { title: "Carpetz Scrape", description: "Superieure schrapwerking tegen vuil." },
  }

  const step1Complete = Boolean(config.logo.file)
  const step2Complete = maxStepReached > 2

  const steps = [
    { number: 1, title: "Type logomat", icon: Layers },
    { number: 2, title: "Afmetingen", icon: Layers },
    { number: 3, title: "Logo Upload", icon: ImageIcon },
    { number: 4, title: "Kleuren", icon: PaletteIcon },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-end">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Opnieuw starten
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1.6fr_320px] gap-6">
          {/* Configuration Panel — verticale stappen-accordion */}
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Stel jouw logomat samen</CardTitle>
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
                  <div key={step.number} className={step.number !== 4 ? "border-b border-border" : ""}>
                    <button
                      type="button"
                      onClick={() => goToStep(step.number)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left"
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
                              {visibleTypeBlock === "indoor"
                                ? indoorInfo[indoorSubtype].title
                                : outdoorInfo[outdoorSubtype].title}
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
                              <Label className="text-sm font-medium">Type logomat</Label>
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
                                  <div className="font-medium text-sm">Indoor</div>
                                  <div className="text-xs text-muted-foreground">Voor binnengebruik</div>
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
                                  <div className="font-medium text-sm">Outdoor</div>
                                  <div className="text-xs text-muted-foreground">Weerbestendig</div>
                                </button>
                              </div>
                            </div>

                            {visibleTypeBlock === "indoor" && (
                              <div className="space-y-3">
                                <Label className="text-sm font-medium">Indoor Type</Label>
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
                                      <div className="font-medium text-sm">Carpetz Go</div>
                                      <div className="text-xs text-muted-foreground">
                                        Instapmodel — betrouwbaar en toegankelijk
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
                                      <div className="font-medium text-sm">Carpetz Green</div>
                                      <div className="text-xs text-muted-foreground">
                                        Duurzaam, gerecycleerde materialen
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
                                      <div className="font-medium text-sm">Carpetz Studio</div>
                                      <div className="text-xs text-muted-foreground">
                                        Mooiste printkwaliteit, 100 kleuren
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
                                      <div className="font-medium text-sm">Carpetz Pro</div>
                                      <div className="text-xs text-muted-foreground">
                                        Hoogste prestaties, langste garantie
                                      </div>
                                    </div>
                                  </button>
                                </div>
                              </div>
                            )}

                            {visibleTypeBlock === "outdoor" && (
                              <div className="space-y-3">
                                <Label className="text-sm font-medium">Outdoor Type</Label>
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
                                      <div className="font-medium text-sm">Carpetz Grip</div>
                                      <div className="text-xs text-muted-foreground">Weerbestendige buitenmat</div>
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
                                      <div className="font-medium text-sm">Carpetz Scrape</div>
                                      <div className="text-xs text-muted-foreground">Superieure schrapwerking</div>
                                    </div>
                                  </button>
                                </div>
                              </div>
                            )}

                            <div className="space-y-3">
                              <Label className="text-sm font-medium">Plaatsing</Label>
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
                                  <div className="font-medium text-sm">Op de vloer</div>
                                  <div className="text-xs text-muted-foreground">Standaard plaatsing</div>
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
                                  <div className="font-medium text-sm">Inbouwframe</div>
                                  <div className="text-xs text-muted-foreground">Verzonken plaatsing</div>
                                </button>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <Label className="text-sm font-medium">Oriëntatie</Label>
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
                                  <div className="text-xs">Liggend</div>
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
                                  <div className="text-xs">Staand</div>
                                </button>
                              </div>
                            </div>

                            {config.placement !== "frame" && (
                              <>
                                <Separator />
                                <div className="flex items-center justify-between">
                                  <div className="space-y-0.5">
                                    <Label className="text-sm font-medium">Rubberen rand</Label>
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
                              Verder naar afmetingen
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </>
                        )}

                        {step.number === 2 && (
                          <>
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">Afmetingen (cm)</Label>

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
                                  <div className="font-medium text-sm">Eigen afmetingen</div>
                                  <div className="text-xs text-muted-foreground">Voer jouw afmetingen in</div>
                                </button>
                              </div>

                              {config.size.isCustom && (
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                  <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">Width (cm)</Label>
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
                                    <Label className="text-xs text-muted-foreground">Height (cm)</Label>
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

                            <Button className="w-full" onClick={() => goToStep(3)}>
                              Verder naar logo upload
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
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
                                <h4 className="font-medium">Logo analyse</h4>
                                <div className="text-sm">
                                  Resolutie: {logoInfo.width} × {logoInfo.height} px
                                </div>
                                <div className="text-sm">
                                  {hasGoodResolution ? (
                                    <span className="text-green-600">✅ Resolutie geschikt voor productie</span>
                                  ) : (
                                    <span className="text-amber-600">⚠️ Resolutie mogelijk te laag</span>
                                  )}
                                </div>
                                <div className="text-sm">Bestandstype: {logoInfo.format}</div>
                                <div className="text-sm">
                                  {isPng ? (
                                    <span className="text-green-600">✅ PNG-bestand gedetecteerd</span>
                                  ) : (
                                    <span className="text-amber-600">
                                      ⚠️ JPG/WebP-bestand. Transparantie wordt mogelijk niet ondersteund.
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            <Button className="w-full" onClick={() => goToStep(4)}>
                              Volgende stap: Kies je achtergrondkleur
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
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
                              <Label className="text-sm font-medium">Aantal</Label>
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
                                  Volume discount applied!
                                </Badge>
                              )}
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

                   {/* Preview Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Voorbeeld van jouw logomat</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <MatCanvas config={config} onLogoUpdate={handleLogoUpdate} />
              </CardContent>
            </Card>

                     </div>

          {/* Price Calculator - Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <PriceCalculator config={config} onOrder={handleOrder} />
            </div>
          </div>
        </div>

        {/* Price Calculator - Mobile/Tablet */}
        <div className="lg:hidden mt-6">
          <PriceCalculator config={config} onOrder={handleOrder} />
        </div>

                        {(visibleTypeBlock === "indoor" || visibleTypeBlock === "outdoor") && (() => {
          const typeData =
            visibleTypeBlock === "indoor"
              ? MAT_TYPE_DATA[indoorSubtype]
              : MAT_TYPE_DATA_OUTDOOR[outdoorSubtype]
          return (
            <div className="mt-6 space-y-6">
              {/* Waarom deze mat kiezen */}
              <Card className="border-2 border-[#C69C4D]/30 bg-[#FFFCF7]">
                <CardHeader>
                  <CardTitle className="text-xl">Waarom {typeData.title} kiezen?</CardTitle>
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
                  <CardTitle className="text-lg">Eigenschappen</CardTitle>
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
                  <CardTitle className="text-lg">Productspecificaties</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-hidden rounded-b-xl">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-primary text-primary-foreground">
                          <th className="px-5 py-3 font-semibold">Kenmerk</th>
                          <th className="px-5 py-3 font-semibold">Eigenschap</th>
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
