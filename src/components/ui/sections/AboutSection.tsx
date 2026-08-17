import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { User } from 'lucide-react'
import { useTheme } from '../../providers/ThemeProvider'
import { KeycapButton } from '../KeycapButton'
import { KeycapCharacter } from '../KeycapCharacter'
import { AboutBook } from '../AboutBook'

gsap.registerPlugin(ScrollTrigger)

export const AboutSection = () => {
  const containerRef = useRef<HTMLElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

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

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative w-full py-24 px-6 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: isDark ? 'var(--bg-primary)' : '#F5F0E8' }}
    >
      {/* Decorative */}
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="about-content">
            {/* Section Tag */}
            <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-medium mb-4" style={{ color: 'var(--accent-primary)' }}>
              <User size={16} />
              About Me
            </span>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
              I build systems,
              <br />
              <span style={{ color: 'var(--accent-primary)' }}>not just applications.</span>
            </h2>

            {/* Stats */}
            <div
              className="stats-container grid grid-cols-3 gap-4 mb-8 py-8"
              style={{ borderTop: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.4)'}`, borderBottom: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.4)'}` }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="stat-item text-center">
                  <div className="text-3xl font-bold mb-2" style={{ color: 'var(--accent-primary)' }}>{stat.value}</div>
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

          {/* Right Column - Book (hover/tap opens to reveal the bio) */}
          <div className="about-visual flex items-center justify-center">
            <AboutBook />
          </div>
        </div>
      </div>
    </section>
  )
}
