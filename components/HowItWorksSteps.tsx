"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, Palette, ShoppingCart, Package, type LucideIcon } from "lucide-react";

type Step = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const steps: Step[] = [
  {
    number: "01",
    title: "Upload je logo",
    description: "Laad je logo of ontwerp eenvoudig op in de configurator.",
    icon: Upload,
  },
  {
    number: "02",
    title: "Kies je achtergrondkleur",
    description: "Selecteer de kleur die het best bij je huisstijl past.",
    icon: Palette,
  },
  {
    number: "03",
    title: "Bestel & betaal veilig",
    description: "Rond je bestelling af via onze beveiligde checkout.",
    icon: ShoppingCart,
  },
  {
    number: "04",
    title: "Ontvang je logomat",
    description: "Wij maken en leveren je logomat op maat, klaar voor gebruik.",
    icon: Package,
  },
];

const STEP_DURATION_MS = 3000;

export default function HowItWorksSteps() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;

    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length);
    }, STEP_DURATION_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  return (
    <section
      className="w-full px-6 py-20"
      style={{ backgroundColor: "#F5F1EA" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-5xl">
        <p
          className="text-xs font-semibold tracking-[0.2em]"
          style={{ color: "#C08A3E" }}
        >
          HOE HET WERKT
        </p>
        <h2 className="mt-3 font-serif text-3xl text-gray-900 sm:text-4xl">
          Ontwerp je logomat in 1-2-3
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-y-12 sm:grid-cols-4 sm:gap-x-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === active;
            const isDone = index < active;

            return (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                {/* Dotted connector naar de volgende stap */}
                {index < steps.length - 1 && (
                  <div
                    className="absolute left-1/2 top-8 hidden h-0 w-full border-t-2 border-dotted sm:block"
                    style={{
                      borderColor: isDone || isActive ? "#C08A3E" : "#E3DCCB",
                      transition: "border-color 400ms ease",
                    }}
                  />
                )}

                <div className="relative z-10">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: "#1C1A17",
                      boxShadow: isActive ? "0 0 0 4px rgba(192,138,62,0.35)" : "none",
                      transform: isActive ? "scale(1.06)" : "scale(1)",
                    }}
                  >
                    <Icon className="h-6 w-6 text-white" strokeWidth={1.75} />
                  </div>
                  <span
                    className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold text-gray-900 transition-transform duration-300"
                    style={{
                      backgroundColor: "#D9A55A",
                      transform: isActive ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 max-w-[220px] text-sm text-gray-500">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
