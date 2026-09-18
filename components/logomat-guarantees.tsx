
import { ShieldCheck, RefreshCw, Award } from "lucide-react"

const guarantees = [
  {
    icon: ShieldCheck,
    title: "Pasvorm- & kleurgarantie",
    subtitle: "Altijd scherp",
    description:
      "We garanderen dat je logomat perfect past en dat de kleuren exact overeenkomen met je huisstijl — of we passen hem gratis aan.",
  },
  {
    icon: RefreshCw,
    title: "100 dagen ruilgarantie",
    subtitle: "Niet tevreden? Gewoon omruilen",
    description:
      "Voldoet je logomat na levering toch niet aan de verwachting? Binnen 100 dagen ruilen we hem kosteloos om.",
  },
  {
    icon: Award,
    title: "Kwaliteitsgarantie rand & kleur",
    subtitle: "Blijft er jarenlang zo uitzien",
    description:
      "Antislib rand en kleurvastheid gegarandeerd — ook na intensief gebruik en herhaaldelijk reinigen.",
  },
]

export function LogomatGuarantees() {
  return (
    <section className="py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {guarantees.map(({ icon: Icon, title, subtitle, description }) => (
          <div key={title} className="flex flex-col items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7f4ee]">
              <Icon className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {subtitle}
            </p>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
