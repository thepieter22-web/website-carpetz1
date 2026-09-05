import Image from "next/image";
import { Type, CalendarHeart, Heart, ScrollText, Printer, Sparkles } from "lucide-react";

const details = [
  { icon: Type, title: "Jullie namen", text: "Of initialen" },
  { icon: CalendarHeart, title: "Datum", text: "Jullie speciale dag" },
  { icon: Heart, title: "Eigen tekst", text: "Een quote, belofte of boodschap" },
];

const qualities = [
  { icon: ScrollText, title: "Hoogwaardig materiaal", text: "Stevig, slijtvast en elegant" },
  { icon: Printer, title: "Haarscherpe print", text: "Levendige kleuren en strakke details" },
  { icon: Heart, title: "Volledig op maat", text: "Jullie ontwerp, jullie stijl" },
  { icon: Sparkles, title: "Perfecte afwerking", text: "Voor een onvergetelijke entree" },
];

export function WeddingRunnerSection() {
  return (
    <section className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl items-stretch gap-0 overflow-hidden rounded-sm border border-border lg:grid-cols-2">
        <div className="relative min-h-[420px]">
          <Image
            src="/images/trouwloper.png"
            alt="Trouwloper op maat met namen en datum, versierd met bloemen en kaarsen"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center bg-card px-8 py-14 lg:px-14">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
            Trouwloper op maat
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-balance">
            Maak jullie trouwloper uniek
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
            Laat jullie namen, datum of een persoonlijke boodschap printen op de loper die jullie dag
            compleet maakt.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6">
            {details.map((d) => (
              <div key={d.title}>
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <d.icon className="size-5" />
                </span>
                <h3 className="mt-3 text-sm font-semibold">{d.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{d.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-border pt-8">
            <p className="text-base font-semibold">Jullie droom, onze print.</p>
            <p className="mt-1 font-serif text-lg italic text-muted-foreground">
              Uniek zoals jullie liefde.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-px grid max-w-7xl grid-cols-2 gap-6 border-t border-border px-6 py-10 lg:grid-cols-4 lg:px-8">
        {qualities.map((q) => (
          <div key={q.title} className="flex items-start gap-3">
            <q.icon className="mt-0.5 size-5 shrink-0 text-accent" />
            <div>
              <h4 className="text-sm font-semibold">{q.title}</h4>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{q.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
