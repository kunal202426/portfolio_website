import { useRef, useEffect, useState, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { resumeData } from '../../../lib/resume-data'
import { useTheme } from '../../providers/ThemeProvider'
import { InteractiveRobotSpline } from '../interactive-3d-robot'

gsap.registerPlugin(ScrollTrigger)

const ROBOT_SCENE_URL = 'https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode'

const getLaptopSize = (width: number) => {
  if (width >= 1024) {
    return {
      width: 500,
      height: 320,
      keyboardHeight: 160,
      iconSize: 32,
      iconBoxSize: 32,
      gap: 20,
      padding: 16,
    }
  }

  if (width >= 768) {
    return {
      width: 400,
      height: 256,
      keyboardHeight: 128,
      iconSize: 28,
      iconBoxSize: 28,
      gap: 16,
      padding: 12,
    }
  }

  if (width >= 640) {
    return {
      width: 320,
      height: 204,
      keyboardHeight: 102,
      iconSize: 24,
      iconBoxSize: 24,
      gap: 12,
      padding: 10,
    }
  }

  return {
    width: 280,
    height: 179,
    keyboardHeight: 90,
    iconSize: 20,
    iconBoxSize: 20,
    gap: 8,
    padding: 8,
  }
}

/**
 * 3D Laptop Contact Section
 * Interactive laptop with GitHub and LinkedIn icons
 */
export const ContactSection = () => {
  const containerRef = useRef<HTMLElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const smoothTiltX = useSpring(tiltX, { stiffness: 220, damping: 24, mass: 0.4 })
  const smoothTiltY = useSpring(tiltY, { stiffness: 220, damping: 24, mass: 0.4 })
  const [showRobotPanel, setShowRobotPanel] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 768 : true))

  // Responsive laptop dimensions
  const [laptopSize, setLaptopSize] = useState(() => getLaptopSize(typeof window !== 'undefined' ? window.innerWidth : 1024))

  useEffect(() => {
    const updateLaptopSize = () => {
      const width = window.innerWidth
      const nextShowRobotPanel = width >= 768
      const nextLaptopSize = getLaptopSize(width)

      setShowRobotPanel((prev) => (prev === nextShowRobotPanel ? prev : nextShowRobotPanel))
      setLaptopSize((prev) => (prev.width === nextLaptopSize.width ? prev : nextLaptopSize))
    }

    let resizeRaf: number | null = null
    const handleResize = () => {
      if (resizeRaf !== null) {
        cancelAnimationFrame(resizeRaf)
      }
      resizeRaf = requestAnimationFrame(updateLaptopSize)
    }

    updateLaptopSize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeRaf !== null) {
        cancelAnimationFrame(resizeRaf)
      }
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.contact-heading', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%'
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleLaptopMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const pointerX = (event.clientX - rect.left) / rect.width - 0.5
    const pointerY = (event.clientY - rect.top) / rect.height - 0.5
    tiltX.set(-pointerY * 8)
    tiltY.set(pointerX * 10)
  }

  const resetLaptopTilt = () => {
    tiltX.set(0)
    tiltY.set(0)
  }

  return (
    <section 
      ref={containerRef}
      id="contact" 
      className="relative py-24 px-6 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: isDark ? '#0E0E0B' : '#1A1208' }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #E8570C 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #D4A574 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 contact-heading">
          <span className="text-sm uppercase tracking-[0.2em] font-medium mb-4 block" style={{ color: '#E8570C' }}>
            Let's Connect
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6" style={{ color: '#F5F0E8' }}>
            Get in Touch
          </h2>
          <p className="text-lg max-w-xl mx-auto mb-4" style={{ color: '#D4C4A8' }}>
            Feel free to reach out through GitHub or LinkedIn
          </p>
          <div className="flex items-center justify-center gap-3 text-sm">
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#22C55E' }} />
            <span style={{ color: '#D4C4A8' }}>Available for new opportunities</span>
          </div>
        </div>

        {/* Laptop Row with left-side animation slot */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-14">
          {showRobotPanel && (
            <div className="min-h-[340px] lg:min-h-[420px]">
              <div
                className="relative h-full min-h-[340px] lg:min-h-[420px] rounded-2xl overflow-hidden border will-change-transform"
                style={{
                  borderColor: isDark ? 'rgba(212, 165, 116, 0.22)' : 'rgba(212, 165, 116, 0.32)',
                  background: isDark ? 'linear-gradient(145deg, #19140F, #0E0E0B)' : 'linear-gradient(145deg, #2A2520, #1A1208)',
                }}
              >
                <InteractiveRobotSpline scene={ROBOT_SCENE_URL} className="absolute inset-0 z-0 transform-gpu" />
                <div
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.28) 100%)' }}
                />
              </div>
            </div>
          )}

          {/* 3D Laptop - Right Side */}
          <motion.div
            className="laptop-container flex justify-center md:justify-end items-center"
            style={{ perspective: '2000px', perspectiveOrigin: '50% 50%', rotateX: smoothTiltX, rotateY: smoothTiltY }}
            onMouseMove={handleLaptopMove}
            onMouseLeave={resetLaptopTilt}
            initial={{ opacity: 0, y: 42, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
          >
          <motion.div
            className="relative"
            style={{
              width: `${laptopSize.width}px`,
              transformStyle: 'preserve-3d',
            }}
            animate={{ 
              rotateX: [10, 8, 10],
              rotateY: [0, 2, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Laptop Screen */}
            <div
              className="relative overflow-hidden"
              style={{
                width: `${laptopSize.width}px`,
                height: `${laptopSize.height}px`,
                background: isDark 
                  ? 'linear-gradient(145deg, #1A1510, #0E0E0B)' 
                  : 'linear-gradient(145deg, #2A2520, #1A1510)',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                border: `3px solid ${isDark ? 'rgba(60, 50, 40, 0.5)' : 'rgba(60, 50, 40, 0.6)'}`,
                borderBottom: 'none',
                boxShadow: isDark 
                  ? '0 -5px 20px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(232, 87, 12, 0.05)'
                  : '0 -5px 30px rgba(0, 0, 0, 0.6), inset 0 0 40px rgba(232, 87, 12, 0.08)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Screen Bezel */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  border: `12px solid ${isDark ? '#0A0A08' : '#0E0E0B'}`,
                  borderRadius: '12px',
                }}
              />

              {/* Screen reflection sweep */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(115deg, transparent 20%, rgba(255,220,180,0.07) 40%, rgba(255,255,255,0.13) 50%, rgba(255,220,180,0.07) 60%, transparent 80%)',
                  zIndex: 1,
                  borderRadius: '12px',
                }}
                animate={{ x: ['-110%', '110%'] }}
                transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
              />

              {/* Ambient color pulse */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 30% 50%, rgba(232,87,12,0.08) 0%, transparent 65%)',
                  zIndex: 1,
                  borderRadius: '12px',
                }}
                animate={{ opacity: [0.4, 1, 0.4], x: ['-10%', '10%', '-10%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Screen Content - Icons */}
              <div
                className="absolute inset-0 flex items-center justify-center p-4"
                style={{
                  gap: `${laptopSize.gap}px`,
                  padding: `${laptopSize.padding}px`,
                  zIndex: 2,
                }}
              >
                {/* GitHub Icon */}
                <motion.a
                  href={resumeData.personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-4 group cursor-pointer"
                  whileHover={{ scale: 1.15, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className="rounded-3xl flex items-center justify-center transition-all duration-300"
                    style={{
                      width: `${laptopSize.iconBoxSize * 4}px`,
                      height: `${laptopSize.iconBoxSize * 4}px`,
                      background: isDark
                        ? 'linear-gradient(145deg, #1F1A15, #141410)'
                        : 'linear-gradient(145deg, #2F2A25, #1F1A15)',
                      boxShadow: isDark
                        ? '8px 8px 16px rgba(0, 0, 0, 0.6), -4px -4px 12px rgba(40, 35, 30, 0.3)'
                        : '8px 8px 20px rgba(0, 0, 0, 0.7), -4px -4px 16px rgba(50, 45, 40, 0.4)',
                    }}
                  >
                    <svg width={laptopSize.iconSize * 1.75} height={laptopSize.iconSize * 1.75} viewBox="0 0 24 24" fill="#F5F0E8">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <span className="text-lg font-medium transition-colors duration-300" style={{ color: '#D4C4A8' }}>
                    GitHub
                  </span>
                </motion.a>

                {/* LinkedIn Icon */}
                <motion.a
                  href={resumeData.personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-4 group cursor-pointer"
                  whileHover={{ scale: 1.15, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className="rounded-3xl flex items-center justify-center transition-all duration-300"
                    style={{
                      width: `${laptopSize.iconBoxSize * 4}px`,
                      height: `${laptopSize.iconBoxSize * 4}px`,
                      background: 'linear-gradient(145deg, #E8570C, #C74809)',
                      boxShadow: isDark
                        ? '8px 8px 16px rgba(0, 0, 0, 0.6), -4px -4px 12px rgba(232, 87, 12, 0.4), 0 0 30px rgba(232, 87, 12, 0.3)'
                        : '8px 8px 20px rgba(0, 0, 0, 0.7), -4px -4px 16px rgba(255, 107, 26, 0.5), 0 0 30px rgba(232, 87, 12, 0.4)',
                    }}
                  >
                    <svg width={laptopSize.iconSize * 1.75} height={laptopSize.iconSize * 1.75} viewBox="0 0 24 24" fill="#F5F0E8">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <span className="text-lg font-medium transition-colors duration-300" style={{ color: '#F0EBE0' }}>
                    LinkedIn
                  </span>
                </motion.a>
              </div>

              {/* Screen Glare */}
              <div
                className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)',
                  borderRadius: '12px 12px 0 0',
                }}
              />
            </div>

            {/* Laptop Base/Keyboard */}
            <div
              className="relative overflow-hidden"
              style={{
                width: `${laptopSize.width}px`,
                height: `${laptopSize.keyboardHeight}px`,
                background: isDark 
                  ? '#1A1510' 
                  : '#2A2520',
                borderBottomLeftRadius: '12px',
                borderBottomRightRadius: '12px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
                transformStyle: 'preserve-3d',
                transformOrigin: 'top center',
                transform: 'rotateX(-50deg)',
              }}
            >
              {/* Keyboard Keys Grid */}
              <div 
                className="grid grid-cols-12"
                style={{
                  padding: `${laptopSize.padding / 2}px`,
                  gap: `${Math.max(1, laptopSize.padding / 8)}px`
                }}
              >
                {/* Row 1 - Function keys */}
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={`fkey-${i}`}
                    className="rounded"
                    style={{
                      height: `${Math.max(12, laptopSize.keyboardHeight / 8)}px`,
                      background: isDark ? 'rgba(14, 14, 11, 0.6)' : 'rgba(10, 10, 8, 0.7)',
                      border: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.15)' : 'rgba(212, 165, 116, 0.2)'}`,
                    }}
                  />
                ))}
                
                {/* Row 2 - Number keys */}
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={`numkey-${i}`}
                    className="rounded"
                    style={{
                      height: `${Math.max(12, laptopSize.keyboardHeight / 8)}px`,
                      background: isDark ? 'rgba(14, 14, 11, 0.6)' : 'rgba(10, 10, 8, 0.7)',
                      border: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.15)' : 'rgba(212, 165, 116, 0.2)'}`,
                    }}
                  />
                ))}
                
                {/* Row 3 - QWERTY row */}
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={`qkey-${i}`}
                    className="rounded"
                    style={{
                      height: `${Math.max(12, laptopSize.keyboardHeight / 8)}px`,
                      background: isDark ? 'rgba(14, 14, 11, 0.6)' : 'rgba(10, 10, 8, 0.7)',
                      border: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.15)' : 'rgba(212, 165, 116, 0.2)'}`,
                    }}
                  />
                ))}
                
                {/* Row 4 - ASDF row */}
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={`akey-${i}`}
                    className="rounded"
                    style={{
                      height: `${Math.max(12, laptopSize.keyboardHeight / 8)}px`,
                      background: isDark ? 'rgba(14, 14, 11, 0.6)' : 'rgba(10, 10, 8, 0.7)',
                      border: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.15)' : 'rgba(212, 165, 116, 0.2)'}`,
                    }}
                  />
                ))}
              </div>

              {/* Trackpad */}
              <div 
                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 rounded-lg"
                style={{
                  width: `${laptopSize.width * 0.24}px`,
                  height: `${laptopSize.keyboardHeight * 0.25}px`,
                  background: isDark ? 'rgba(14, 14, 11, 0.5)' : 'rgba(10, 10, 8, 0.6)',
                  border: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.15)' : 'rgba(212, 165, 116, 0.2)'}`,
                }}
              />
            </div>
          </motion.div>
        </motion.div>
        </div>

        {/* Contact Info - Below Laptop */}
        <div className="max-w-3xl mx-auto mb-16 md:mb-20">
          <h3 className="font-display text-xl md:text-2xl font-bold mb-5 md:mb-7 text-center" style={{ color: '#F5F0E8' }}>
            Contact Information
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
            <motion.a
              href={`mailto:${resumeData.personal.email}`}
              className="flex items-center gap-4 p-4 rounded-xl transition-all group"
              style={{ backgroundColor: 'rgba(245, 240, 232, 0.05)' }}
              whileHover={{ y: -4, backgroundColor: 'rgba(232, 87, 12, 0.1)' }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8570C' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm" style={{ color: '#9B8B70' }}>Email</p>
                <p className="font-medium break-all" style={{ color: '#F5F0E8' }}>{resumeData.personal.email}</p>
              </div>
            </motion.a>

            <motion.a
              href={`tel:${resumeData.personal.phone}`}
              className="flex items-center gap-4 p-4 rounded-xl transition-all group"
              style={{ backgroundColor: 'rgba(245, 240, 232, 0.05)' }}
              whileHover={{ y: -4, backgroundColor: 'rgba(232, 87, 12, 0.1)' }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D4A574' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1208" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <p className="text-sm" style={{ color: '#9B8B70' }}>Phone</p>
                <p className="font-medium" style={{ color: '#F5F0E8' }}>{resumeData.personal.phone}</p>
              </div>
            </motion.a>

            <div className="sm:col-span-2 flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(245, 240, 232, 0.05)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(245, 240, 232, 0.1)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="text-sm" style={{ color: '#9B8B70' }}>Location</p>
                <p className="font-medium" style={{ color: '#F5F0E8' }}>India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t text-center" style={{ borderColor: 'rgba(245, 240, 232, 0.1)' }}>
          <p className="text-sm" style={{ color: '#9B8B70' }}>
            © {new Date().getFullYear()} Kunal Mathur. Crafted with attention to detail.
          </p>
        </div>
      </div>
    </section>
  )
}
