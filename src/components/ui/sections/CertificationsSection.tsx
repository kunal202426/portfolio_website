import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Calendar, CheckCircle2, ChevronDown, ExternalLink } from 'lucide-react'
import { resumeData } from '../../../lib/resume-data'
import { useTheme } from '../../providers/ThemeProvider'
import { Awards } from '../award'

interface CredentialCardData {
  id: string
  title: string
  subtitle: string
  status: 'Verified' | 'Award'
  description: string
  badges: string[]
  year: string
  link?: string
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 320,
      damping: 28,
      mass: 0.8,
    },
  },
}

const expandedContentVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.25,
      ease: [0.04, 0.62, 0.23, 0.98],
    },
  },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.35,
      ease: [0.04, 0.62, 0.23, 0.98],
    },
  },
}

const pillVariants = {
  hover: {
    scale: 1.03,
    y: -1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 24,
    },
  },
  tap: {
    scale: 0.98,
  },
}

const logoVariants = {
  hover: {
    scale: 1.07,
    rotate: 4,
    transition: {
      type: 'spring',
      stiffness: 420,
      damping: 24,
    },
  },
}

function CredentialCard({ item, index, isDark }: { item: CredentialCardData; index: number; isDark: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isVerified = item.status === 'Verified'

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -2 }}
      className="rounded-xl cursor-pointer transition-colors duration-500"
      style={{
        backgroundColor: isDark ? '#1A1510' : '#FFFFFF',
        border: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.22)' : 'rgba(212, 165, 116, 0.35)'}`,
        boxShadow: isDark ? '0 10px 30px rgba(0, 0, 0, 0.28)' : '0 10px 30px rgba(26, 18, 8, 0.08)',
      }}
      onClick={() => setIsExpanded((prev) => !prev)}
    >
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <motion.div
              variants={logoVariants}
              whileHover="hover"
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0"
              style={{
                background: isVerified ? 'linear-gradient(145deg, #E8570C, #D4A574)' : 'linear-gradient(145deg, #D4A574, #9B8B70)',
              }}
            >
              <Award className="w-5 h-5" />
            </motion.div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-display font-bold text-base md:text-lg leading-tight break-words" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
                  {item.title}
                </h3>
                <span
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                  style={{
                    backgroundColor: isVerified ? (isDark ? 'rgba(232, 87, 12, 0.2)' : 'rgba(232, 87, 12, 0.12)') : (isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.2)'),
                    color: isVerified ? '#E8570C' : '#9B8B70',
                  }}
                >
                  {item.status}
                </span>
              </div>

              <p className="text-sm font-medium break-words" style={{ color: '#E8570C' }}>
                {item.subtitle}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={(event) => {
              event.stopPropagation()
              setIsExpanded((prev) => !prev)
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#1A1208] flex-shrink-0"
            style={{ backgroundColor: isDark ? '#D4A574' : '#E7DDD0' }}
            aria-label={isExpanded ? 'Collapse credential details' : 'Expand credential details'}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              variants={expandedContentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4" style={{ borderTop: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.3)'}` }}>
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.badges.map((badge) => (
                    <motion.span
                      key={`${item.id}-${badge}`}
                      variants={pillVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="px-3 py-1 text-xs rounded-full font-medium"
                      style={{
                        backgroundColor: isDark ? 'rgba(212, 165, 116, 0.18)' : 'rgba(212, 165, 116, 0.2)',
                        color: isDark ? '#F0EBE0' : '#4A3C2A',
                      }}
                    >
                      {badge}
                    </motion.span>
                  ))}
                </div>

                <p className="text-sm leading-relaxed mb-4" style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}>
                  {item.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: '#9B8B70' }}>
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{item.year}</span>
                  {isVerified && (
                    <>
                      <span className="mx-1">•</span>
                      <CheckCircle2 className="w-4 h-4" style={{ color: '#22C55E' }} />
                      <span>Verified</span>
                    </>
                  )}
                </div>

                {item.link && (
                  <motion.a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    whileHover={{ x: 2 }}
                    className="inline-flex items-center gap-2 mt-4 text-sm font-medium"
                    style={{ color: '#E8570C' }}
                  >
                    View Source
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export const CertificationsSection = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const credentialItems: CredentialCardData[] = resumeData.certifications.map((cert, index) => ({
    id: `cert-${index}`,
    title: cert.title,
    subtitle: cert.issuer,
    status: 'Verified',
    description: cert.description,
    badges: ['Certification', cert.issuer],
    year: String(cert.year),
  }))

  const achievementItems: CredentialCardData[] = resumeData.achievements.map((achievement, index) => ({
    id: `achievement-${index}`,
    title: achievement.title,
    subtitle: achievement.subtitle || 'Notable Achievement',
    status: 'Award',
    description: achievement.description,
    badges: ['Achievement'],
    year: String(achievement.year),
    link: achievement.url,
  }))

  return (
    <section
      id="certifications"
      className="relative w-full py-24 px-6 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: isDark ? '#0E0E0B' : '#F5F0E8' }}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center">
            {resumeData.certifications.map((cert, index) => (
              <motion.div
                key={`cert-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="w-full cursor-pointer"
              >
                <div
                  className="rounded-xl p-4 transition-all duration-300 backdrop-blur-sm"
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
              </motion.div>
            ))}
          </div>
        </div>

        {/* Credentials Section */}
        <div className="mb-14">
          <h3 className="text-2xl font-display font-bold mb-8 text-center transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
            Verified Credentials
          </h3>
          <div className="space-y-4">
            {credentialItems.map((item, index) => (
              <CredentialCard key={item.id} item={item} index={index} isDark={isDark} />
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div>
          <h3 className="text-2xl font-display font-bold mb-8 text-center transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
            Notable Achievements
          </h3>

          <div className="space-y-4">
            {achievementItems.map((item, index) => (
              <CredentialCard key={item.id} item={item} index={index} isDark={isDark} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
