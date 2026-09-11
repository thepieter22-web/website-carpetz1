"use client"
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

const DEFAULT_CONFIG: MatConfig = {
  type: "indoor",
  indoorSubtype: "normal",
  outdoorSubtype: "printgrass",
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

type IndoorSubtype = "normal" | "eco" | "budget" | "luxe"
type OutdoorSubtype = "PrintGrass Outdoor" | "Signature Brush"
type VisibleTypeBlock = "indoor" | "outdoor" | null

export function MatConfigurator() {
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
  const [outdoorSubtype, setOutdoorSubtype] = useState<OutdoorSubtype>("PrintGrass Outdoor")
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
        setIndoorSubtype("normal")
        updateConfig({ type, indoorSubtype: "normal" })
        return
      }

      if (type === "outdoor") {
        setOutdoorSubtype("PrintGrass Outdoor")
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
    setIndoorSubtype("normal")
    setOutdoorSubtype("PrintGrass Outdoor")
    setVisibleTypeBlock(null)
    setCurrentStep(1)
    setMaxStepReached(1)
  }, [])

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
  outdoorSubtype === "PrintGrass Outdoor"
    ? PRINTGRASS_COLORS
    : MAT_COLORS

const selectedColor =
  activeColors.find((c) => c.code === config.colorCode)

  const hasGoodResolution = logoInfo.width >= 1000 && logoInfo.height >= 1000
  const isPng = logoInfo.format === "image/png"

  const indoorInfo = {
    normal: { title: "Classic", description: "Betrouwbare logomat voor dagelijks gebruik." },
    eco: { title: "Eco", description: "Gemaakt met gerecycleerde materialen." },
    budget: { title: "Professional", description: "Onze populairste keuze voor bedrijven." },
    luxe: { title: "Elite", description: "Premium afwerking en maximale levensduur." },
  }

  const step1Complete = Boolean(config.logo.file)
  const step2Complete = maxStepReached > 2
  
const steps = [
  { number: 1, title: "Logomat configureren", icon: Layers },
  { number: 2, title: "Logo Upload", icon: ImageIcon },
  { number: 3, title: "Kleuren", icon: PaletteIcon },
]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center">
              <Layers className="w-5 h-5 text-background" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Ontwerp jouw logomat op maat</h1>
              <p className="text-sm text-muted-foreground">
                Upload jouw logo, kies kleur en afmetingen en bestel direct online.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="ghost" size="sm" onClick={handleReset} className="flex-1 sm:flex-none">
              <RotateCcw className="w-4 h-4 mr-2" />
              Opnieuw starten
            </Button>
            <Button
              size="sm"
              className="bg-[#C69C4D] hover:bg-[#B88D3C] text-white flex-1 sm:flex-none"
              onClick={() => {
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
              }}
            >
              Bestelling plaatsen
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
     <main className="max-w-[2200px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr_360px] gap-6">
          {/* Configuration Panel — verticale stappen-accordion */}
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Stel jouw logomat samen</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              {steps.map((step) => {
                const isOpen = currentStep === step.number
                const isComplete =
                  step.number === 1 ? step1Complete : step.number === 2 ? step2Complete : false

                return (
                  <div key={step.number} className={step.number !== 3 ? "border-b border-border" : ""}>
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
                          {!isOpen && step.number === 1 && config.logo.file && (
                            <div className="text-xs text-muted-foreground">{config.logo.file.name}</div>
                          )}
                          {!isOpen && step.number === 2 && selectedColor && (
                            <div className="text-xs text-muted-foreground">{selectedColor.name}</div>
                          )}
                          {!isOpen && step.number === 3 && (
                            <div className="text-xs text-muted-foreground">
                              {indoorInfo[indoorSubtype].title} &middot; {config.size.width}×{config.size.height}cm
                            </div>
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
                                      setIndoorSubtype("normal")
                                      updateConfig({ indoorSubtype: "normal" })
                                    }}
                                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                                      config.indoorSubtype === "normal"
                                        ? "border-[#C69C4D] bg-[#FFF8EB] shadow-sm"
                                        : "border-border hover:border-[#C69C4D]"
                                    }`}
                                  >
                                    <div className="font-medium text-sm">Classic</div>
                                    <div className="text-xs text-muted-foreground">
                                      Betrouwbare logomat voor dagelijks gebruik
                                    </div>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIndoorSubtype("eco")
                                      updateConfig({ indoorSubtype: "eco" })
                                    }}
                                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                                      config.indoorSubtype === "eco"
                                        ? "border-[#C69C4D] bg-[#FFF8EB] shadow-sm"
                                        : "border-border hover:border-[#C69C4D]"
                                    }`}
                                  >
                                    <div className="font-medium text-sm">Eco</div>
                                    <div className="text-xs text-muted-foreground">
                                      Gemaakt met gerecycleerde materialen
                                    </div>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIndoorSubtype("luxe")
                                      updateConfig({ indoorSubtype: "luxe" })
                                    }}
                                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                                      config.indoorSubtype === "luxe"
                                        ? "border-[#C69C4D] bg-[#FFF8EB] shadow-sm"
                                        : "border-border hover:border-[#C69C4D]"
                                    }`}
                                  >
                                    <div className="font-medium text-sm">Elite</div>
                                    <div className="text-xs text-muted-foreground">
                                      Premium afwerking en maximale levensduur
                                    </div>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIndoorSubtype("budget")
                                      updateConfig({ indoorSubtype: "budget" })
                                    }}
                                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                                      config.indoorSubtype === "budget"
                                        ? "border-[#C69C4D] bg-[#FFF8EB] shadow-sm"
                                        : "border-border hover:border-[#C69C4D]"
                                    }`}
                                  >
                                    <div className="font-medium text-sm">Professional</div>
                                    <div className="text-xs text-muted-foreground">
                                      Onze populairste keuze voor bedrijven
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
                                    onClick={() => setOutdoorSubtype("PrintGrass Outdoor")}
                                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                                      outdoorSubtype === "PrintGrass Outdoor"
                                        ? "border-foreground bg-foreground/5"
                                        : "border-border hover:border-muted-foreground"
                                    }`}
                                  >
                                    <div className="font-medium text-sm">PrintGrass Outdoor</div>
                                    <div className="text-xs text-muted-foreground">Full-colour bedrukte buitenmat</div>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setOutdoorSubtype("Signature Brush")}
                                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                                      outdoorSubtype === "Signature Brush"
                                        ? "border-foreground bg-foreground/5"
                                        : "border-border hover:border-muted-foreground"
                                    }`}
                                  >
                                    <div className="font-medium text-sm">Signature Brush</div>
                                    <div className="text-xs text-muted-foreground">Premium logomat met 2-3 kleuren</div>
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


                            <Button className="w-full" onClick={() => goToStep(2)}>
                              Volgende stap: Logo Upload
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </>
                        )}

                        {step.number === 2 && (
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





                        

                            <Button className="w-full" onClick={() => goToStep(3)}>
                              Volgende stap: Kies je achtergrondkleur
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </>
                        )}

                        {step.number === 3 && (
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
          <div className="hidden xl:block">
            <div className="sticky top-24">
              <PriceCalculator config={config} />
            </div>
          </div>
        </div>

        {/* Price Calculator - Mobile/Tablet */}
        <div className="xl:hidden mt-6">
          <PriceCalculator config={config} />
        </div>

        <Card className="mt-6 border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Productinformatie</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">{indoorInfo[indoorSubtype].title}</h3>
            <p className="text-muted-foreground">{indoorInfo[indoorSubtype].description}</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
