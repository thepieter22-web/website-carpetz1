import { Upload, Palette, ShoppingCart, PackageCheck } from "lucide-react"

const steps = [
  { number: "01", icon: Upload, title: "Upload je logo", text: "Laad je logo of ontwerp eenvoudig op in de configurator." },
  { number: "02", icon: Palette, title: "Kies je achtergrondkleur", text: "Selecteer de kleur die het best bij je huisstijl past." },
  { number: "03", icon: ShoppingCart, title: "Bestel & betaal veilig", text: "Rond je bestelling af via onze beveiligde checkout." },
  { number: "04", icon: PackageCheck, title: "Ontvang je logomat", text: "Wij maken en leveren je logomat op maat, klaar voor gebruik." },
]

export function HowItWorks() {
  return (
    <section className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Hoe het werkt</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
            Ontwerp je logomat in 1-2-3
          </h2>
        </div>

        <div className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div
                  className="pointer-events-none absolute top-8 left-[calc(50%+2.5rem)] hidden h-px w-[calc(100%-5rem)] border-t border-dashed border-accent/40 lg:block"
                  aria-hidden="true"
                />
              )}

              <div className="relative mx-auto flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <step.icon className="size-6" />
                <span className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-5 text-center text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
