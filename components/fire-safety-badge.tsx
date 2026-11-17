import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

/**
 * Rond badge "brandvertragend · Cfl-s1" in Carpetz-stijl:
 * donkere basis (primary), goudkleurige lijnen en tekst (accent), vlam in lucide-stijl.
 * Tekst in de boog komt uit messages (FireBadge); Cfl-s1 en EN 13501-1 zijn normen en blijven onvertaald.
 * `id`: uniek per badge op dezelfde pagina (voor de tekstbogen).
 */
export function FireSafetyBadge({ className, id = 'fire-badge' }: { className?: string; id?: string }) {
  const t = useTranslations('FireBadge')

  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={t('label')} className={cn('size-24 shrink-0', className)}>
      <defs>
        {/* Volledige cirkel die onderaan start: de tekst staat gecentreerd bovenaan (startOffset 50%). */}
        <path id={`${id}-top`} d="M50 87 A37 37 0 1 1 50 13 A37 37 0 1 1 50 87" />
        {/* Tegenwijzerzin langs de onderkant, zodat die tekst niet ondersteboven staat. */}
        <path id={`${id}-bottom`} d="M17 50 A33 33 0 0 0 83 50" />
      </defs>

      <circle cx="50" cy="50" r="48" className="fill-primary stroke-accent" strokeWidth="2" />
      <circle cx="50" cy="50" r="28" className="fill-none stroke-accent/40" strokeWidth="1" />

      <text className="fill-accent font-sans" fontSize="8.5" fontWeight="700" letterSpacing="1.4">
        <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
          {t('arc')}
        </textPath>
      </text>
      <text className="fill-accent/70 font-sans" fontSize="5.5" fontWeight="600" letterSpacing="1">
        <textPath href={`#${id}-bottom`} startOffset="50%" textAnchor="middle" dominantBaseline="hanging">
          EN 13501-1
        </textPath>
      </text>

      {/* Vlam: zelfde vorm als het lucide-icoon "Flame", geschaald. */}
      <path
        d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"
        transform="translate(36.4 24) scale(1.13)"
        className="fill-none stroke-accent"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <text
        x="50"
        y="68"
        textAnchor="middle"
        className="fill-primary-foreground font-sans"
        fontSize="10"
        fontWeight="700"
        letterSpacing="0.3"
      >
        Cfl-s1
      </text>
    </svg>
  )
}
