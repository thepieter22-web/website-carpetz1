import { useTranslations } from 'next-intl'
import { Clock } from 'lucide-react'
import { Cta } from '@/components/cta'

type QuoteBandProps = {
  /** Al vertaalde titel; standaard de algemene tekst uit QuoteBand.title. */
  title?: string
  text?: string
}

export function QuoteBand({ title, text }: QuoteBandProps) {
  const t = useTranslations('QuoteBand')
  const common = useTranslations('Common')

  return (
    <section className="bg-accent text-accent-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest">
            <Clock className="size-4" />
            {common('replyWithin24h')}
          </div>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-balance sm:text-4xl">{title ?? t('title')}</h2>
          <p className="mt-3 text-base leading-relaxed text-accent-foreground/80 text-pretty">{text ?? t('text')}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Cta href="/contact" variant="primary">
            {common('requestQuote')}
          </Cta>
          <Cta href="/contact" variant="outline" withArrow={false}>
            {common('contactUs')}
          </Cta>
        </div>
      </div>
    </section>
  )
}
