import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  
  // Parallax scroll transforms
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  // Text moves down and fades (goes behind mountains) - faster
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, 200])
  const textOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])
  
  // Mountain parallax - back mountain stays static, others move
  const middleY = useTransform(scrollYProgress, [0, 0.6], [0, -60])
  const frontY = useTransform(scrollYProgress, [0, 0.6], [0, -80])

  useEffect(() => {
    if (!contentRef.current) return

    const ctx = gsap.context(() => {
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
      .from('.hero-scroll', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.3")

      gsap.to('.hero-scroll', {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      })
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

        {/* Layer 5: Back Mountain (gemini2.png - static bg, doesn't move) */}
        <img 
          src={mountainBack} 
          alt="" 
          className="absolute left-0 w-full h-auto pointer-events-none"
          style={{ 
            bottom: '-30%',
            zIndex: 1,
            objectFit: 'cover',
            objectPosition: 'bottom',
            minHeight: '120%'
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
            zIndex: 3,
            paddingBottom: '12rem'
          }}
        >
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="hero-name font-display mb-8 leading-[0.9]" style={{ fontSize: 'clamp(3rem, 12vw, 9rem)', color: '#F0EBE0', fontWeight: 700 }}>
              {resumeData.personal.name.split(' ').map((word, i) => (
                <div key={i} className="block overflow-hidden">
                  <span className="name-word block">
                    {i === 1 ? <span style={{ color: '#E8570C' }}>{word}</span> : word}
                  </span>
                </div>
              ))}
            </h1>

            <div className="overflow-hidden mb-6">
              <p className="hero-word text-xl md:text-2xl lg:text-3xl font-light" style={{ color: '#D4C4A8' }}>
                Full-Stack Developer & ML Engineer
              </p>
            </div>

            <p className="hero-subtitle text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#9B8B70' }}>
              Building scalable systems, training ML models, and analyzing data to drive insights - from backend APIs to production AI.
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
              style={{ backgroundColor: '#E8570C' }}
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

        {/* Layer 5: Scroll Indicator - on top */}
        <div 
          className="hero-scroll absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ zIndex: 20 }}
        >
          <span className="text-xs uppercase tracking-[0.2em] font-medium" style={{ color: '#F0EBE0' }}>
            Scroll
          </span>
          <div className="w-6 h-10 rounded-full border-2 flex justify-center pt-2" style={{ borderColor: '#F0EBE0' }}>
            <div className="w-1.5 h-3 rounded-full" style={{ backgroundColor: '#E8570C' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
