import { useTranslations } from 'next-intl';
import Image from 'next/image'
import { Cta } from '@/components/cta'

export function Hero() {
  const t = useTranslations('Hero');
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-event-carpet.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/50" />
      </div>

     <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="max-w-3xl">

          <h1 className="font-serif text-3xl font-semibold leading-[1.1] text-balance sm:text-5xl sm:leading-[1.05] lg:text-6xl">
            {t('title')}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/85 text-pretty">
            {t('description')}
          </p>

                    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Cta href="/logomat" variant="accent">
              {t('cta1')}
            </Cta>
            <Cta href="/geprint-tapijt" variant="outlineLight" withArrow={false}>
              {t('cta2')}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  )
}
