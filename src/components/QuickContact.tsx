import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { site } from '@/data/site'
import { useUi } from '@/i18n/context'
import { IconChatBubble, IconMail, IconPhoneRing, IconWhatsApp } from './icons'

/**
 * Persistent quick contact, desktop and mobile alike: one round espresso
 * launcher pinned bottom right. Tapping it fans out three labelled channels,
 * WhatsApp, phone and email, so the visitor picks how to reach us. Closes on
 * Escape, on outside click and after choosing a channel.
 *
 * DOM order is launcher first, then the menu, inside flex-col-reverse: the
 * visual stack is unchanged but Tab flows launcher -> WhatsApp -> call ->
 * email instead of leaving the widget.
 */
export function QuickContact() {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const t = useUi()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on outside click / tap; Escape also hands focus back to the launcher.
  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        launcherRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const channels = [
    {
      key: 'whatsapp',
      label: t.quick.whatsapp,
      href: site.whatsapp,
      external: true,
      icon: <IconWhatsApp className="h-6 w-6" />,
      circle: 'bg-[#25D366] text-white',
    },
    {
      key: 'call',
      label: `${t.common.callPrefix} ${site.phone}`,
      href: `tel:${site.phoneRaw}`,
      external: false,
      icon: <IconPhoneRing className="h-6 w-6" />,
      circle: 'bg-gold-deep text-cream',
    },
    {
      key: 'email',
      label: t.quick.email,
      href: `mailto:${site.email}`,
      external: false,
      icon: <IconMail className="h-6 w-6" />,
      circle: 'bg-cream text-espresso border border-espresso/20',
    },
  ]

  return (
    <div
      ref={rootRef}
      className={`fixed bottom-5 right-5 z-40 flex flex-col-reverse items-end gap-3 transition-all duration-300 sm:bottom-6 sm:right-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
      aria-hidden={!visible}
    >
      {/* launcher (first in DOM, bottom of the visual stack) */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        tabIndex={visible ? 0 : -1}
        aria-expanded={open}
        aria-controls="quick-contact-menu"
        aria-label={open ? t.quick.close : t.quick.open}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-espresso text-gold-bright transition-colors hover:bg-walnut"
      >
        {open ? <X className="h-6 w-6" /> : <IconChatBubble className="h-7 w-7" />}
      </button>

      {/* fan-out: one row per channel, label chip + round icon button */}
      <div
        id="quick-contact-menu"
        className={`flex flex-col items-end gap-3 transition-all duration-200 ${
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
        }`}
        aria-hidden={!open}
      >
        {channels.map((c, i) => (
          <a
            key={c.key}
            href={c.href}
            onClick={() => setOpen(false)}
            tabIndex={visible && open ? 0 : -1}
            {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="group flex items-center gap-3"
            style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }}
          >
            <span className="rounded-md border border-cream/15 bg-espresso px-3 py-1.5 text-[13px] font-semibold text-cream">
              {c.label}
            </span>
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-105 ${c.circle}`}
            >
              {c.icon}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
