import Image from 'next/image'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/**
 * Golvende vormen (coördinaten 0–100). De achterste vorm piept uit waar de voorste inspringt.
 * `mirrored` spiegelt beide vormen, zodat twee foto's op dezelfde pagina niet identiek ogen.
 */
const BLOB_FRONT =
  'M10 9C24 2 40 8 56 5S88 1 94 14 91 40 95 56 97 90 80 95 54 89 38 94 6 97 4 78 9 52 5 36 2 15 10 9Z'
const BLOB_BACK =
  'M4 16C14 1 38 0 54 4S86 6 97 18 99 46 98 62 92 99 70 98 44 100 26 98 1 90 2 70 0 40 4 16Z'

function blobMask(path: string, mirrored: boolean): CSSProperties {
  const transform = mirrored ? " transform='translate(100 0) scale(-1 1)'" : ''
  const svg = `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><path d='${path}'${transform}/></svg>`,
  )}")`
  return {
    maskImage: svg,
    WebkitMaskImage: svg,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
  }
}

/** Foto in een organische vorm met een goudkleurige vorm erachter (4:3). */
export function BlobPhoto({
  src,
  alt,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  mirrored = false,
  className,
}: {
  src: string
  alt: string
  sizes?: string
  mirrored?: boolean
  className?: string
}) {
  return (
    <div className={cn('relative aspect-[4/3]', className)}>
      <div aria-hidden className="absolute inset-0 bg-accent/30" style={blobMask(BLOB_BACK, mirrored)} />
      <div className="absolute inset-0" style={blobMask(BLOB_FRONT, mirrored)}>
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
    </div>
  )
}
