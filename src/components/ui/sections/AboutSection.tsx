import { useRef, useEffect, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { User } from 'lucide-react'
import { useTheme } from '../../providers/ThemeProvider'
import { KeycapButton } from '../KeycapButton'
import { KeycapCharacter } from '../KeycapCharacter'

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
    { label: 'Years Coding', value: '2+' },
    { label: 'Projects Built', value: '30+' },
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
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #1FA971 0%, transparent 70%)' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="about-content">
            {/* Section Tag */}
            <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-medium mb-4" style={{ color: '#1FA971' }}>
              <User size={16} />
              About Me
            </span>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
              I build systems,
              <br />
              <span style={{ color: '#1FA971' }}>not just applications.</span>
            </h2>

            {/* Bio */}
            <div className="space-y-4 mb-8">
              <p className="text-lg leading-relaxed transition-colors duration-500" style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}>
                I'm a Software Engineer focused on backend engineering, machine learning, and real-time data systems. My work centers on designing scalable architectures that perform reliably under production-level load.
              </p>
              <p className="text-lg leading-relaxed transition-colors duration-500" style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}>
                Currently building production features at YES Securities (YES Bank) as a Full Stack Developer Intern, while completing my B.Tech in Computer Science &amp; Engineering at VIT. I also work on independent software projects, competitive engineering challenges, and UI/UX design.
              </p>
            </div>

            {/* Stats */}
            <div 
              className="stats-container grid grid-cols-3 gap-4 mb-8 py-8"
              style={{ borderTop: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.4)'}`, borderBottom: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.4)'}` }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="stat-item text-center">
                  <div className="text-3xl font-bold mb-2" style={{ color: '#1FA971' }}>{stat.value}</div>
                  <div className="text-xs uppercase tracking-widest transition-colors duration-500" style={{ color: isDark ? '#9B8B70' : '#9B8B70' }}>{stat.label}</div>
                </div>
              ))}
            </div>


            {/* CTA Button — top padding clears the bouncer above, bottom padding clears the hanger dangling below */}
            <div className="flex flex-wrap gap-5 pt-14 pb-16 md:pb-8">
              <div className="relative inline-flex">
                <KeycapButton href="#projects" label="View My Work" icon="→" tone="orange" size="wide" />
                <KeycapCharacter
                  variant="bouncer"
                  className="pointer-events-none absolute"
                  style={{ left: '50%', bottom: 'calc(100% - 8px)', transform: 'translateX(-50%)', zIndex: 5 }}
                />
              </div>
              <div className="relative inline-flex">
                <KeycapButton href="#contact" label="Let's Talk" icon="✉" tone="cream" size="wide" />
                <KeycapCharacter
                  variant="hanger"
                  className="pointer-events-none absolute"
                  style={{ left: '50%', top: 'calc(100% - 8px)', transform: 'translateX(-50%)', zIndex: 5 }}
                />
              </div>
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
              <circle cx="150" cy="150" r="60" fill="none" stroke="#1FA971" strokeWidth="2" opacity="0.7" />

              {/* Center Glow */}
              <motion.circle
                cx="150"
                cy="150"
                r="30"
                fill="#1FA971"
                opacity="0.15"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              <defs>
                <linearGradient id="gradWarm1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1FA971" />
                  <stop offset="100%" stopColor="#D4A574" />
                </linearGradient>
                <linearGradient id="gradWarm2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4A574" />
                  <stop offset="100%" stopColor="#1FA971" />
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
                }}
                initial={{ rotateX: 28, rotateY: -18, rotateZ: -5, y: 0 }}
                animate={{
                  rotateX: [28, 24, 28],
                  rotateY: [-18, -10, -18],
                  rotateZ: [-5, -3, -5],
                  y: [0, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Front Cover */}
                <div
                  className="absolute inset-0 rounded-r-lg"
                  style={{
                    background: isDark
                      ? 'linear-gradient(145deg, #1FA971, #15803D)'
                      : 'linear-gradient(145deg, #1FA971, #34D399)',
                    boxShadow: isDark
                      ? '0 20px 40px rgba(0,0,0,0.7), 0 10px 20px rgba(31, 169, 113,0.3)'
                      : '0 20px 50px rgba(0,0,0,0.25), 0 10px 25px rgba(31, 169, 113,0.4)',
                    transform: 'translateZ(24px)',
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity="0.8">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  <div
                    className="absolute top-0 left-0 right-0 h-1/3 rounded-t-lg"
                    style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.28), transparent)' }}
                  />
                </div>

                {/* Back Cover */}
                <div
                  className="absolute inset-0 rounded-r-lg"
                  style={{
                    background: isDark ? '#08331D' : '#0F6B3D',
                    transform: 'rotateY(180deg) translateZ(24px)',
                  }}
                />

                {/* Spine -left face, hinged at left edge, spans z 0→24 */}
                <div
                  className="absolute"
                  style={{
                    left: 0, top: 0,
                    width: '24px', height: '280px',
                    background: isDark
                      ? 'linear-gradient(to right, #052213, #0B4A2B)'
                      : 'linear-gradient(to right, #0B4A2B, #0F6B3D)',
                    transformOrigin: 'left center',
                    transform: 'rotateY(-90deg)',
                    boxShadow: 'inset -3px 0 6px rgba(0,0,0,0.5)',
                  }}
                />

                {/* Pages -right face, hinged at right edge, spans z 0→24 */}
                <div
                  className="absolute"
                  style={{
                    right: 0, top: 3,
                    width: '24px', height: '274px',
                    background: isDark
                      ? 'linear-gradient(to left, #F0EBE0, #DDD0BC)'
                      : 'linear-gradient(to left, #FFFBF5, #EEE5D5)',
                    transformOrigin: 'right center',
                    transform: 'rotateY(90deg)',
                  }}
                >
                  {[...Array(7)].map((_, i) => (
                    <div key={i} style={{
                      position: 'absolute', left: 3, right: 3,
                      height: '1px', top: `${10 + i * 36}px`,
                      background: 'rgba(0,0,0,0.09)',
                    }} />
                  ))}
                </div>

                {/* Top edge -hinged at top, spans z 0→24 */}
                <div
                  className="absolute"
                  style={{
                    top: 0, left: 0,
                    width: '200px', height: '24px',
                    background: isDark
                      ? 'linear-gradient(to bottom, #D4C4A8, #C0B090)'
                      : 'linear-gradient(to bottom, #F5EDD8, #EDE0C0)',
                    transformOrigin: 'center top',
                    transform: 'rotateX(90deg)',
                  }}
                >
                  {[...Array(5)].map((_, i) => (
                    <div key={i} style={{
                      position: 'absolute', top: 0, bottom: 0,
                      left: `${24 + i * 34}px`, width: '1px',
                      background: 'rgba(0,0,0,0.07)',
                    }} />
                  ))}
                </div>

                {/* Bottom edge -hinged at bottom, spans z 0→24 */}
                <div
                  className="absolute"
                  style={{
                    bottom: 0, left: 0,
                    width: '200px', height: '24px',
                    background: isDark ? '#0A3A20' : '#0B4A2B',
                    transformOrigin: 'center bottom',
                    transform: 'rotateX(-90deg)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.7)',
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
