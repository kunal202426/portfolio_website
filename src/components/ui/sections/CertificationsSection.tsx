import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Award, CheckCircle2 } from 'lucide-react'
import { resumeData } from '../../../lib/resume-data'
import { useTheme } from '../../providers/ThemeProvider'

gsap.registerPlugin(ScrollTrigger)

export const CertificationsSection = () => {
  const containerRef = useRef<HTMLElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.cert-card', {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
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

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {resumeData.certifications.map((cert, index) => (
            <motion.div
              key={index}
              className="cert-card relative p-6 rounded-xl shadow-md overflow-hidden transition-colors duration-500"
              style={{ 
                backgroundColor: isDark ? '#1A1510' : '#FFFFFF',
                border: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.3)'}`
              }}
              whileHover={{ scale: 1.03, y: -8, boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.3)' : '0 20px 40px rgba(26, 18, 8, 0.1)' }}
            >
              {/* Badge Icon */}
              <motion.div
                className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4"
                style={{ backgroundColor: isDark ? 'rgba(232, 87, 12, 0.15)' : 'rgba(232, 87, 12, 0.1)' }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Award className="w-6 h-6" style={{ color: '#E8570C' }} />
              </motion.div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-display font-bold pr-4 transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
                    {cert.title}
                  </h3>
                  <motion.span
                    className="flex-shrink-0 px-2 py-1 text-xs font-mono rounded-full"
                    style={{ backgroundColor: isDark ? 'rgba(232, 87, 12, 0.15)' : 'rgba(232, 87, 12, 0.1)', color: '#E8570C' }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {cert.year}
                  </motion.span>
                </div>

                <p className="text-sm font-medium mb-3" style={{ color: '#E8570C' }}>
                  {cert.issuer}
                </p>

                <p className="text-sm leading-relaxed mb-4 transition-colors duration-500" style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}>
                  {cert.description}
                </p>

                {/* Verification Badge */}
                <div className="flex items-center gap-2 text-xs" style={{ color: '#9B8B70' }}>
                  <CheckCircle2 className="w-4 h-4" style={{ color: '#22C55E' }} />
                  <span>Verified Certification</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievements Section */}
        <div>
          <h3 className="text-2xl font-display font-bold mb-8 text-center transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
            Notable Achievements
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resumeData.achievements.map((achievement, index) => (
              <motion.a
                key={index}
                href={achievement.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cert-card flex gap-4 p-6 rounded-xl shadow-md transition-colors duration-500 cursor-pointer"
                style={{
                  backgroundColor: isDark ? '#1A1510' : '#FFFFFF',
                  border: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.3)'}`
                }}
                whileHover={{ x: 4, boxShadow: isDark ? '0 10px 30px rgba(0, 0, 0, 0.3)' : '0 10px 30px rgba(26, 18, 8, 0.1)' }}
              >
                <motion.div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: isDark ? 'rgba(232, 87, 12, 0.15)' : 'rgba(232, 87, 12, 0.1)' }}
                  whileHover={{ scale: 1.1, rotate: 15 }}
                >
                  <Award className="w-5 h-5" style={{ color: '#E8570C' }} />
                </motion.div>
                <div className="flex-1">
                  <h4 className="text-base font-display font-bold mb-1 transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
                    {achievement.title}
                  </h4>
                  {achievement.subtitle && (
                    <p className="text-sm font-medium mb-2" style={{ color: '#E8570C' }}>
                      {achievement.subtitle}
                    </p>
                  )}
                  <p className="text-sm transition-colors duration-500" style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}>
                    {achievement.description}
                  </p>
                  <span className="inline-block mt-2 text-xs font-mono" style={{ color: '#9B8B70' }}>
                    {achievement.year}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
