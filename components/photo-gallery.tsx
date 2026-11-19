import Image from 'next/image'

export type GalleryPhoto = { src: string; alt: string }

/** Realisaties: raster met foto's (2 per rij op gsm, 3 vanaf desktop). Toont niets zonder foto's. */
export function PhotoGallery({ title, text, photos }: { title: string; text: string; photos: GalleryPhoto[] }) {
  if (photos.length === 0) return null

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">{title}</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{text}</p>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {photos.map((photo) => (
            <li key={photo.src} className="relative aspect-[4/3] overflow-hidden rounded-sm bg-muted">
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
