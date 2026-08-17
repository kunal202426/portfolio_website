import { memo, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Calendar, ExternalLink, Sparkles } from 'lucide-react'
import { resumeData } from '../../../lib/resume-data'
import { useTheme } from '../../providers/ThemeProvider'

type Certification = (typeof resumeData.certifications)[number]

interface AchievementCardData {
  id: string
  title: string
  subtitle: string
  description: string
  badges: string[]
  year: string
  link?: string
  logo?: string
}

// One consistent card for all certifications, mobile and desktop alike.
// Only the essentials (logo/title/issuer/year) sit on the face; the
// description stays hidden behind a hover/tap reveal instead of being
// crammed onto the card by default.
const CertCard = memo(function CertCard({ cert, index, isDark }: { cert: Certification; index: number; isDark: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="relative rounded-xl overflow-hidden cursor-pointer"
      style={{
        minHeight: 190,
        backgroundColor: isDark ? 'rgba(26, 21, 16, 0.9)' : '#FFFFFF',
        border: `1.5px solid ${isDark ? 'rgba(212, 165, 116, 0.25)' : 'rgba(31, 169, 113, 0.3)'}`,
        boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.28)' : '0 8px 24px rgba(31,169,113,0.1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered((h) => !h)}
    >
      {/* Face */}
      <div className="p-5 flex flex-col items-center text-center gap-2 h-full">
        {cert.logo && (
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{ background: '#FFFFFF', border: '1px solid rgba(212,165,116,0.3)' }}
          >
            <img src={cert.logo} alt="" className="w-full h-full object-contain p-1.5" />
          </div>
        )}
        <p className="text-sm font-bold leading-snug" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
          {cert.title}
        </p>
        <p className="text-xs font-medium" style={{ color: '#1FA971' }}>{cert.issuer}</p>
        <span
          className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(31,169,113,0.12)', color: '#1FA971', border: '1px solid rgba(31,169,113,0.3)' }}
        >
          {cert.year}
        </span>
        <span
          className="flex items-center gap-1 text-[10px] font-medium mt-auto pt-2"
          style={{ color: '#9B8B70', opacity: 0.75 }}
        >
          <Sparkles size={10} />
          Hover for details
        </span>
      </div>

      {/* Hover reveal */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-5"
        style={{ backgroundColor: isDark ? 'rgba(20, 16, 11, 0.97)' : 'rgba(255, 255, 255, 0.98)' }}
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#1FA971' }}>
          {cert.issuer}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}>
          {cert.description}
        </p>
      </motion.div>
    </motion.div>
  )
})

const AchievementCard = memo(function AchievementCard({ item, isDark }: { item: AchievementCardData; isDark: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="rounded-xl transition-colors duration-300 cursor-pointer"
      style={{
        backgroundColor: isDark ? '#1A1510' : '#FFFFFF',
        border: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.22)' : 'rgba(212, 165, 116, 0.35)'}`,
        boxShadow: isDark ? '0 10px 30px rgba(0, 0, 0, 0.28)' : '0 10px 30px rgba(26, 18, 8, 0.08)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered((h) => !h)}
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
              <Award className="w-5 h-5" />
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
                Award
              </span>
            </div>

            <p className="text-sm font-medium break-words" style={{ color: '#1FA971' }}>
              {item.subtitle}
            </p>
          </div>
        </div>

        <div className="pt-4 mt-4" style={{ borderTop: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.3)'}` }}>
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

          <AnimatePresence initial={false}>
            {hovered && (
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

          {!hovered && (
            <p className="flex items-center gap-1.5 text-xs font-medium mb-3" style={{ color: '#9B8B70', opacity: 0.75 }}>
              <Sparkles size={11} />
              Hover for the story
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
              style={{ color: '#1FA971' }}
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
  const isDark = resolvedTheme === 'dark'

  const achievementItems = useMemo<AchievementCardData[]>(() => resumeData.achievements.map((achievement, index) => ({
    id: `achievement-${index}`,
    title: achievement.title,
    subtitle: achievement.subtitle || 'Notable Achievement',
    description: achievement.description,
    badges: ['Achievement'],
    year: String(achievement.year),
    link: achievement.url,
    logo: achievement.logo,
  })), [])

  return (
    <section
      id="certifications"
      className="relative w-full py-24 px-6 overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: isDark ? '#0E0E0B' : '#F5F0E8',
      }}
    >
      {/* Decorative */}
      <div className="absolute bottom-10 left-20 w-48 h-48 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #1FA971 0%, transparent 70%)' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-medium mb-4" style={{ color: '#1FA971' }}>
            <Award size={16} />
            Certifications
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
            Professional Credentials
          </h2>
        </div>

        {/* Certifications */}
        <div className="mb-20">
          <h3 className="text-2xl font-display font-bold mb-8 text-center transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
            Certifications
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {resumeData.certifications.map((cert, index) => (
              <CertCard key={cert.title} cert={cert} index={index} isDark={isDark} />
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div>
          <h3 className="text-2xl font-display font-bold mb-8 text-center transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
            Notable Achievements
          </h3>

          <div className="space-y-4">
            {achievementItems.map((item) => (
              <AchievementCard key={item.id} item={item} isDark={isDark} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
