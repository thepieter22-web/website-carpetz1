import { useTranslations } from 'next-intl'
import { Plus, Menu, MessageCircle, Phone } from 'lucide-react'
import { Link } from '@/navigation'

/** Zijbalk van de klantenservicepagina's: snelle navigatie + persoonlijk contact. */
export function LegalSidebar() {
  const t = useTranslations('Legal')

  const links = [
    { label: t('serviceLinks.returns'), href: '/retourbeleid' },
    { label: t('serviceLinks.privacy'), href: '/privacybeleid' },
    { label: t('serviceLinks.terms'), href: '/algemene-voorwaarden' },
  ]

  return (
    <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
      <div className="overflow-hidden rounded-xl border border-[#E6D5B8] bg-[#FFF8EB]">
        <div className="flex justify-center bg-[#3B2A1A] px-6 py-8">
          <div className="flex size-14 items-center justify-center rounded-full bg-white">
            <Menu className="size-6 text-[#3B2A1A]" />
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-serif text-xl font-semibold">{t('serviceTitle')}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t('serviceText')}</p>
          <div className="mt-5 space-y-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-2 rounded-lg border border-[#E6D5B8] bg-white px-4 py-3 text-sm font-medium transition-colors hover:border-[#C69C4D]"
              >
                <Plus className="size-4 shrink-0 text-[#C69C4D]" />
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E6D5B8] bg-[#FFF8EB]">
        <div className="flex justify-center bg-[#3B2A1A] px-6 py-8">
          <div className="flex size-14 items-center justify-center rounded-full bg-white">
            <MessageCircle className="size-6 text-[#3B2A1A]" />
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-serif text-xl font-semibold">{t('contactTitle')}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t('contactText')}</p>
          <a
            href="mailto:info@carpetz.be"
            className="mt-5 block w-full rounded-lg bg-[#3B2A1A] px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#2a1d12]"
          >
            {t('sendMessage')}
          </a>
          <a
            href="https://wa.me/32485464949"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1ebe5b]"
          >
            <MessageCircle className="size-4" />
            {t('whatsapp')}
          </a>
          <div className="mt-5 border-t border-[#E6D5B8] pt-5 text-sm">
            <p className="text-muted-foreground">{t('callUs')}</p>
            <a
              href="tel:+32488236581"
              className="mt-1 flex items-center gap-2 text-lg font-semibold text-[#3B2A1A] transition-colors hover:text-[#C69C4D]"
            >
              <Phone className="size-4" />
              +32 488 23 65 81
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
