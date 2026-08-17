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
  const timelineRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const experiences = useMemo(() => [...resumeData.experience].sort((a, b) => b.year - a.year), [])
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  useEffect(() => {
    const section = containerRef.current
    const timelineElement = timelineRef.current
    const svgElement = svgRef.current
    const pathElement = pathRef.current
    if (!section || !timelineElement || !svgElement || !pathElement) return

    const isTouchViewport =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(max-width: 1023px)').matches

    // On small/touch screens, keep the timeline synced to viewport center.
    const timelineStart = isTouchViewport ? 'top center' : 'top center'
    const timelineEnd = isTouchViewport ? 'bottom center' : 'bottom center'
    const cardsStart = isTouchViewport ? 'top 74%' : 'top 60%'

    const setPathDash = () => {
      const pathLength = pathElement.getTotalLength()
      pathElement.setAttribute('stroke-dasharray', String(pathLength))
      pathElement.setAttribute('stroke-dashoffset', String(pathLength))
      return pathLength
    }

    const refreshScroll = () => ScrollTrigger.refresh()

    const imageElements = Array.from(section.querySelectorAll('img'))
    const imageLoadHandler = () => refreshScroll()

    let postLayoutRefreshFrameA: number | null = null
    let postLayoutRefreshFrameB: number | null = null

    imageElements.forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', imageLoadHandler, { once: true })
        img.addEventListener('error', imageLoadHandler, { once: true })
      }
    })

    let resizeObserver: ResizeObserver | null = null
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        refreshScroll()
      })
      resizeObserver.observe(section)
    }

    window.addEventListener('load', refreshScroll)

    // Cached assets can skip image/load callbacks; force a post-layout refresh cycle.
    postLayoutRefreshFrameA = requestAnimationFrame(() => {
      postLayoutRefreshFrameB = requestAnimationFrame(() => {
        refreshScroll()
      })
    })

    if ('fonts' in document) {
      ;(document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready
        .then(() => refreshScroll())
        .catch(() => {
          // Ignore font readiness errors; a regular refresh is already scheduled.
        })
    }

    // The listeners above each try to catch one specific cause of stale
    // trigger positions (images, fonts, resize) - in practice something
    // upstream (other sections' async content, a slow device, whatever)
    // still slips through inconsistently across devices/loads. Rather than
    // chase the exact cause, brute-force it: keep re-refreshing on a fixed
    // schedule for the first few seconds so it self-corrects regardless of
    // what was slow to settle.
    const safetyNetDelays = [300, 800, 1500, 3000]
    const safetyNetTimers = safetyNetDelays.map((delay) => window.setTimeout(refreshScroll, delay))

    const ctx = gsap.context(() => {
      if (isTouchViewport) {
        let pathLength = setPathDash()

        ScrollTrigger.create({
          trigger: timelineElement,
          start: timelineStart,
          end: timelineEnd,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            pathLength = setPathDash()
            pathElement.setAttribute('stroke-dashoffset', String(pathLength * (1 - self.progress)))
          },
          onUpdate: (self) => {
            pathElement.setAttribute('stroke-dashoffset', String(pathLength * (1 - self.progress)))
          },
        })
      } else {
        setPathDash()

        gsap.to(pathElement, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineElement,
            start: timelineStart,
            end: timelineEnd,
            scrub: true,
            invalidateOnRefresh: true,
            onRefresh: () => {
              setPathDash()
            },
          },
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
          trigger: section,
          start: cardsStart,
        }
      })
    }, section)

    return () => {
      window.removeEventListener('load', refreshScroll)
      safetyNetTimers.forEach((timer) => window.clearTimeout(timer))
      if (postLayoutRefreshFrameA !== null) {
        cancelAnimationFrame(postLayoutRefreshFrameA)
      }
      if (postLayoutRefreshFrameB !== null) {
        cancelAnimationFrame(postLayoutRefreshFrameB)
      }
      if (resizeObserver) resizeObserver.disconnect()
      ctx.revert()
    }
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

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Wavy Timeline Path SVG */}
          <svg
            ref={svgRef}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-8 pointer-events-none overflow-visible"
            viewBox="0 0 32 1080"
            preserveAspectRatio="none"
            style={{
              transform: 'translateX(-50%)',
              height: '100%',
            }}
          >
            {/* Smooth curved serpentine path */}
            <path
              ref={pathRef}
              className="timeline-path"
              d={`M 16 0 C 16 60, 0 60, 0 120 C 0 180, 16 180, 16 240 C 16 300, 0 300, 0 360 C 0 420, 16 420, 16 480 C 16 540, 0 540, 0 600 C 0 660, 16 660, 16 720 C 16 780, 0 780, 0 840 C 0 900, 16 900, 16 960 C 16 1020, 0 1020, 0 1080`}
              stroke={isDark ? 'white' : 'black'}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              style={{
                willChange: 'stroke-dashoffset',
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
                style={{ backgroundColor: 'var(--accent-primary)' }}
                whileHover={{ scale: 1.2, boxShadow: '0 0 20px rgba(var(--accent-primary-rgb), 0.5)' }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isDark ? 'var(--bg-primary)' : '#F5F0E8' }} />
              </motion.div>

              <div className="relative z-10">
                <ExperienceCard exp={exp} isDark={isDark} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
