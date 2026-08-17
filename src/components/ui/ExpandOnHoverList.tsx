import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, ExternalLink, MapPin, Plus } from 'lucide-react'

export interface ExpandListItem {
  index: string
  title: string
  subtitle: string
  meta: { icon: 'calendar' | 'map'; label: string }[]
  url?: string
}

// Adapted from a Framer "Expand OnHover List" reference: a numbered list
// where each row stays collapsed to a single line until hovered (or tapped,
// on touch devices), then expands in place to reveal its details. The
// reference itself is a Framer "smart component" (variant/breakpoint state
// tied to the proprietary `framer` runtime, plus a second component it
// pulls in from another hosted module) with no standalone React equivalent,
// so this reimplements the pattern rather than the literal file.
export const ExpandOnHoverList = ({ items, isDark }: { items: ExpandListItem[]; isDark: boolean }) => {
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
            onMouseEnter={() => setOpenIndex(i)}
            onMouseLeave={() => setOpenIndex((cur) => (cur === i ? null : cur))}
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
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2" style={{ paddingTop: 12, paddingLeft: 42 }}>
                    {item.meta.map((m, mi) => (
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
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
