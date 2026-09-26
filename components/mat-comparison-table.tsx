import { MAT_TYPE_DATA, MAT_TYPE_DATA_OUTDOOR, type MatTypeEntry } from "@/lib/mat-type-data"
import { Check } from "lucide-react"

function findValue(entry: MatTypeEntry, keywords: string[]): string {
  const inFeatures = entry.features.find((f) =>
    keywords.some((k) => f.label.toLowerCase().includes(k))
  )
  if (inFeatures) return inFeatures.value

  const inSpecs = entry.specs.find((s) =>
    keywords.some((k) => s.label.toLowerCase().includes(k))
  )
  if (inSpecs) return inSpecs.value

  return "–"
}

const INDOOR_TYPES = ["go", "green", "studio", "pro"] as const
const OUTDOOR_TYPES = ["grip", "scrape"] as const

export function MatComparisonTable() {
  return (
    <div className="space-y-12">
      {/* Indoor */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Indoor logomatten</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-5 py-3 font-semibold">Kenmerk</th>
                {INDOOR_TYPES.map((key) => (
                  <th key={key} className="px-5 py-3 font-semibold">
                    {MAT_TYPE_DATA[key].title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-card">
                <td className="border-t border-border px-5 py-3 text-muted-foreground">Positionering</td>
                {INDOOR_TYPES.map((key) => (
                  <td key={key} className="border-t border-border px-5 py-3 font-medium text-foreground">
                    {MAT_TYPE_DATA[key].tagline}
                  </td>
                ))}
              </tr>
             <tr className="bg-card">
                <td className="border-t border-border px-5 py-3 text-muted-foreground">Materiaal</td>
                {INDOOR_TYPES.map((key) => (
                  <td key={key} className="border-t border-border px-5 py-3 font-medium text-foreground">
                    {findValue(MAT_TYPE_DATA[key], ["materiaal", "pool", "garen"])}
                  </td>
                ))}
              </tr>
              <tr className="bg-secondary/40">
                <td className="border-t border-border px-5 py-3 text-muted-foreground">Gewicht</td>
                {INDOOR_TYPES.map((key) => (
                  <td key={key} className="border-t border-border px-5 py-3 font-medium text-foreground">
                    {findValue(MAT_TYPE_DATA[key], ["gewicht"])}
                  </td>
                ))}
              </tr>
              <tr className="bg-card">
                <td className="border-t border-border px-5 py-3 text-muted-foreground">Brandgedrag</td>
                {INDOOR_TYPES.map((key) => (
                  <td key={key} className="border-t border-border px-5 py-3 font-medium text-foreground">
                    {findValue(MAT_TYPE_DATA[key], ["brandgedrag"])}
                  </td>
                ))}
              </tr>
              <tr className="bg-secondary/40">
                <td className="border-t border-border px-5 py-3 text-muted-foreground">Vloerverwarming</td>
                {INDOOR_TYPES.map((key) => (
                  <td key={key} className="border-t border-border px-5 py-3 font-medium text-foreground">
                    {findValue(MAT_TYPE_DATA[key], ["vloerverwarming"])}
                  </td>
                ))}
              </tr>
              <tr className="bg-card">
                <td className="border-t border-border px-5 py-3 align-top text-muted-foreground">Ideaal voor</td>
                {INDOOR_TYPES.map((key) => (
                  <td key={key} className="border-t border-border px-5 py-3 align-top">
                    <ul className="space-y-1">
                      {MAT_TYPE_DATA[key].whyChoose.idealFor.map((item) => (
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

      {/* Outdoor */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Outdoor logomatten</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-5 py-3 font-semibold">Kenmerk</th>
                {OUTDOOR_TYPES.map((key) => (
                  <th key={key} className="px-5 py-3 font-semibold">
                    {MAT_TYPE_DATA_OUTDOOR[key].title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-card">
                <td className="border-t border-border px-5 py-3 text-muted-foreground">Positionering</td>
                {OUTDOOR_TYPES.map((key) => (
                  <td key={key} className="border-t border-border px-5 py-3 font-medium text-foreground">
                    {MAT_TYPE_DATA_OUTDOOR[key].tagline}
                  </td>
                ))}
              </tr>
             <tr className="bg-card">
                <td className="border-t border-border px-5 py-3 text-muted-foreground">Materiaal</td>
                {OUTDOOR_TYPES.map((key) => (
                  <td key={key} className="border-t border-border px-5 py-3 font-medium text-foreground">
                    {findValue(MAT_TYPE_DATA_OUTDOOR[key], ["garen", "pool"])}
                  </td>
                ))}
              </tr>
              <tr className="bg-secondary/40">
                <td className="border-t border-border px-5 py-3 text-muted-foreground">Gewicht</td>
                {OUTDOOR_TYPES.map((key) => (
                  <td key={key} className="border-t border-border px-5 py-3 font-medium text-foreground">
                    {findValue(MAT_TYPE_DATA_OUTDOOR[key], ["gewicht"])}
                  </td>
                ))}
              </tr>
              <tr className="bg-card">
                <td className="border-t border-border px-5 py-3 text-muted-foreground">Gebruik</td>
                {OUTDOOR_TYPES.map((key) => (
                  <td key={key} className="border-t border-border px-5 py-3 font-medium text-foreground">
                    {findValue(MAT_TYPE_DATA_OUTDOOR[key], ["gebruik", "geschikt voor"])}
                  </td>
                ))}
              </tr>
              <tr className="bg-secondary/40">
                <td className="border-t border-border px-5 py-3 align-top text-muted-foreground">Ideaal voor</td>
                {OUTDOOR_TYPES.map((key) => (
                  <td key={key} className="border-t border-border px-5 py-3 align-top">
                    <ul className="space-y-1">
                      {MAT_TYPE_DATA_OUTDOOR[key].whyChoose.idealFor.map((item) => (
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
    </div>
  )
}
