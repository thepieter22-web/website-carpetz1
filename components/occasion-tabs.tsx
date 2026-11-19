'use client'

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type OccasionTab = {
  /** Ook het anker in de URL (bv. #verjaardag), zodat links van andere pagina's het juiste tabblad openen. */
  id: string
  label: string
  icon?: ReactNode
  content: ReactNode
}

/**
 * Tabbladen met één voorbeeld tegelijk. Alle panelen staan in de HTML (goed voor Google);
 * de niet-actieve zijn enkel verborgen.
 */
export function OccasionTabs({ tabs }: { tabs: OccasionTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id)
  const rootRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Anker in de URL → juiste tabblad openen en ernaartoe scrollen.
  useEffect(() => {
    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (tabs.some((tab) => tab.id === id)) {
        setActive(id)
        requestAnimationFrame(() =>
          (rootRef.current?.closest('section') ?? rootRef.current)?.scrollIntoView({ block: 'start' }),
        )
      }
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [tabs])

  const select = (index: number, focus = false) => {
    const tab = tabs[index]
    if (!tab) return
    setActive(tab.id)
    // Anker bijwerken zonder te springen, zodat de link deelbaar blijft.
    window.history.replaceState(null, '', `#${tab.id}`)
    const button = tabRefs.current[index]
    if (focus) button?.focus()
  }

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const last = tabs.length - 1
    const next =
      event.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : null
    if (next === null) return
    event.preventDefault()
    select(next, true)
  }

  return (
    <div ref={rootRef}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div role="tablist" className="flex flex-wrap gap-2">
          {tabs.map((tab, index) => {
            const selected = tab.id === active
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[index] = el
                }}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={tab.id}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(index)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className={cn(
                  'inline-flex min-h-12 shrink-0 items-center gap-2 rounded-sm border px-5 text-sm font-semibold transition-colors',
                  selected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground hover:border-accent',
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={tab.id}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== active}
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}
