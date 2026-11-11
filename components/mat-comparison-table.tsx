import { useMessages, useTranslations } from "next-intl"
import { Check } from "lucide-react"
import {
  getMatTypes,
  INDOOR_SUBTYPES,
  OUTDOOR_SUBTYPES,
  type MatSubtype,
  type MatTypeEntry,
} from "@/lib/mat-type-data"

/** Eerste ingevulde waarde uit de eigenschappen of specificaties, op basis van vaste sleutels. */
function pick(entry: MatTypeEntry, keys: string[]): string {
  for (const key of keys) {
    const value = entry.featuresByKey[key] ?? entry.specsByKey[key]
    if (value) return value
  }
  return "–"
}

type Row = { label: string; keys: string[] }

function ComparisonTable({
  title,
  types,
  rows,
  mats,
  minWidth,
}: {
  title: string
  types: readonly MatSubtype[]
  rows: Row[]
  mats: Record<MatSubtype, MatTypeEntry>
  minWidth: string
}) {
  const t = useTranslations("Compare")

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className={`w-full ${minWidth} text-left text-sm`}>
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="px-5 py-3 font-semibold">{t("feature")}</th>
              {types.map((key) => (
                <th key={key} className="px-5 py-3 font-semibold">
                  {mats[key].title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-card">
              <td className="border-t border-border px-5 py-3 text-muted-foreground">{t("positioning")}</td>
              {types.map((key) => (
                <td key={key} className="border-t border-border px-5 py-3 font-medium text-foreground">
                  {mats[key].tagline}
                </td>
              ))}
            </tr>
            {rows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? "bg-secondary/40" : "bg-card"}>
                <td className="border-t border-border px-5 py-3 text-muted-foreground">{row.label}</td>
                {types.map((key) => (
                  <td key={key} className="border-t border-border px-5 py-3 font-medium text-foreground">
                    {pick(mats[key], row.keys)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className={rows.length % 2 === 0 ? "bg-secondary/40" : "bg-card"}>
              <td className="border-t border-border px-5 py-3 align-top text-muted-foreground">{t("idealFor")}</td>
              {types.map((key) => (
                <td key={key} className="border-t border-border px-5 py-3 align-top">
                  <ul className="space-y-1">
                    {mats[key].whyChoose.idealFor.map((item) => (
                      <li key={item} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <Check className="mt-0.5 size-3 shrink-0 text-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function MatComparisonTable() {
  const t = useTranslations("Compare")
  const mats = getMatTypes(useMessages())

  const material: Row = { label: t("material"), keys: ["material", "pile", "yarn"] }
  const weight: Row = { label: t("weight"), keys: ["weight", "totalWeight", "matWeight"] }

  return (
    <div className="space-y-12">
      <ComparisonTable
        title={t("indoorTitle")}
        types={INDOOR_SUBTYPES}
        mats={mats}
        minWidth="min-w-[640px]"
        rows={[
          material,
          weight,
          { label: t("fire"), keys: ["fire"] },
          { label: t("underfloorHeating"), keys: ["underfloorHeating"] },
        ]}
      />
      <ComparisonTable
        title={t("outdoorTitle")}
        types={OUTDOOR_SUBTYPES}
        mats={mats}
        minWidth="min-w-[420px]"
        rows={[material, weight, { label: t("usage"), keys: ["usage", "suitableFor"] }]}
      />
    </div>
  )
}
