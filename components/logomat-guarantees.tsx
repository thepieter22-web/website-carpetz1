
import { ShieldCheck, RefreshCw, Award } from "lucide-react"

const guarantees = [
  {
    icon: ShieldCheck,
    title: "Pasvorm- & kleurgarantie",
  },
  {
    icon: RefreshCw,
    title: "100 dagen ruilgarantie",
  },
  {
    icon: Award,
    title: "Kwaliteitsgarantie rand & kleur",
  },
]

export function LogomatGuarantees() {
  return (
    <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-6">
      {guarantees.map(({ icon: Icon, title }) => (
        <div key={title} className="flex flex-col items-start gap-2">
          <Icon className="size-5 text-accent" strokeWidth={1.75} />
          <p className="text-xs font-medium leading-snug text-muted-foreground">
            {title}
          </p>
        </div>
      ))}
    </div>
  )
}
