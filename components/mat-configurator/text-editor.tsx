"use client"

import { useTranslations } from "next-intl"
import { Plus, Trash2, Crosshair, RotateCw, Type, Move } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { TEXT_LIMITS, type MatText } from "@/lib/mat-config"
import { FONT_CATEGORIES, MAT_FONTS, getMatFont } from "@/lib/mat-fonts"
import { cn } from "@/lib/utils"

type ColorOption = { code: string; name: string; hex: string }

interface TextEditorProps {
  texts: MatText[]
  selectedId: string | null
  colors: readonly ColorOption[]
  onSelect: (id: string) => void
  onAdd: () => void
  onUpdate: (id: string, updates: Partial<MatText>) => void
  onRemove: (id: string) => void
}

export function TextEditor({ texts, selectedId, colors, onSelect, onAdd, onUpdate, onRemove }: TextEditorProps) {
  const t = useTranslations("TextEditor")
  const selected = texts.find((text) => text.id === selectedId) ?? null
  const canAdd = texts.length < TEXT_LIMITS.maxTexts

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">{t("intro")}</p>

      {texts.length > 0 && (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={t("listLabel")}>
          {texts.map((text, index) => (
            <button
              key={text.id}
              type="button"
              role="tab"
              aria-selected={text.id === selectedId}
              onClick={() => onSelect(text.id)}
              className={cn(
                "min-h-10 max-w-full truncate rounded-full border px-4 py-2 text-sm pointer-coarse:min-h-12",
                text.id === selectedId
                  ? "border-[#C69C4D] bg-[#C69C4D] text-white"
                  : "border-border bg-card hover:border-[#C69C4D]"
              )}
            >
              {text.content.trim().split("\n")[0] || t("textNumber", { number: index + 1 })}
            </button>
          ))}
        </div>
      )}

      <Button type="button" variant="outline" className="w-full" onClick={onAdd} disabled={!canAdd}>
        <Plus className="mr-1 size-4" />
        {texts.length === 0 ? t("add") : t("addAnother")}
      </Button>
      {!canAdd && <p className="text-xs text-muted-foreground">{t("maxReached", { max: TEXT_LIMITS.maxTexts })}</p>}

      {selected && (
        <div className="space-y-5 rounded-lg border bg-muted/30 p-4">
          {/* Tekst */}
          <div className="space-y-2">
            <Label htmlFor="mat-text-content" className="text-sm font-medium">
              {t("textLabel")}
            </Label>
            <textarea
              id="mat-text-content"
              rows={2}
              maxLength={TEXT_LIMITS.maxLength}
              value={selected.content}
              placeholder={t("placeholder")}
              onChange={(e) => {
                // Maximaal 3 regels.
                const content = e.target.value.split("\n").slice(0, TEXT_LIMITS.maxLines).join("\n")
                onUpdate(selected.id, { content })
              }}
              className="w-full resize-none rounded-lg border bg-card p-3 text-base sm:text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {t("textHint", { max: TEXT_LIMITS.maxLength, lines: TEXT_LIMITS.maxLines })}
            </p>
          </div>

          {/* Lettertype */}
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {t("fontLabel")}: <span className="font-normal text-muted-foreground">{getMatFont(selected.fontId).label}</span>
            </p>
            <div className="max-h-72 space-y-3 overflow-y-auto rounded-lg border bg-card p-2">
              {FONT_CATEGORIES.map((category) => (
                <div key={category}>
                  <p className="px-1 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t(`categories.${category}`)}
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
                    {MAT_FONTS.filter((f) => f.category === category).map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        aria-pressed={selected.fontId === f.id}
                        onClick={() => onUpdate(selected.id, { fontId: f.id })}
                        style={{ fontFamily: f.family }}
                        className={cn(
                          "min-h-11 truncate rounded-md border px-2 py-2 text-base pointer-coarse:min-h-12",
                          selected.fontId === f.id
                            ? "border-[#C69C4D] bg-[#FFF8EB] ring-1 ring-[#C69C4D]"
                            : "border-border hover:border-[#C69C4D]"
                        )}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {getMatFont(selected.fontId).hasBold && (
            <div className="flex min-h-12 items-center justify-between gap-3">
              <Label htmlFor="mat-text-bold" className="text-sm font-medium">
                {t("bold")}
              </Label>
              <Switch
                id="mat-text-bold"
                checked={selected.bold}
                onCheckedChange={(checked) => onUpdate(selected.id, { bold: Boolean(checked) })}
              />
            </div>
          )}

          {/* Kleur: enkel kleuren uit het palet van dit mattype (produceerbaar) */}
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {t("colorLabel")}:{" "}
              <span className="font-normal text-muted-foreground">
                {colors.find((c) => c.code === selected.colorCode)?.name ?? selected.colorCode}
              </span>
            </p>
            <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10 lg:grid-cols-8">
              {colors.map((color) => (
                <button
                  key={color.code}
                  type="button"
                  title={`${color.name} (${color.code})`}
                  aria-label={`${color.name} (${color.code})`}
                  aria-pressed={selected.colorCode === color.code}
                  onClick={() => onUpdate(selected.id, { colorCode: color.code })}
                  className={cn(
                    "aspect-square w-full rounded-md border border-black/10",
                    selected.colorCode === color.code && "ring-2 ring-[#C69C4D] ring-offset-2"
                  )}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          {/* Grootte */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm">
                <Type className="size-4" />
                {t("size")}
              </span>
              <span className="text-xs text-muted-foreground">{Math.round(selected.size * 100)}%</span>
            </div>
            <Slider
              value={[Math.round(selected.size * 100)]}
              onValueChange={(values) => {
                const value = Array.isArray(values) ? values[0] : values
                onUpdate(selected.id, { size: value / 100 })
              }}
              min={TEXT_LIMITS.size.min * 100}
              max={TEXT_LIMITS.size.max * 100}
              step={1}
            />
          </div>

          {/* Rotatie */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm">
                <RotateCw className="size-4" />
                {t("rotation")}
              </span>
              <span className="text-xs text-muted-foreground">{selected.rotation}°</span>
            </div>
            <Slider
              value={[selected.rotation]}
              onValueChange={(values) => {
                const value = Array.isArray(values) ? values[0] : values
                onUpdate(selected.id, { rotation: value })
              }}
              min={0}
              max={360}
              step={5}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onUpdate(selected.id, { position: { x: 0.5, y: 0.5 } })}
            >
              <Crosshair className="mr-1 size-4" />
              {t("center")}
            </Button>
            <Button type="button" size="sm" variant="destructive" onClick={() => onRemove(selected.id)}>
              <Trash2 className="mr-1 size-4" />
              {t("delete")}
            </Button>
          </div>

          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Move className="size-3" />
            {t("dragHint")}
          </p>
        </div>
      )}
    </div>
  )
}
