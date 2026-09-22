import type { Metadata } from "next";
import { MatTypePage } from "@/components/mat-type-page";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MAT_TYPE_DATA } from "@/lib/mat-type-data";

const data = MAT_TYPE_DATA.studio;

export const metadata: Metadata = {
  title: `${data.title} logomat op maat`,
  description: data.description,
};

export default function GoLogomatPage({
  params,
}: {
  params: { locale: string };
}) {
  return (
    <>
      <SiteHeader />
      <MatTypePage
        locale={params.locale}
        eyebrow={`LOGO MAT • ${data.tagline.toUpperCase()}`}
        title={data.title}
        description={data.description}
        heroImage={data.heroImage}
        heroAlt={`Detailfoto van ${data.title}`}
        configuratorType="studio"
        features={data.features}
        specs={data.specs}
        references={[
          { image: "/images/references/ref-1.jpg", alt: "Logomat referentie 1" },
          { image: "/images/references/ref-2.jpg", alt: "Logomat referentie 2" },
          { image: "/images/references/ref-3.jpg", alt: "Logomat referentie 3" },
          { image: "/images/references/ref-4.jpg", alt: "Logomat referentie 4" },
        ]}
      />
      <SiteFooter />
    </>
  );
}
