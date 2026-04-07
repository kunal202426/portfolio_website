import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { User } from 'lucide-react'
import { useTheme } from '../providers/ThemeProvider'

gsap.registerPlugin(ScrollTrigger)

export const AboutSection = () => {
  const containerRef = useRef<HTMLElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const stats = [
    { label: 'Years Coding', value: '5+' },
    { label: 'Projects Built', value: '20+' },
    { label: 'Teams Led', value: '3' },
  ]

  const achievements = [
    'Global Hyperloop Winner',
    'Flipkart GRiD Semi-Finalist',
    'Blockchain Certified',
    'Full Stack Expertise',
  ]

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.about-content', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%'
        }
      })

      gsap.from('.about-visual', {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%'
        }
      })

      gsap.from('.stat-item', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.stats-container',
          start: 'top 80%'
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={containerRef}
      id="about" 
      className="relative w-full py-24 px-6 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: isDark ? '#0E0E0B' : '#F5F0E8' }}
    >
      {/* Decorative */}
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #E8570C 0%, transparent 70%)' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="about-content">
            {/* Section Tag */}
            <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-medium mb-4" style={{ color: '#E8570C' }}>
              <User size={16} />
              About Me
            </span>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
              I design experiences,
              <br />
              <span style={{ color: '#E8570C' }}>not just interfaces.</span>
            </h2>

            {/* Bio */}
            <div className="space-y-4 mb-8">
              <p className="text-lg leading-relaxed transition-colors duration-500" style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}>
                I'm a full-stack developer and designer obsessed with creating digital experiences that feel
                alive. From real-time 3D simulations to distributed system architectures, I think beyond the
                surface.
              </p>
              <p className="text-lg leading-relaxed transition-colors duration-500" style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}>
                Currently exploring ML systems, blockchain platforms, and the intersection of beautiful design
                with bulletproof engineering. I believe the best products live at the edge of art and science.
              </p>
            </div>

            {/* Stats */}
            <div 
              className="stats-container grid grid-cols-3 gap-4 mb-8 py-8"
              style={{ borderTop: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.4)'}`, borderBottom: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.4)'}` }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="stat-item text-center">
                  <div className="text-3xl font-bold mb-2" style={{ color: '#E8570C' }}>{stat.value}</div>
                  <div className="text-xs uppercase tracking-widest transition-colors duration-500" style={{ color: isDark ? '#9B8B70' : '#9B8B70' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Achievement Pills */}
            <div className="flex flex-wrap gap-3">
              {achievements.map((achievement) => (
                <motion.span
                  key={achievement}
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: isDark ? 'rgba(232, 87, 12, 0.15)' : 'rgba(232, 87, 12, 0.1)',
                    border: '1px solid rgba(232, 87, 12, 0.3)',
                    color: '#E8570C'
                  }}
                  whileHover={{ scale: 1.05, backgroundColor: isDark ? 'rgba(232, 87, 12, 0.25)' : 'rgba(232, 87, 12, 0.2)' }}
                >
                  {achievement}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Right Column - Abstract Visual */}
          <div 
            className="about-visual h-full min-h-96 rounded-2xl relative overflow-hidden p-8 flex items-center justify-center shadow-xl transition-colors duration-500"
            style={{ 
              background: isDark ? 'linear-gradient(145deg, #1A1510, #0E0E0B)' : 'linear-gradient(145deg, #FFFBF5, #F5F0E8)',
              border: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.3)'}`
            }}
          >
            {/* Geometric Pattern */}
            <svg className="w-full h-full" viewBox="0 0 300 300">
              {/* Outer Circle */}
              <motion.circle
                cx="150"
                cy="150"
                r="140"
                fill="none"
                stroke="url(#gradWarm1)"
                strokeWidth="1"
                opacity="0.3"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />

              {/* Middle Circle */}
              <motion.circle
                cx="150"
                cy="150"
                r="100"
                fill="none"
                stroke="url(#gradWarm2)"
                strokeWidth="1"
                opacity="0.5"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />

              {/* Inner Circle */}
              <circle cx="150" cy="150" r="60" fill="none" stroke="#E8570C" strokeWidth="2" opacity="0.7" />

              {/* Center Glow */}
              <motion.circle
                cx="150"
                cy="150"
                r="30"
                fill="#E8570C"
                opacity="0.15"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* K Letter */}
              <text x="150" y="160" textAnchor="middle" fontSize="48" fontWeight="bold" fill="#E8570C" opacity="0.6">
                K
              </text>

              <defs>
                <linearGradient id="gradWarm1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E8570C" />
                  <stop offset="100%" stopColor="#D4A574" />
                </linearGradient>
                <linearGradient id="gradWarm2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4A574" />
                  <stop offset="100%" stopColor="#E8570C" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
