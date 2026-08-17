import { memo, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Calendar, ExternalLink, GraduationCap, Sparkles } from 'lucide-react'
import { resumeData } from '../../../lib/resume-data'
import { useTheme } from '../../providers/ThemeProvider'
import { CertificationStampCarousel, type StampItem } from '../CertificationStampCarousel'

interface AchievementCardData {
  id: string
  title: string
  subtitle: string
  description: string
  badges: string[]
  year: string
  link?: string
  logo?: string
  kind: 'Education' | 'Award'
}

// Shared by both the Academic Journey and Notable Achievements lists - same
// card, same click-to-reveal interaction (never hover), just a different
// icon/label per kind so it's clear which is which.
const AchievementCard = memo(function AchievementCard({ item, isDark }: { item: AchievementCardData; isDark: boolean }) {
  const [open, setOpen] = useState(false)
  const FallbackIcon = item.kind === 'Education' ? GraduationCap : Award

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="rounded-xl transition-colors duration-300 cursor-pointer"
      style={{
        backgroundColor: isDark ? 'var(--bg-card)' : '#FFFFFF',
        border: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.22)' : 'rgba(212, 165, 116, 0.35)'}`,
        boxShadow: isDark ? '0 10px 30px rgba(0, 0, 0, 0.28)' : '0 10px 30px rgba(26, 18, 8, 0.08)',
      }}
      onClick={() => setOpen((h) => !h)}
    >
      <div className="p-4 md:p-5">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0 overflow-hidden"
            style={{
              background: item.logo ? '#1A1208' : 'linear-gradient(145deg, #D4A574, #9B8B70)',
              border: item.logo ? '1px solid rgba(212, 165, 116, 0.3)' : 'none',
            }}
          >
            {item.logo ? (
              <img src={item.logo} alt="" className="w-full h-full object-contain p-1.5" />
            ) : (
              <FallbackIcon className="w-5 h-5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-display font-bold text-base md:text-lg leading-tight break-words" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
                {item.title}
              </h3>
              <span
                className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                style={{
                  backgroundColor: isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.2)',
                  color: '#9B8B70',
                }}
              >
                {item.kind}
              </span>
            </div>

            <p className="text-sm font-medium break-words" style={{ color: 'var(--accent-primary)' }}>
              {item.subtitle}
            </p>
          </div>
        </div>

        <div className="pt-4 mt-4" style={{ borderTop: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.3)'}` }}>
          {item.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {item.badges.map((badge) => (
                <span
                  key={`${item.id}-${badge}`}
                  className="px-3 py-1 text-xs rounded-full font-medium"
                  style={{
                    backgroundColor: isDark ? 'rgba(212, 165, 116, 0.18)' : 'rgba(212, 165, 116, 0.2)',
                    color: isDark ? '#F0EBE0' : '#4A3C2A',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <p className="text-sm leading-relaxed mb-4 pt-1" style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}>
                  {item.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!open && (
            <p className="flex items-center gap-1.5 text-xs font-medium mb-3" style={{ color: '#9B8B70', opacity: 0.75 }}>
              <Sparkles size={11} />
              Tap for the story
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: '#9B8B70' }}>
            <Calendar className="w-4 h-4" />
            <span className="font-medium">{item.year}</span>
          </div>

          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 mt-4 text-sm font-medium transition-transform duration-200 hover:translate-x-0.5"
              style={{ color: 'var(--accent-primary)' }}
            >
              View Source
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
})

export const CertificationsSection = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  const educationItems = useMemo<AchievementCardData[]>(() => resumeData.education.map((edu, index) => ({
    id: `education-${index}`,
    title: edu.school,
    subtitle: edu.specialization ? `${edu.degree} · ${edu.specialization}` : edu.degree,
    description: edu.location,
    badges: [],
    year: edu.period,
    link: edu.url,
    kind: 'Education' as const,
  })), [])

  const achievementItems = useMemo<AchievementCardData[]>(() => resumeData.achievements.map((achievement, index) => ({
    id: `achievement-${index}`,
    title: achievement.title,
    subtitle: achievement.subtitle || 'Notable Achievement',
    description: achievement.description,
    badges: ['Achievement'],
    year: String(achievement.year),
    link: achievement.url,
    logo: achievement.logo,
    kind: 'Award' as const,
  })), [])

  const certStamps = useMemo<StampItem[]>(() => resumeData.certifications.map((cert) => ({
    image: { src: cert.logo, alt: `${cert.title} logo` },
    title: cert.title,
    caption: `${cert.issuer} · ${cert.year}`,
    description: cert.description,
  })), [])

  return (
    <section
      id="certifications"
      className="relative w-full py-24 px-6 overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: isDark ? 'var(--bg-primary)' : '#F5F0E8',
      }}
    >
      {/* Decorative */}
      <div className="absolute bottom-10 left-20 w-48 h-48 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header - covers Education, Achievements, and Certifications now
            that they live in one section instead of being split across a
            scroll-scaled "peel" transition between two separate sections. */}
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-medium mb-4" style={{ color: 'var(--accent-primary)' }}>
            <Award size={16} />
            Credentials
          </span>
          <h2 className="font-brush text-4xl md:text-5xl transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
            Journey & Credentials
          </h2>
        </div>

        {/* Education */}
        <div id="education" className="mb-20">
          <h3 className="text-2xl font-display font-bold mb-8 text-center transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
            Academic Journey
          </h3>

          <div className="space-y-4">
            {educationItems.map((item) => (
              <AchievementCard key={item.id} item={item} isDark={isDark} />
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-20">
          <h3 className="text-2xl font-display font-bold mb-8 text-center transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
            Notable Achievements
          </h3>

          <div className="space-y-4">
            {achievementItems.map((item) => (
              <AchievementCard key={item.id} item={item} isDark={isDark} />
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="text-2xl font-display font-bold mb-8 text-center transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
            Certifications
          </h3>

          <CertificationStampCarousel stamps={certStamps} isDark={isDark} />
        </div>
      </div>
    </section>
  )
}
