import { useTranslations } from "next-intl"
import { ShieldCheck, RefreshCw, Award } from "lucide-react"

const ICONS = [ShieldCheck, RefreshCw, Award]

type Guarantee = { subtitle: string; title: string; description: string }

export function LogomatGuarantees() {
  const items = useTranslations("Guarantees").raw("items") as Guarantee[]

  return (
    <div className="mt-4 grid grid-cols-3 gap-3">
      {items.map(({ subtitle, title, description }, i) => {
        const Icon = ICONS[i] ?? Award
        return (
          <div key={title} className="flex flex-col rounded-sm border border-border bg-card p-4">
            <Icon className="size-5 text-accent" strokeWidth={1.75} />
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-accent">{subtitle}</p>
            <h4 className="mt-1 text-sm font-semibold leading-snug">{title}</h4>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
          </div>
        )
      })}
    </div>
  )
}
