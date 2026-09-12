import type { Metadata } from "next";
import { Wind, Droplet, Home, ShieldCheck, Flame, Zap, BadgeCheck, Globe } from "lucide-react";
import { MatTypePage } from "@/components/mat-type-page";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Eco logomat op maat",
  description:
    "De Eco logomat is gemaakt met gerecycleerde materialen, zonder in te boeten op kwaliteit of uitstraling.",
};

export default function EcoLogomatPage() {
  return (
    <MatTypePage
      eyebrow="LOGO MAT • ECO"
      title="Eco logomat"
      description="De Eco logomat combineert een lage milieu-impact met dezelfde betrouwbare prestaties als onze klassieke logomatten. Ideaal voor bedrijven die duurzaamheid centraal willen zetten, zonder in te leveren op uitstraling of levensduur."
      heroImage="/images/logomat-eco-detail.jpg"
      heroAlt="Detailfoto van de Eco logomat structuur"
      configuratorType="eco"
      // Placeholder-data — later te vervangen door de exacte specs die je bezorgt
      features={[
        { icon: Wind, label: "Drogen", value: "Normaal drogen" },
        { icon: Droplet, label: "Wassen", value: "60° Wasbaar" },
        { icon: Home, label: "Binnenmat", value: "Binnenklimaat" },
        { icon: ShieldCheck, label: "Veiligheid", value: "Antislip" },
        { icon: Flame, label: "Brandbaarheid", value: "13501-01" },
        { icon: Zap, label: "Slipweerstand", value: "EN 14041" },
        { icon: BadgeCheck, label: "Garantie", value: "2 jaar garantie" },
        { icon: Globe, label: "Afkomst", value: "Product uit EU" },
      ]}
      specs={[
        { label: "Gewicht", value: "1,9 kg/m²" },
        { label: "Randen", value: "10 mm" },
        { label: "Rugmateriaal", value: "100% nitril rubber" },
        { label: "Rugdikte", value: "0,9 mm" },
        { label: "Randdikte", value: "1,9 mm" },
        { label: "Vuil absorptie", value: "470 g/m²" },
        { label: "Vocht absorptie", value: "2 – 3 l/m²" },
        { label: "Pool", value: "Gerecycled High Twist Nylon (HTN)" },
        { label: "Pool gewicht", value: "680 g/m²" },
        { label: "Pool hoogte", value: "6 mm" },
        { label: "Mat hoogte", value: "7 mm" },
        { label: "Brandgedrag", value: "EN 13501-01" },
      ]}
      references={[
        { image: "/images/references/ref-1.jpg", alt: "Logomat referentie 1" },
        { image: "/images/references/ref-2.jpg", alt: "Logomat referentie 2" },
        { image: "/images/references/ref-3.jpg", alt: "Logomat referentie 3" },
        { image: "/images/references/ref-4.jpg", alt: "Logomat referentie 4" },
      ]}
    />
  );
}
