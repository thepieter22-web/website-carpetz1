'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Lijst-item dat zacht omhoog schuift en verschijnt zodra het in beeld komt.
 * `delay` (ms) zorgt dat items die tegelijk in beeld komen na elkaar verschijnen.
 * Zonder JavaScript of met "minder beweging" ingesteld is alles meteen zichtbaar.
 */
export function RevealItem({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLLIElement>(null)
  // 'static' = nog niet gehydrateerd of geen animatie; 'hidden' → 'shown' = animatie
  const [state, setState] = useState<'static' | 'hidden' | 'shown'>('static')

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Al (bijna) voorbij gescrold, bv. na terugkeren op de pagina: niet meer verbergen.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return

    setState('hidden')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('shown')
          observer.disconnect()
        }
      },
      // Grote marge bovenaan: wat al boven het scherm ligt (voorbij gescrold), telt ook als zichtbaar.
      { rootMargin: '100000px 0px -12% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <li
      ref={ref}
      className={cn(
        state !== 'static' && 'transition-[opacity,transform] duration-700 ease-out',
        state === 'hidden' && 'translate-y-8 opacity-0',
        className,
      )}
      style={state === 'shown' ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </li>
  )
}
