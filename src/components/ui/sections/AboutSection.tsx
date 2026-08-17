import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { User } from 'lucide-react'
import { useTheme } from '../../providers/ThemeProvider'
import { KeycapButton } from '../KeycapButton'
import { KeycapCharacter } from '../KeycapCharacter'
import { AboutBook } from '../AboutBook'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { label: 'Years Coding', value: '2+' },
  { label: 'Projects Built', value: '30+' },
  { label: 'Teams Led', value: '3' },
]

export const AboutSection = () => {
  const containerRef = useRef<HTMLElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.about-content', {
        y: 40,
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

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Tag */}
        <div className="about-content text-center mb-14">
          <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--accent-primary)' }}>
            <User size={16} />
            About Me
          </span>
        </div>

        {/* Three books - hover/tap each to open it */}
        <div className="about-visual flex flex-wrap items-start justify-center gap-6 md:gap-8 mb-14">
          <AboutBook
            image="/kunal-photo.jpg"
            imageAlt="Kunal Mathur"
            coverLabel="Kunal Mathur"
            coverTitle="Software Engineer"
            pageLabel="Say Hello"
          >
            <h4 className="font-display" style={{ fontSize: 16, lineHeight: 1.2, color: '#1A1208', margin: 0 }}>
              I build systems,
              <br />
              <span style={{ color: '#BF5B3D' }}>not just applications.</span>
            </h4>
            <p style={{ fontSize: 12, lineHeight: 1.55, color: '#4A3C2A', margin: 0 }}>
              Currently building production features at YES Securities (YES Bank) as a Full Stack Developer Intern, while completing my B.Tech in Computer Science &amp; Engineering at VIT.
            </p>
          </AboutBook>

          <AboutBook
            coverLabel="Chapter One"
            coverTitle="By The Numbers"
            coverSubtitle="Snapshot"
            pageLabel="At A Glance"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.map((stat) => (
                <div key={stat.label} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: '#BF5B3D' }}>{stat.value}</span>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8A7860' }}>{stat.label}</span>
                </div>
              ))}
            </div>
          </AboutBook>

          <AboutBook
            coverLabel="Chapter Two"
            coverTitle="The Work"
            coverSubtitle="Bio"
            pageLabel="About Kunal"
          >
            <p style={{ fontSize: 13, lineHeight: 1.65, color: '#4A3C2A', margin: 0 }}>
              I'm a Software Engineer focused on backend engineering, machine learning, and real-time data systems. My work centers on designing scalable architectures that perform reliably under production-level load.
            </p>
          </AboutBook>
        </div>

        {/* CTA Button — top padding clears the bouncer above, bottom padding clears the hanger dangling below */}
        <div className="about-content flex flex-wrap gap-5 justify-center pt-14 pb-8">
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
    </section>
  )
}
