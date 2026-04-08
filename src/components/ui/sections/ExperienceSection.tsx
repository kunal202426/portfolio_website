import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { resumeData } from '../../../lib/resume-data'
import { Briefcase, Calendar, MapPin } from 'lucide-react'
import { useTheme } from '../../providers/ThemeProvider'

gsap.registerPlugin(ScrollTrigger)

export const ExperienceSection = () => {
  const containerRef = useRef<HTMLElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const experiences = [...resumeData.experience].sort((a, b) => b.year - a.year)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return

    const ctx = gsap.context(() => {
      // Get the path element
      const pathElement = svgRef.current?.querySelector('.timeline-path')
      if (pathElement) {
        // Calculate path length
        const pathLength = (pathElement as SVGPathElement).getTotalLength()

        // Set initial dash properties
        pathElement.setAttribute('stroke-dasharray', String(pathLength))
        pathElement.setAttribute('stroke-dashoffset', String(pathLength))

        // Animate the path drawing on scroll
        gsap.to('.timeline-path', {
          strokeDashoffset: 0,
          duration: 1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 40%',
            end: 'bottom 60%',
            scrub: 1,
          }
        })
      }

      // Stagger cards
      gsap.from('.exp-card', {
        y: 60,
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
      id="experience" 
      className="relative w-full py-24 px-6 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: isDark ? '#0E0E0B' : '#F5F0E8' }}
    >
      {/* Decorative Background */}
      <div className="absolute top-20 right-10 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #E8570C 0%, transparent 70%)' }} />
      <div className="absolute bottom-20 left-10 w-60 h-60 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #D4A574 0%, transparent 70%)' }} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-medium mb-4" style={{ color: '#E8570C' }}>
            <Briefcase size={16} />
            Experience
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
            Career Journey
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Wavy Timeline Path SVG */}
          <svg
            ref={svgRef}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-8 pointer-events-none overflow-visible"
            style={{
              transform: 'translateX(-50%)',
              height: '100%',
              minHeight: '600px'
            }}
          >
            {/* Smooth curved serpentine path */}
            <path
              className="timeline-path"
              d={`M 16 0 C 16 60, 0 60, 0 120 C 0 180, 16 180, 16 240 C 16 300, 0 300, 0 360 C 0 420, 16 420, 16 480 C 16 540, 0 540, 0 600 C 0 660, 16 660, 16 720 C 16 780, 0 780, 0 840 C 0 900, 16 900, 16 960 C 16 1020, 0 1020, 0 1080`}
              stroke={isDark ? 'white' : 'black'}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              style={{
                filter: isDark
                  ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
                  : 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.2))'
              }}
            />
          </svg>

          {/* Experience Items */}
          {experiences.map((exp, index) => (
            <div
              key={exp.company}
              className={`exp-card relative mb-12 pl-16 md:pl-0 ${
                index % 2 === 0 ? 'md:mr-auto md:pr-16 md:w-1/2' : 'md:ml-auto md:pl-16 md:w-1/2'
              }`}
            >
              {/* Timeline Dot */}
              <motion.div
                className="absolute left-0 md:left-1/2 top-6 w-8 h-8 rounded-full flex items-center justify-center md:-ml-4 pointer-events-none z-0"
                style={{ backgroundColor: '#E8570C' }}
                whileHover={{ scale: 1.2, boxShadow: '0 0 20px rgba(232, 87, 12, 0.5)' }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isDark ? '#0E0E0B' : '#F5F0E8' }} />
              </motion.div>

              {/* Content Card */}
              <motion.div
                className="p-6 rounded-xl shadow-lg transition-colors duration-500 relative z-10"
                style={{
                  backgroundColor: isDark ? '#1A1510' : '#FFFBF5',
                  border: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.3)'}`
                }}
                whileHover={{
                  y: -4,
                  boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.3)' : '0 20px 40px rgba(26, 18, 8, 0.1)',
                  borderColor: '#E8570C'
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                  <div className="flex gap-3 items-start flex-1">
                    {exp.logo && (
                      <div
                        className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center p-2"
                        style={{
                          backgroundColor: '#2A2420'
                        }}
                      >
                        <img
                          src={exp.logo}
                          alt={exp.company}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-display font-bold text-xl transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
                        {exp.company}
                      </h3>
                      <p className="font-medium" style={{ color: '#E8570C' }}>{exp.title}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1 text-xs font-medium transition-colors duration-500" style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}>
                      <Calendar size={12} />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1 text-xs transition-colors duration-500" style={{ color: isDark ? '#9B8B70' : '#9B8B70' }}>
                      <MapPin size={12} />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Achievements */}
                <ul className="space-y-2">
                  {exp.achievements.map((achievement, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="text-sm flex gap-3 leading-relaxed transition-colors duration-500"
                      style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}
                    >
                      <span className="flex-shrink-0 mt-1" style={{ color: '#E8570C' }}>▸</span>
                      <span>{achievement}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
