
import { ShieldCheck, RefreshCw, Award } from "lucide-react"

const guarantees = [
  {
    icon: ShieldCheck,
    subtitle: "Altijd scherp",
    title: "Pasvorm- & kleurgarantie",
    description: "We garanderen dat je logomat perfect past en de kleuren exact kloppen — of we passen hem gratis aan.",
  },
  {
    icon: RefreshCw,
    subtitle: "Niet tevreden?",
    title: "100 dagen ruilgarantie",
    description: "Voldoet je logomat niet aan de verwachting? Binnen 100 dagen ruilen we hem kosteloos om.",
  },
  {
    icon: Award,
    subtitle: "Blijft zo uitzien",
    title: "Kwaliteitsgarantie rand & kleur",
    description: "Antislib rand en kleurvastheid gegarandeerd, ook na intensief gebruik.",
  },
]

export function LogomatGuarantees() {
  return (
    <div className="mt-4 grid grid-cols-3 gap-3">
      {guarantees.map(({ icon: Icon, subtitle, title, description }) => (
        <div
          key={title}
          className="flex flex-col rounded-sm border border-border bg-card p-4"
        >
          <Icon className="size-5 text-accent" strokeWidth={1.75} />
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-accent">
            {subtitle}
          </p>
          <h4 className="mt-1 text-sm font-semibold leading-snug">{title}</h4>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      ))}
    </div>
  )
}
