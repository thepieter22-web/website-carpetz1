import Image from "next/image";
import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

export interface MatTypeFeature {
  icon: LucideIcon;
  label: string;
  value: string;
}

export interface MatTypeSpec {
  label: string;
  value: string;
}

export interface MatTypeReference {
  image: string;
  alt: string;
}

export interface MatTypePageProps {
  /** Bv. "LOGO MAT • BINNEN" */
  eyebrow: string;
  title: string;
  /** 2-3 zinnen unieke uitleg voor deze specifieke mat, belangrijk voor SEO */
  description: string;
  heroImage: string;
  heroAlt: string;
  features: MatTypeFeature[];
  specs: MatTypeSpec[];
  references: MatTypeReference[];
  /** Interne code voor de configurator query-param, bv. "eco" */
  configuratorType: string;
}

export function MatTypePage({
  eyebrow,
  title,
  description,
  heroImage,
  heroAlt,
  features,
  specs,
  references,
  configuratorType,
}: MatTypePageProps) {
  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-10 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      </section>

      {/* Grote detailfoto */}
      <section className="mx-auto max-w-5xl px-6 pb-16 lg:px-8">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border shadow-md">
          <Image
            src={heroImage}
            alt={heroAlt}
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Eigenschappen */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
          <h2 className="text-2xl font-semibold text-foreground">Eigenschappen</h2>

          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.label} className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                    <p className="text-sm text-muted-foreground">{feature.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Productspecificaties */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
          <h2 className="text-2xl font-semibold text-foreground">Productspecificaties</h2>

          <div className="mt-8 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="px-5 py-3 font-semibold">Kenmerk</th>
                  <th className="px-5 py-3 font-semibold">Eigenschap</th>
                </tr>
              </thead>
              <tbody>
                {specs.map((spec, index) => (
                  <tr
                    key={spec.label}
                    className={index % 2 === 1 ? "bg-secondary/40" : "bg-card"}
                  >
                    <td className="border-t border-border px-5 py-3 text-muted-foreground">
                      {spec.label}
                    </td>
                    <td className="border-t border-border px-5 py-3 font-medium text-foreground">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Onze referenties */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <h2 className="text-center text-2xl font-bold italic text-foreground">
            Onze referenties
          </h2>

          <div className="mt-8 flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
            {references.map((ref, index) => (
              <div
                key={index}
                className="relative aspect-[3/4] w-56 shrink-0 snap-start overflow-hidden rounded-xl border border-border shadow-sm"
              >
                <Image
                  src={ref.image}
                  alt={ref.alt}
                  fill
                  sizes="224px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA naar configurator */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center lg:px-8">
          <h2 className="font-serif text-3xl font-semibold text-foreground">
            Ontwerp jouw {title.toLowerCase()}
          </h2>
          <p className="mt-3 text-muted-foreground">
            Upload je logo en zie direct hoe jouw logomat eruitziet.
          </p>
          <Link
            href={`/logomat/configurator?type=${configuratorType}`}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Start de configurator
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
