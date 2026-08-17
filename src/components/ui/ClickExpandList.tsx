import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, ExternalLink, MapPin, Plus } from 'lucide-react'

export interface ClickExpandItem {
  index: string
  title: string
  subtitle: string
  badge: string
  description?: string
  meta?: { icon: 'calendar' | 'map'; label: string }[]
  url?: string
}

// Numbered list where each row stays collapsed to a single line until
// clicked/tapped - never on hover - then expands in place to reveal its
// description and/or meta chips. Shared by Academic Journey and Notable
// Achievements so both read as the same interaction, just with a different
// badge label and a different mix of description vs. meta per item.
export const ClickExpandList = ({ items, isDark }: { items: ClickExpandItem[]; isDark: boolean }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const lineColor = isDark ? 'rgba(240, 235, 224, 0.14)' : 'rgba(26, 18, 8, 0.14)'

  return (
    <div style={{ borderTop: `1px solid ${lineColor}` }}>
      {items.map((item, i) => {
        const open = openIndex === i
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setOpenIndex((cur) => (cur === i ? null : i))}
            style={{
              borderBottom: `1px solid ${lineColor}`,
              cursor: 'pointer',
              padding: '18px 6px',
              backgroundColor: open ? (isDark ? 'rgba(232, 86, 12, 0.07)' : 'rgba(191, 91, 61, 0.05)') : 'transparent',
              transition: 'background-color 0.25s ease',
            }}
          >
            <div className="flex items-center gap-4 md:gap-5">
              <span
                className="spec-label flex-shrink-0"
                style={{ minWidth: 26, opacity: open ? 1 : 0.5, color: open ? 'var(--accent-primary)' : undefined, transition: 'color 0.25s ease, opacity 0.25s ease' }}
              >
                {item.index}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className="font-display"
                    style={{
                      fontSize: 'clamp(17px, 2.6vw, 24px)',
                      margin: 0,
                      color: open ? 'var(--accent-primary)' : isDark ? '#F0EBE0' : '#1A1208',
                      transition: 'color 0.25s ease',
                    }}
                  >
                    {item.title}
                  </h3>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide"
                    style={{ backgroundColor: isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.2)', color: '#9B8B70' }}
                  >
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs md:text-sm" style={{ margin: '2px 0 0', color: isDark ? '#9B8B70' : '#4A3C2A' }}>
                  {item.subtitle}
                </p>
              </div>

              <motion.span
                animate={{ rotate: open ? 45 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ color: 'var(--accent-primary)', flexShrink: 0 }}
              >
                <Plus size={20} />
              </motion.span>
            </div>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ paddingTop: 12, paddingLeft: 42 }}>
                    {item.description && (
                      <p className="text-sm leading-relaxed" style={{ margin: '0 0 10px', color: isDark ? '#D4C4A8' : '#4A3C2A' }}>
                        {item.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      {item.meta?.map((m, mi) => (
                        <span key={mi} className="inline-flex items-center gap-1.5 text-xs md:text-sm" style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}>
                          {m.icon === 'calendar' ? <Calendar size={13} style={{ color: '#D4A574' }} /> : <MapPin size={13} style={{ color: '#D4A574' }} />}
                          {m.label}
                        </span>
                      ))}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs md:text-sm font-medium hover:translate-x-0.5 transition-transform duration-200"
                          style={{ color: 'var(--accent-primary)' }}
                        >
                          Visit
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
