import Image from "next/image";
import type { LucideIcon } from "lucide-react";

type Detail = {
  icon: LucideIcon;
  title: string;
  text: string;
};

type CustomRunnerHighlightProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  details: Detail[];
  taglineTitle: string;
  taglineSubtitle: string;
  freeformNote?: string;
  qualities: Detail[];
};

export function CustomRunnerHighlight({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  details,
  taglineTitle,
  taglineSubtitle,
  freeformNote,
  qualities,
}: CustomRunnerHighlightProps) {
  return (
    <section className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl items-stretch gap-0 overflow-hidden rounded-sm border border-border lg:grid-cols-2">
        <div className="relative min-h-[420px]">
          <Image src={image} alt={imageAlt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>

        <div className="flex flex-col justify-center bg-card px-8 py-14 lg:px-14">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">{eyebrow}</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-balance">{title}</h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">{description}</p>

          {freeformNote && (
            <p className="mt-3 text-sm font-medium text-accent">{freeformNote}</p>
          )}

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
            <p className="text-base font-semibold">{taglineTitle}</p>
            <p className="mt-1 font-serif text-lg italic text-muted-foreground">{taglineSubtitle}</p>
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
