"use client";

import { calculatePrice, type MatConfig, PRICING } from "@/lib/mat-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calculator, Tag, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";


interface PriceCalculatorProps {
  config: MatConfig;
}

export function PriceCalculator({ config }: PriceCalculatorProps) {
  const pricing = calculatePrice(config);

  // Find current discount tier
  const tier = PRICING.quantity.tiers.find(
    (t) => config.quantity >= t.min && config.quantity <= t.max
  );
  const discountPercent = (tier?.discount ?? 0) * 100;

  return (
    <Card className="border-[#E6D5B8] shadow-md bg-[#FFFCF7]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-[#3B2A1A]">
  <Calculator className="w-5 h-5 text-[#C69C4D]" />
  Jouw logomat
</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type logomat</span>
            <span className="font-medium">
  {config.indoorSubtype === "normal"
    ? "Classic"
    : config.indoorSubtype === "eco"
    ? "Eco"
    : config.indoorSubtype === "budget"
    ? "Professional"
    : "Elite"}
</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Afmetingen</span>
            <span className="font-medium">
              {config.size.width} × {config.size.height} cm
              {config.size.isCustom && (
                <Badge variant="secondary" className="ml-1 text-xs">Custom</Badge>
              )}
            </span>
          </div>
         {config.rubberBorder && (
  <div className="flex justify-between">
    <span className="text-muted-foreground">Rubberen rand</span>
    <span className="font-medium">
      ✅ Ja
    </span>
  </div>
)}
          {config.logoColors > 1 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Aantal logokleuren</span>
              <span className="font-medium">
                {config.logoColors} (+€{((config.logoColors - 1) * PRICING.logoColors.extraPerColor).toFixed(2)})
              </span>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Prijs logomat</span>
            <span className="font-medium">€{pricing.unitPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              Aantal
              {discountPercent > 0 && (
                <Badge variant="secondary" className="text-xs gap-0.5">
                  <Percent className="w-3 h-3" />
                  {discountPercent}% off
                </Badge>
              )}
            </span>
            <span className="font-medium">×{config.quantity}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotaal</span>
            <span className="font-medium">€{pricing.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">BTW ({PRICING.vat * 100}%)</span>
            <span className="font-medium">€{pricing.vat.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="rounded-lg bg-muted p-4 text-sm">
  <p>✅ Digitale proefdruk inbegrepen</p>
  <p>✅ Productie na jouw goedkeuring</p>
  <p>✅ Levering in België & Nederland</p>
</div>

       <div className="rounded-xl border-2 border-[#C69C4D] bg-[#FFF8EB] p-5 shadow-sm">
  <div className="flex justify-between items-center">
    <span className="text-lg font-semibold flex items-center gap-2">
      <Tag className="w-4 h-4" />
      Totaal incl. btw
    </span>

    <span className="text-3xl font-bold text-primary">
      €{pricing.total.toFixed(2)}
    </span>
  </div>
</div>



<div className="pt-4">
  <Button
    className="w-full bg-[#C69C4D] hover:bg-[#B88D3C] text-white"
   onClick={() => {
  window.location.href =
    `/cart?type=${config.indoorSubtype}` +
    `&width=${config.size.width}` +
    `&height=${config.size.height}` +
    `&quantity=${config.quantity}` +
    `&total=${pricing.total.toFixed(2)}`;
}}
  >
    Bestelling plaatsen
  </Button>
</div>

</CardContent>
</Card>

);
}
