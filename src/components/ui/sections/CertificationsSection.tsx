import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Award } from 'lucide-react'
import { resumeData } from '../../../lib/resume-data'
import { useTheme } from '../../providers/ThemeProvider'
import { CertificationStampCarousel, type StampItem } from '../CertificationStampCarousel'
import { ClickExpandList, type ClickExpandItem } from '../ClickExpandList'
import { RunningCharacter } from '../RunningCharacter'

// Each sub-section tilts and settles into place as it scrolls into view -
// a "teda sa" (slightly crooked -> straightens out) transition between
// Academic Journey / Notable Achievements / Certifications now that they
// live in one section, in place of the old cross-section sticky scale/
// rotate peel (which was also the thing that let the Education cards get
// cut off before - this version is a simple per-block whileInView reveal,
// no sticky pinning, so it can't reproduce that bug).
const TiltIn = ({ children, tilt }: { children: React.ReactNode; tilt: number }) => (
  <motion.div
    initial={{ opacity: 0, rotate: tilt, scale: 0.94, y: 40 }}
    whileInView={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
)

export const CertificationsSection = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  const educationItems = useMemo<ClickExpandItem[]>(
    () =>
      resumeData.education.map((edu, index) => ({
        index: String(index + 1).padStart(2, '0'),
        title: edu.school,
        subtitle: edu.specialization ? `${edu.degree} · ${edu.specialization}` : edu.degree,
        badge: 'Education',
        meta: [
          { icon: 'calendar', label: edu.period },
          { icon: 'map', label: edu.location },
        ],
        url: edu.url,
      })),
    [],
  )

  const achievementItems = useMemo<ClickExpandItem[]>(
    () =>
      resumeData.achievements.map((achievement, index) => ({
        index: String(index + 1).padStart(2, '0'),
        title: achievement.title,
        subtitle: achievement.subtitle || 'Notable Achievement',
        badge: 'Award',
        description: achievement.description,
        meta: [{ icon: 'calendar', label: String(achievement.year) }],
        url: achievement.url,
      })),
    [],
  )

  const certStamps = useMemo<StampItem[]>(
    () =>
      resumeData.certifications.map((cert) => ({
        image: { src: cert.logo, alt: `${cert.title} logo` },
        title: cert.title,
        caption: `${cert.issuer} · ${cert.year}`,
        description: cert.description,
      })),
    [],
  )

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
        <TiltIn tilt={-5}>
          <div id="education" className="mb-20">
            <h3 className="text-2xl font-display font-bold mb-8 text-center transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
              Academic Journey
            </h3>
            <ClickExpandList items={educationItems} isDark={isDark} />
          </div>
        </TiltIn>

        {/* One runner, between the two lists, sitting back in the
            background rather than one per section. */}
        <RunningCharacter size={190} duration={9} opacity={0.65} />

        {/* Achievements */}
        <TiltIn tilt={5}>
          <div className="mb-20">
            <h3 className="text-2xl font-display font-bold mb-8 text-center transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
              Notable Achievements
            </h3>
            <ClickExpandList items={achievementItems} isDark={isDark} />
          </div>
        </TiltIn>

        {/* Certifications */}
        <TiltIn tilt={-4}>
          <div>
            <h3 className="text-2xl font-display font-bold mb-8 text-center transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
              Certifications
            </h3>
            <CertificationStampCarousel stamps={certStamps} isDark={isDark} />
          </div>
        </TiltIn>
      </div>
    </section>
  )
}
