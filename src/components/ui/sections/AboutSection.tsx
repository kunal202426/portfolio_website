import { useRef, useEffect, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { User } from 'lucide-react'
import { useTheme } from '../../providers/ThemeProvider'
import { KeycapButton } from '../KeycapButton'

gsap.registerPlugin(ScrollTrigger)

export const AboutSection = () => {
  const containerRef = useRef<HTMLElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const spinY = useMotionValue(0)
  const smoothX = useSpring(tiltX, { stiffness: 120, damping: 22, mass: 0.6 })
  const smoothTiltY = useSpring(tiltY, { stiffness: 120, damping: 22, mass: 0.6 })
  const smoothSpinY = useSpring(spinY, { stiffness: 80, damping: 20, mass: 0.8 })
  const combinedY = useTransform([smoothTiltY, smoothSpinY], ([t, s]) => (t as number) + (s as number))
  const lastScrollY = useRef(0)

  const stats = [
    { label: 'Years Coding', value: '3+' },
    { label: 'Projects Built', value: '20+' },
    { label: 'Teams Led', value: '3' },
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

  useEffect(() => {
    lastScrollY.current = window.scrollY
    const handleScroll = () => {
      const delta = window.scrollY - lastScrollY.current
      lastScrollY.current = window.scrollY
      spinY.set(spinY.get() + delta * 0.25)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [spinY])

  const handleBookMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const pointerX = (event.clientX - rect.left) / rect.width - 0.5
    const pointerY = (event.clientY - rect.top) / rect.height - 0.5
    tiltX.set(-pointerY * 10)
    tiltY.set(pointerX * 12)
  }

  const resetBookTilt = () => {
    tiltX.set(0)
    tiltY.set(0)
  }

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
              I build systems,
              <br />
              <span style={{ color: '#E8570C' }}>not just applications.</span>
            </h2>

            {/* Bio */}
            <div className="space-y-4 mb-8">
              <p className="text-lg leading-relaxed transition-colors duration-500" style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}>
                I'm a full-stack developer and ML engineer focused on building scalable systems that solve real problems. 
                From distributed architectures to deep learning pipelines, I work across the entire stack.
              </p>
              <p className="text-lg leading-relaxed transition-colors duration-500" style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}>
                Currently working with production React apps, FastAPI backends, ML model deployment, and data analytics.
                I believe in writing clean code, building robust systems, and shipping features that matter.
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


            {/* CTA Button */}
            <div className="flex flex-wrap gap-5 pt-4">
              <KeycapButton href="#projects" label="View My Work" icon="→" tone="orange" size="wide" />
              <KeycapButton href="#contact" label="Let's Talk" icon="✉" tone="cream" size="wide" />
            </div>
          </div>

          {/* Right Column - 3D Book with Radiating Animation */}
          <div 
            className="about-visual h-full min-h-96 rounded-2xl relative overflow-hidden p-8 flex items-center justify-center shadow-xl transition-colors duration-500"
            style={{ 
              background: isDark ? 'linear-gradient(145deg, #1A1510, #0E0E0B)' : 'linear-gradient(145deg, #FFFBF5, #F5F0E8)',
              border: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.3)'}`
            }}
            onMouseMove={handleBookMove}
            onMouseLeave={resetBookTilt}
          >
            {/* Radiating Circles Background */}
            <svg className="absolute w-full h-full" viewBox="0 0 300 300">
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

            {/* 3D Book on Table - Top-Down Angle */}
            <motion.div
              className="relative z-10"
              style={{ perspective: '800px', perspectiveOrigin: '50% 30%', rotateX: smoothX, rotateY: combinedY }}
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
            >
              <motion.div
                className="relative"
                style={{
                  width: '200px',
                  height: '280px',
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(25deg) rotateZ(-5deg)',
                }}
                animate={{ 
                  rotateZ: [-5, -3, -5],
                  y: [0, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Book Cover */}
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: isDark 
                      ? 'linear-gradient(145deg, #E8570C, #C74809)' 
                      : 'linear-gradient(145deg, #E8570C, #FF6B1A)',
                    border: `2px solid ${isDark ? 'rgba(232, 87, 12, 0.5)' : 'rgba(232, 87, 12, 0.4)'}`,
                    boxShadow: isDark 
                      ? '0 20px 40px rgba(0, 0, 0, 0.7), 0 10px 20px rgba(232, 87, 12, 0.3)'
                      : '0 20px 50px rgba(0, 0, 0, 0.25), 0 10px 25px rgba(232, 87, 12, 0.4)',
                    transformStyle: 'preserve-3d',
                    transform: 'translateZ(8px)'
                  }}
                >
                  {/* Book Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity="0.8">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>

                  {/* Book Shine */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1/3 rounded-t-lg"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)',
                    }}
                  />
                </div>

                {/* Book Spine (Left Edge) */}
                <div
                  className="absolute top-0 left-0 bottom-0 w-3 rounded-l-lg"
                  style={{
                    background: isDark ? 'linear-gradient(to right, #9B3506, #C74809)' : 'linear-gradient(to right, #C74809, #E8570C)',
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'left',
                    transform: 'rotateY(-90deg) translateZ(-5px)',
                    boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.5)'
                  }}
                />

                {/* Book Pages (Right Edge) */}
                <div
                  className="absolute top-1 right-0 bottom-1 w-2"
                  style={{
                    background: isDark ? 'linear-gradient(to left, #F0EBE0, #D4C4A8)' : 'linear-gradient(to left, #FFFBF5, #F0EBE0)',
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'right',
                    transform: 'rotateY(90deg) translateZ(-5px)',
                    boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.3)'
                  }}
                />

                {/* Book Bottom (Thickness) */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-3 rounded-b-lg"
                  style={{
                    background: isDark ? '#9B3506' : '#C74809',
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'bottom',
                    transform: 'rotateX(90deg) translateZ(-5px)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.6)'
                  }}
                />
              </motion.div>

              {/* Table Shadow */}
              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                style={{
                  width: '250px',
                  height: '80px',
                  background: 'radial-gradient(ellipse, rgba(0,0,0,0.3), transparent 70%)',
                  filter: 'blur(15px)',
                  transform: 'translateY(140px) rotateX(90deg)',
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
