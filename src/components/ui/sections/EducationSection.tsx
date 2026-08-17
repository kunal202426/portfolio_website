import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GraduationCap, MapPin, Calendar } from 'lucide-react'
import { resumeData } from '../../../lib/resume-data'
import { useTheme } from '../../providers/ThemeProvider'

gsap.registerPlugin(ScrollTrigger)

export const EducationSection = () => {
  const containerRef = useRef<HTMLElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.edu-card', {
        x: -60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%'
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="education"
      className="relative w-full py-10 md:py-16 px-6 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: isDark ? 'var(--bg-primary)' : '#FFFBF5' }}
    >
      {/* Decorative */}
      <div className="absolute top-10 right-20 w-32 h-32 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #D4A574 0%, transparent 70%)' }} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6 md:mb-10">
          <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-medium mb-3" style={{ color: '#D4A574' }}>
            <GraduationCap size={16} />
            Education
          </span>
          <h2 className="font-brush text-4xl md:text-5xl transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
            Academic Journey
          </h2>
        </div>

        {/* Education Cards - the section as a whole is scroll-scaled away
            (see App.tsx's educationCertRef transform) as the Certifications
            section slides up over it. That transform only completes partway
            through the scroll, so cards taller than the viewport risk being
            covered before ever fully showing - keep this tight, especially
            on mobile where the two-column layout below stacks into one. */}
        <div className="space-y-3 md:space-y-5">
          {resumeData.education.map((edu, index) => (
            <motion.div
              key={index}
              className="edu-card relative p-6 md:p-8 rounded-xl shadow-lg transition-colors duration-500"
              style={{ 
                backgroundColor: isDark ? 'var(--bg-card)' : '#FFFFFF',
                border: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.3)'}`
              }}
              whileHover={{ scale: 1.02, y: -4, boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.3)' : '0 20px 40px rgba(26, 18, 8, 0.1)' }}
            >
              {/* Accent Line */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              />

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 ml-4">
                {/* Left Content */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <motion.div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: isDark ? 'rgba(var(--accent-primary-rgb), 0.15)' : 'rgba(var(--accent-primary-rgb), 0.1)' }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <GraduationCap className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-xl font-display font-bold mb-1 transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
                        {edu.url ? (
                          <a
                            href={edu.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-70 underline underline-offset-2 transition-opacity"
                          >
                            {edu.school}
                          </a>
                        ) : (
                          edu.school
                        )}
                      </h3>
                      <p className="text-base font-medium mb-2" style={{ color: 'var(--accent-primary)' }}>
                        {edu.degree}
                        {edu.specialization && (
                          <span className="transition-colors duration-500" style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}> • {edu.specialization}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm ml-11 transition-colors duration-500" style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" style={{ color: '#D4A574' }} />
                      <span>{edu.period}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" style={{ color: '#D4A574' }} />
                      <span>{edu.location}</span>
                    </div>
                  </div>
                </div>

                {/* Right Stats */}
                <div className="flex flex-col items-end gap-2">
                  {edu.cgpa && (
                    <motion.div
                      className="px-4 py-2 rounded-lg transition-colors duration-500"
                      style={{ backgroundColor: isDark ? 'rgba(var(--accent-primary-rgb), 0.15)' : 'rgba(var(--accent-primary-rgb), 0.1)' }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <p className="text-xs font-mono mb-1" style={{ color: '#9B8B70' }}>CGPA</p>
                      <p className="text-2xl font-display font-bold" style={{ color: 'var(--accent-primary)' }}>{edu.cgpa}</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
