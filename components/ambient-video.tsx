'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type AmbientVideoProps = {
  /** Video zonder extensie, bv. "/videos/geprint-tapijt" (er moeten .webm en .mp4 bestaan). */
  src: string
  /** Foto: wordt eerst getoond, als poster gebruikt en is de enige weergave bij "minder beweging". */
  poster: string
  alt: string
  sizes: string
}

/**
 * Stille, herhalende sfeervideo die een foto vervangt.
 * - Eerst de (geoptimaliseerde) foto; de video laadt pas als de sectie bijna in beeld is.
 * - Bij prefers-reduced-motion blijft het bij de foto en wordt er geen video gedownload.
 */
export function AmbientVideo({ src, poster, alt, sizes }: AmbientVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches || !wrapperRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowVideo(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px' },
    )
    observer.observe(wrapperRef.current)

    // Zet iemand "minder beweging" aan terwijl de pagina open is: terug naar de foto.
    const onMotionChange = (e: MediaQueryListEvent) => e.matches && setShowVideo(false)
    motionQuery.addEventListener('change', onMotionChange)

    return () => {
      observer.disconnect()
      motionQuery.removeEventListener('change', onMotionChange)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="absolute inset-0">
      <Image src={poster} alt={alt} fill sizes={sizes} className="object-cover" />
      {showVideo && (
        <video
          className="absolute inset-0 size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          aria-hidden="true"
        >
          <source src={`${src}.webm`} type="video/webm" />
          <source src={`${src}.mp4`} type="video/mp4" />
        </video>
      )}
    </div>
  )
}
