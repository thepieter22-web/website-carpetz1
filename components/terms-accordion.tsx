'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Plus, Minus } from 'lucide-react'

/** Uitklapbare artikels van de algemene voorwaarden. */
export function TermsAccordion() {
  const t = useTranslations('Legal.terms')
  const articles = t.raw('articles') as string[]
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {articles.map((title, index) => {
        const isOpen = openIndex === index
        return (
          <div key={title} className="overflow-hidden rounded-lg border border-[#E6D5B8] bg-[#FFF8EB]">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
            >
              <span className="text-sm font-medium md:text-base">{title}</span>
              {isOpen ? (
                <Minus className="size-4 shrink-0 text-[#C69C4D]" />
              ) : (
                <Plus className="size-4 shrink-0 text-[#C69C4D]" />
              )}
            </button>
            {isOpen && (
              <div className="whitespace-pre-line px-5 pb-4 text-sm text-muted-foreground">{t('placeholder')}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
