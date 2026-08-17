import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { resumeData } from '../../../lib/resume-data'
import { Briefcase, Calendar, MapPin, Sparkles } from 'lucide-react'
import { useTheme } from '../../providers/ThemeProvider'

gsap.registerPlugin(ScrollTrigger)

type Experience = (typeof resumeData.experience)[number]

// Front card (company/title/period) sits on top of the achievements panel
// at rest. Engaging the card — hover on desktop, tap on touch — slides the
// front card down and rotates it away like a note peeling off a photo,
// revealing the highlights underneath instead of a plain 3D flip.
const ExperienceCard = ({ exp, isDark }: { exp: Experience; isDark: boolean }) => {
  const [revealed, setRevealed] = useState(false)

  return (
    <div
      className="relative rounded-xl"
      style={{ minHeight: 196, overflow: 'hidden' }}
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => setRevealed(false)}
      onClick={() => setRevealed((r) => !r)}
    >
      {/* Back: achievements panel, always present underneath */}
      <div
        className="absolute inset-0 p-6 rounded-xl overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid rgba(var(--accent-primary-rgb), 0.3)',
        }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--accent-primary)' }}>
          {exp.company} highlights
        </p>
        <ul className="space-y-2.5">
          {exp.achievements.map((achievement, i) => (
            <li
              key={i}
              className="text-sm flex gap-3 leading-relaxed"
              style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}
            >
              <span className="flex-shrink-0 mt-1" style={{ color: 'var(--accent-primary)' }}>▸</span>
              <span>{achievement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Front: slides fully clear of the box on reveal (not a partial
          overlap - the card is wide, so even a small rotation would sweep
          its corners across the achievements text otherwise).
          backgroundColor is a plain CSS transition (not the animate prop)
          since framer-motion can't interpolate between two var(...) color
          references. */}
      <motion.div
        className="absolute inset-0 p-6 rounded-xl shadow-lg cursor-pointer"
        animate={{ y: revealed ? '108%' : 0, rotate: revealed ? 3 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        style={{
          transformOrigin: 'center',
          backgroundColor: revealed ? 'var(--accent-primary)' : 'var(--bg-card)',
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
          border: `1px solid ${revealed ? 'transparent' : 'rgba(var(--accent-primary-rgb), 0.25)'}`,
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
          <div className="flex gap-3 items-start flex-1">
            {exp.logo && (
              <div
                className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center p-2"
                style={{ backgroundColor: '#2A2420' }}
              >
                <img
                  src={exp.logo}
                  alt={exp.company}
                  className="w-full h-full object-contain"
                  decoding="async"
                />
              </div>
            )}
            <div>
              <h3
                className="font-display font-bold text-xl transition-colors duration-200"
                style={{ color: revealed ? '#F5F0E8' : isDark ? '#F0EBE0' : '#1A1208' }}
              >
                {exp.company}
              </h3>
              <p className="font-medium transition-colors duration-200" style={{ color: revealed ? '#F5F0E8' : 'var(--accent-primary)' }}>
                {exp.title}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span
              className="flex items-center gap-1 text-xs font-medium transition-colors duration-200"
              style={{ color: revealed ? 'rgba(245, 240, 232, 0.85)' : isDark ? '#D4C4A8' : '#4A3C2A' }}
            >
              <Calendar size={12} />
              {exp.period}
            </span>
            <span
              className="flex items-center gap-1 text-xs transition-colors duration-200"
              style={{ color: revealed ? 'rgba(245, 240, 232, 0.7)' : '#9B8B70' }}
            >
              <MapPin size={12} />
              {exp.location}
            </span>
          </div>
        </div>

        <div
          className="flex items-center gap-1.5 text-xs font-medium mt-8 transition-colors duration-200"
          style={{ color: revealed ? 'rgba(245, 240, 232, 0.8)' : 'var(--accent-primary)', opacity: revealed ? 1 : 0.75 }}
        >
          <Sparkles size={12} />
          Hover to see highlights
        </div>
      </motion.div>
    </div>
  )
}

export const ExperienceSection = () => {
  const containerRef = useRef<HTMLElement>(null)
  const graphRef = useRef<HTMLDivElement>(null)
  const graphFillRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])
  // Oldest first, so the line reads left -> right as a career progression.
  const experiences = useMemo(() => [...resumeData.experience].sort((a, b) => a.year - b.year), [])
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  // The vertical wavy line used GSAP ScrollTrigger's cached trigger
  // positions, which needed refreshing whenever layout changed elsewhere on
  // the page - that's what made it inconsistent (fine on some loads/devices,
  // broken on others, until something forced a recalculation). This graph
  // line instead recomputes progress from a fresh getBoundingClientRect() on
  // every scroll frame, so there's nothing to cache and nothing to go stale.
  useEffect(() => {
    const track = graphRef.current
    const fill = graphFillRef.current
    if (!track || !fill) return

    let frame: number | null = null

    const update = () => {
      frame = null
      const rect = track.getBoundingClientRect()
      const viewportH = window.innerHeight
      const startLine = viewportH * 0.85
      const endLine = viewportH * 0.35
      const total = rect.height + (startLine - endLine)
      const scrolled = startLine - rect.top
      const progress = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0

      fill.style.transform = `scaleX(${progress})`

      nodeRefs.current.forEach((node, i) => {
        if (!node) return
        const nodeProgress = experiences.length > 1 ? i / (experiences.length - 1) : 0
        const active = progress >= nodeProgress - 0.02
        node.style.backgroundColor = active ? 'var(--accent-primary)' : 'var(--bg-card)'
        node.style.transform = active ? 'scale(1.15)' : 'scale(1)'
      })
    }

    const onScrollOrResize = () => {
      if (frame === null) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [experiences.length])

  useEffect(() => {
    if (!containerRef.current) return

    const isTouchViewport =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(max-width: 1023px)').matches
    const cardsStart = isTouchViewport ? 'top 74%' : 'top 60%'

    const ctx = gsap.context(() => {
      gsap.from('.exp-card', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: cardsStart,
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
      style={{
        backgroundColor: isDark ? 'var(--bg-primary)' : '#F5F0E8',
      }}
    >
      {/* Decorative Background */}
      <div className="absolute top-20 right-10 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)' }} />
      <div className="absolute bottom-20 left-10 w-60 h-60 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #D4A574 0%, transparent 70%)' }} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-medium mb-4" style={{ color: 'var(--accent-primary)' }}>
            <Briefcase size={16} />
            Experience
          </span>
          <h2 className="font-brush text-4xl md:text-5xl transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
            Career Journey
          </h2>
        </div>

        {/* Horizontal progress graph - fills left to right as the section scrolls by */}
        <div ref={graphRef} className="relative mb-16 px-4 hidden sm:block">
          <div className="relative h-1 rounded-full" style={{ background: 'rgba(var(--accent-primary-rgb), 0.15)' }}>
            <div
              ref={graphFillRef}
              className="absolute inset-0 rounded-full"
              style={{ background: 'var(--accent-primary)', transformOrigin: 'left', transform: 'scaleX(0)' }}
            />
          </div>
          <div className="flex justify-between -mt-[7px]">
            {experiences.map((exp, i) => (
              <div key={exp.company} className="flex flex-col items-center" style={{ width: 120 }}>
                <div
                  ref={(node) => { nodeRefs.current[i] = node }}
                  className="w-4 h-4 rounded-full border-2 transition-transform duration-200"
                  style={{ borderColor: 'var(--accent-primary)', backgroundColor: 'var(--bg-card)' }}
                />
                <span
                  className="mt-2 text-[11px] font-medium uppercase tracking-wide text-center transition-colors duration-500"
                  style={{ color: isDark ? '#9B8B70' : '#4A3C2A' }}
                >
                  {exp.company}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Items */}
        <div className="space-y-8 max-w-3xl mx-auto">
          {experiences.map((exp) => (
            <div key={exp.company} className="exp-card relative">
              <ExperienceCard exp={exp} isDark={isDark} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
