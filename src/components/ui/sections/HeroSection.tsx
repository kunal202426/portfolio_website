import { useRef, useEffect } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { resumeData } from '../../../lib/resume-data'
import { useTheme } from '../../providers/ThemeProvider'

// Import parallax mountain layers
import mountainFront from '../../../assets/gemini.png'
import mountainMiddle from '../../../assets/gemini1.png'
import mountainBack from '../../../assets/gemini2.png'

gsap.registerPlugin(ScrollTrigger)

/**
 * Cinematic Hero Section with Mountain Parallax
 * Text scrolls behind layered mountains for depth effect
 */
export const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const heroScrollRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'
  
  // Parallax scroll transforms
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Smooth raw scroll progress to reduce micro-jitter on heavy hero layers.
  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.28,
  })
  
  // Text moves downward faster so the parallax read is stronger.
  const textY = useTransform(smoothScrollYProgress, [0, 0.34], [0, 300])
  const textOpacity = useTransform(smoothScrollYProgress, [0, 0.34], [1, 0])
  
  // Keep front mountain anchored to avoid exposing a bottom frame gap.
  const backY = useTransform(smoothScrollYProgress, [0, 0.85], [0, -140])
  const middleY = useTransform(smoothScrollYProgress, [0, 0.85], [0, -60])
  const frontY = useTransform(smoothScrollYProgress, [0, 1], [0, 0])

  useEffect(() => {
    if (!contentRef.current) return

    const ctx = gsap.context(() => {
      const scrollIndicator = heroScrollRef.current
      const tl = gsap.timeline({ delay: 0.8 })

      // Hero name slides in as a solid block from left
      tl.from('.hero-name', {
        x: -150,
        opacity: 0,
        duration: 1.4,
        ease: "power4.out"
      })
      .from('.hero-word', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: "power3.out"
      }, "-=0.3")
      .from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4")

      if (scrollIndicator) {
        tl.from(scrollIndicator, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        }, '-=0.3')

        gsap.to(scrollIndicator, {
          y: 10,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
        })
      }
    }, contentRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={containerRef}
      id="home" 
      className="relative w-full h-[150vh]"
    >
      {/* Fixed viewport container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* Layer 0: Sky gradient background */}
        <div 
          className="absolute inset-0 -z-10"
          style={{
            background: isDark 
              ? 'linear-gradient(to bottom, #0a0a15 0%, #1a1525 40%, #2d1f3d 70%, #4a2c4a 100%)'
              : 'linear-gradient(to bottom, #87CEEB 0%, #B0C4DE 50%, #DDA0DD 100%)'
          }}
        />

        {/* Layer 5: Back Mountain (gemini2.png - faster upward for relative depth) */}
        <motion.img 
          src={mountainBack} 
          alt="" 
          className="absolute left-0 w-full h-auto pointer-events-none"
          style={{ 
            bottom: '-34%',
            y: backY,
            willChange: 'transform',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            zIndex: 1,
            objectFit: 'cover',
            objectPosition: 'bottom',
            minHeight: '130%'
          }}
        />

        {/* Layer 4: Middle Mountain (gemini1.png - behind text) */}
        <motion.img 
          src={mountainMiddle} 
          alt="" 
          className="absolute left-0 w-full h-auto pointer-events-none"
          style={{ 
            bottom: '-20%',
            y: middleY, 
            willChange: 'transform',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            zIndex: 2,
            objectFit: 'cover',
            objectPosition: 'bottom',
            minHeight: '110%'
          }}
        />

        {/* Layer 3: TEXT CONTENT - Behind front mountain, above middle mountain */}
        <motion.div 
          ref={contentRef}
          className="absolute inset-0 flex items-center justify-center px-6"
          style={{ 
            y: textY, 
            opacity: textOpacity,
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            zIndex: 3,
            paddingBottom: '12rem'
          }}
        >
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="hero-name font-brush mb-8 leading-[0.95]" style={{ fontSize: 'clamp(2.5rem, 10vw, 7.5rem)', color: '#F0EBE0', fontWeight: 400 }}>
              {resumeData.personal.name.split(' ').map((word, i) => (
                <div key={i} className="block overflow-hidden">
                  <span className="name-word block">
                    {i === 1 ? <span style={{ color: 'var(--accent-primary)' }}>{word}</span> : word}
                  </span>
                </div>
              ))}
            </h1>

            <div className="overflow-hidden mb-6">
              <p className="hero-word text-xl md:text-2xl lg:text-3xl font-light" style={{ color: '#D4C4A8' }}>
                Software Engineer & ML Engineer
              </p>
            </div>

            {/* Real subtitle is invisible here - painted instead in the
                duplicate layer below, in front of the mountain. This one
                only exists so the flex-centered block above it keeps the
                same height/spacing (h1 + tagline still render for real). */}
            <p className="hero-subtitle text-sm md:text-lg max-w-2xl mx-auto whitespace-normal md:whitespace-nowrap leading-snug" style={{ opacity: 0 }} aria-hidden="true">
              Scalable backend systems, ML pipelines, and real-time applications.
            </p>
          </div>
        </motion.div>

        {/* Layer 3b: Subtitle only, duplicated in front of the mountain -
            the front mountain's jagged silhouette was cutting straight
            through specific words when this line lived in the z-3 layer
            above (deliberately behind the mountain, same as the name and
            tagline). Everything above this <p> is an invisible spacer with
            the exact same markup, so this stays pixel-aligned with where
            the real line would have sat, without hardcoding an offset. */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none"
          style={{
            y: textY,
            opacity: textOpacity,
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            zIndex: 5,
            paddingBottom: '12rem',
          }}
        >
          <div className="text-center max-w-5xl mx-auto">
            {/* Not a heading tag - this is a layout spacer only (to keep the
                real subtitle below pixel-aligned with where it'd sit inside
                the actual h1's block), and a duplicate hidden <h1> would
                still be visible to crawlers reading the DOM even though
                CSS hides it from the screen. */}
            <div className="font-brush mb-8 leading-[0.95] invisible" style={{ fontSize: 'clamp(2.5rem, 10vw, 7.5rem)', fontWeight: 400 }} aria-hidden="true">
              {resumeData.personal.name.split(' ').map((word, i) => (
                <div key={i} className="block">
                  {word}
                </div>
              ))}
            </div>
            <div className="overflow-hidden mb-6">
              <p className="text-xl md:text-2xl lg:text-3xl font-light invisible" aria-hidden="true">
                Software Engineer & ML Engineer
              </p>
            </div>
            <p
              className="text-sm md:text-lg max-w-2xl mx-auto whitespace-normal md:whitespace-nowrap leading-snug"
              style={{ color: '#FFFFFF', textShadow: '0 2px 14px rgba(0, 0, 0, 0.65), 0 1px 4px rgba(0, 0, 0, 0.85)' }}
            >
              Scalable backend systems, ML pipelines, and real-time applications.
            </p>
          </div>
        </motion.div>

        {/* Layer 2: Front Mountain (gemini.png - 0th image, aage wala mountain) */}
        <motion.img 
          src={mountainFront} 
          alt="" 
          className="absolute bottom-0 left-0 w-full h-auto pointer-events-none"
          style={{ 
            y: frontY, 
            willChange: 'transform',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            zIndex: 4,
            objectFit: 'cover',
            objectPosition: 'bottom',
            minHeight: '100%'
          }}
        />

        {/* Layer 1: Buttons - Stay visible on top, above everything */}
        <div className="absolute bottom-32 left-0 right-0 flex justify-center px-6" style={{ zIndex: 10 }}>
          <div className="hero-subtitle flex flex-wrap gap-4 justify-center">
            <a 
              href="#projects"
              className="px-8 py-3 rounded-full font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              View Projects
            </a>
            <a 
              href="#contact"
              className="px-8 py-3 rounded-full font-medium border-2 transition-all duration-300 hover:scale-105"
              style={{ borderColor: '#F0EBE0', color: '#F0EBE0' }}
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Layer 1.5: Technical spec-label accents (retro-industrial motif) */}
        <div className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2" style={{ zIndex: 8 }}>
          <span className="relative flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0" style={{ border: `1px dotted ${isDark ? 'rgba(240,235,224,0.5)' : 'rgba(255,255,255,0.6)'}` }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }} />
          </span>
          <span className="spec-label" style={{ color: isDark ? '#F0EBE0' : '#FFFFFF', opacity: 0.55 }}>
            Engineer&nbsp;— No.&nbsp;01
          </span>
        </div>

        <div className="absolute top-6 right-6 md:top-10 md:right-10 text-right" style={{ zIndex: 8 }}>
          <span className="spec-label" style={{ color: isDark ? '#F0EBE0' : '#FFFFFF', opacity: 0.55 }}>
            Portfolio&nbsp;/ Rev.&nbsp;2026
          </span>
        </div>

        <div
          className="hidden md:flex absolute left-10 items-center gap-3 pointer-events-none"
          style={{ zIndex: 8, top: '38%' }}
        >
          <span className="spec-label" style={{ color: isDark ? '#F0EBE0' : '#FFFFFF', opacity: 0.45, writingMode: 'vertical-rl' }}>
            Full-Stack&nbsp;/ ML
          </span>
          <span className="block w-px h-16" style={{ backgroundColor: isDark ? 'rgba(240,235,224,0.35)' : 'rgba(255,255,255,0.4)' }} />
        </div>

        <div
          className="hidden md:flex absolute right-10 items-center gap-3 pointer-events-none"
          style={{ zIndex: 8, top: '38%' }}
        >
          <span className="block w-px h-16" style={{ backgroundColor: isDark ? 'rgba(240,235,224,0.35)' : 'rgba(255,255,255,0.4)' }} />
          <span className="spec-label" style={{ color: isDark ? '#F0EBE0' : '#FFFFFF', opacity: 0.45, writingMode: 'vertical-rl' }}>
            Est.&nbsp;2024 →
          </span>
        </div>

        {/* Layer 5: Scroll Indicator - on top */}
        <div 
          ref={heroScrollRef}
          className="hero-scroll absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ zIndex: 20 }}
        >
          <span className="text-xs uppercase tracking-[0.2em] font-medium" style={{ color: '#F0EBE0' }}>
            Scroll
          </span>
          <div className="w-6 h-10 rounded-full border-2 flex justify-center pt-2" style={{ borderColor: '#F0EBE0' }}>
            <div className="w-1.5 h-3 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
