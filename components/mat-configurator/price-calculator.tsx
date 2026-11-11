"use client";

import { calculatePrice, type MatConfig, PRICING } from "@/lib/mat-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calculator, Tag, Percent, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { usePriceFormatter } from "@/lib/format";
import { MatArViewer } from "./mat-ar-viewer";


const SHIPPING = 15;
const SHIPPING_VAT_RATE = 0.21;

/** Prijsoverzicht zoals getoond in de configurator (ook gebruikt door de mobiele bestelbalk). */
export function getPriceSummary(config: MatConfig) {
  const pricing = calculatePrice(config);
  const shippingVat = SHIPPING * SHIPPING_VAT_RATE;
  return {
    pricing,
    shipping: SHIPPING,
    finalTotal: pricing.total + SHIPPING + shippingVat,
    totalVat: pricing.vat + shippingVat,
  };
}

interface PriceCalculatorProps {
  config: MatConfig;
  onOrder: () => void;
  /** Anker-id, bv. voor de mobiele "naar overzicht"-knop. */
  id?: string;
}

export function PriceCalculator({ config, onOrder, id }: PriceCalculatorProps) {
  const t = useTranslations("PriceCalculator");
  const tAll = useTranslations();
  const formatPrice = usePriceFormatter();
  const subtype = config.type === "outdoor" ? config.outdoorSubtype : config.indoorSubtype;
  const { pricing, shipping, finalTotal, totalVat } = getPriceSummary(config);


  // Find current discount tier
  const tier = PRICING.quantity.tiers.find(
    (t) => config.quantity >= t.min && config.quantity <= t.max
  );
  const discountPercent = (tier?.discount ?? 0) * 100;

  return (
    <Card id={id} className="scroll-mt-24 border-[#E6D5B8] shadow-md bg-[#FFFCF7]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-[#3B2A1A]">
  <Calculator className="w-5 h-5 text-[#C69C4D]" />
  {t("title")}
</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("matType")}</span>
                                  <span className="font-medium">
  {tAll(`MatTypes.${subtype}.title`)}
</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("dimensions")}</span>
            <span className="font-medium">
              {config.size.width} × {config.size.height} cm
              {config.size.isCustom && (
                <Badge variant="secondary" className="ml-1 text-xs">{t("custom")}</Badge>
              )}
            </span>
          </div>
         {config.rubberBorder && (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{t("rubberBorder")}</span>
    <span className="font-medium">
      {t("yes")}
    </span>
  </div>
)}
          {config.logoColors > 1 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("logoColors")}</span>
              <span className="font-medium">
                {config.logoColors} (+{formatPrice((config.logoColors - 1) * PRICING.logoColors.extraPerColor)})
              </span>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("unitPrice")}</span>
            <span className="font-medium">{formatPrice(pricing.unitPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              {t("quantity")}
              {discountPercent > 0 && (
                <Badge variant="secondary" className="text-xs gap-0.5">
                  <Percent className="w-3 h-3" />
                  {t("discount", { percent: discountPercent })}
                </Badge>
              )}
            </span>
            <span className="font-medium">×{config.quantity}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("subtotal")}</span>
            <span className="font-medium">{formatPrice(pricing.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("vat", { percent: PRICING.vat * 100 })}</span>
            <span className="font-medium">{formatPrice(totalVat)}</span>
          </div>

          <div className="flex justify-between text-sm">
  <span className="text-muted-foreground">{t("delivery")}</span>
  <span className="font-medium">{formatPrice(shipping)}</span>
</div>

          
        </div>

        <Separator />

                            <div className="rounded-lg border border-[#C69C4D] bg-[#FFF8EB] p-3 shadow-sm">
  <div className="flex justify-between items-center">
    <span className="text-sm font-semibold flex items-center gap-1.5">
      <Tag className="w-3.5 h-3.5" />
      {t("total")}
    </span>

    <span className="text-xl font-bold text-primary">
      {formatPrice(finalTotal)}
    </span>
  </div>
</div>

<MatArViewer config={config} />

<Button
  className="w-full min-h-11 text-base bg-[#C69C4D] hover:bg-[#B88D3C] text-white"
  onClick={onOrder}
>
  {t("order")}
  <ArrowRight className="w-4 h-4 ml-2" />
</Button>





</CardContent>
</Card>

);
}
