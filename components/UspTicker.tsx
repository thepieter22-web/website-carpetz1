import { useTranslations } from 'next-intl'

function UspList({ items, hidden = false }: { items: string[]; hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((usp) => (
        <li key={usp} className="flex items-center whitespace-nowrap">
          <span className="px-8 text-sm font-medium tracking-wide sm:text-base">{usp}</span>
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
        </li>
      ))}
    </ul>
  )
}

export function UspTicker() {
  const t = useTranslations('UspTicker')
  const items = t.raw('items') as string[]

  return (
    <section
      aria-label={t('label')}
      className="overflow-hidden border-y border-border bg-primary py-4 text-primary-foreground"
    >
      {/* Twee identieke lijsten achter elkaar: na -50% sluit de tweede naadloos aan op de eerste. */}
      <div className="flex w-max will-change-transform animate-ticker hover:[animation-play-state:paused]">
        <UspList items={items} />
        <UspList items={items} hidden />
      </div>
    </section>
  )
}
