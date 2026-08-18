import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type CtaProps = {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'accent' | 'outline' | 'outlineLight'
  className?: string
  withArrow?: boolean
}

const variants = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary/90 border border-primary',
  accent:
    'bg-accent text-accent-foreground hover:brightness-105 border border-accent',
  outline:
    'bg-transparent text-foreground border border-foreground/25 hover:bg-foreground hover:text-background',
  outlineLight:
    'bg-transparent text-primary-foreground border border-primary-foreground/40 hover:bg-primary-foreground hover:text-primary',
}

export function Cta({
  href,
  children,
  variant = 'primary',
  className,
  withArrow = true,
}: CtaProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3.5 text-sm font-medium tracking-wide uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        variants[variant],
        className,
      )}
    >
      {children}
      {withArrow && (
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      )}
    </Link>
  )
}