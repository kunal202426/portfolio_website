import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Award, Calendar, ExternalLink } from 'lucide-react'
import { resumeData } from '../../../lib/resume-data'
import { useTheme } from '../../providers/ThemeProvider'
import { Awards } from '../award'

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

const AchievementCard = memo(function AchievementCard({ item, isDark }: { item: AchievementCardData; isDark: boolean }) {

  return (
    <article
      className="rounded-xl transition-all duration-300"
      style={{
        backgroundColor: isDark ? '#1A1510' : '#FFFFFF',
        border: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.22)' : 'rgba(212, 165, 116, 0.35)'}`,
        boxShadow: isDark ? '0 10px 30px rgba(0, 0, 0, 0.28)' : '0 10px 30px rgba(26, 18, 8, 0.08)',
      }}
    >
      <div className="p-4 md:p-5">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0 overflow-hidden"
            style={{
              background: item.logo ? (isDark ? '#F0EBE0' : '#FFFFFF') : 'linear-gradient(145deg, #D4A574, #9B8B70)',
              border: item.logo ? `1px solid ${isDark ? 'rgba(212, 165, 116, 0.3)' : 'rgba(212, 165, 116, 0.35)'}` : 'none',
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

            <p className="text-sm font-medium break-words" style={{ color: '#E8570C' }}>
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

          <p className="text-sm leading-relaxed mb-4" style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}>
            {item.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: '#9B8B70' }}>
            <Calendar className="w-4 h-4" />
            <span className="font-medium">{item.year}</span>
          </div>

          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm font-medium transition-transform duration-200 hover:translate-x-0.5"
              style={{ color: '#E8570C' }}
            >
              View Source
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </article>
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
      <div className="absolute bottom-10 left-20 w-48 h-48 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #E8570C 0%, transparent 70%)' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-medium mb-4" style={{ color: '#E8570C' }}>
            <Award size={16} />
            Certifications
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
            Professional Credentials
          </h2>
        </div>

        {/* Certificates using Awards Component */}
        <div className="mb-20">
          <h3 className="text-2xl font-display font-bold mb-8 text-center transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
            Certifications
          </h3>

          {/* Mobile: compact staggered cards */}
          <div className="md:hidden grid grid-cols-2 gap-3">
            {resumeData.certifications.map((cert, index) => (
              <motion.div
                key={`cert-mobile-${index}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.3, delay: index * 0.07 }}
                className="rounded-xl p-4 flex flex-col gap-2"
                style={{
                  backgroundColor: isDark ? 'rgba(26, 21, 16, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                  border: `1.5px solid ${isDark ? 'rgba(212, 165, 116, 0.3)' : 'rgba(232, 87, 12, 0.35)'}`,
                  boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 16px rgba(232,87,12,0.1)',
                }}
              >
                <span
                  className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full w-fit"
                  style={{
                    background: 'rgba(232,87,12,0.15)',
                    color: '#E8570C',
                    border: '1px solid rgba(232,87,12,0.3)',
                  }}
                >
                  {cert.year}
                </span>
                <p className="text-xs font-bold leading-tight" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
                  {cert.title}
                </p>
                <p className="text-[11px] font-medium" style={{ color: '#9B8B70' }}>
                  {cert.issuer}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Desktop: full award cards */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 place-items-center">
            {resumeData.certifications.map((cert, index) => (
              <div
                key={`cert-${index}`}
                className="w-full transition-transform duration-300 hover:-translate-y-1"
              >
                <div
                  className="rounded-xl p-4 transition-all duration-300"
                  style={{
                    backgroundColor: isDark ? 'rgba(26, 21, 16, 0.8)' : 'rgba(255, 255, 255, 0.95)',
                    border: `2px solid ${isDark ? 'rgba(212, 165, 116, 0.4)' : 'rgba(232, 87, 12, 0.5)'}`,
                    boxShadow: isDark
                      ? '0 8px 24px rgba(0, 0, 0, 0.3)'
                      : '0 8px 24px rgba(232, 87, 12, 0.15)',
                  }}
                >
                  <Awards
                    variant="certificate"
                    title={cert.title}
                    subtitle={`${cert.description}`}
                    recipient={cert.issuer}
                    date={String(cert.year)}
                  />
                </div>
              </div>
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
