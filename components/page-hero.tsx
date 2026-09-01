import Image from 'next/image'

type PageHeroProps = {
  eyebrow: string
  title: string
  intro: string
  image: string
  imageAlt: string
}

export function PageHero({ eyebrow, title, intro, image, imageAlt }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0">
        <Image
          src={image || '/placeholder.svg'}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/40" />
      </div>
           <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/80 text-pretty">
          {intro}
        </p>
      </div>
    </section>
  )
}
