import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { resumeData } from '../../lib/resume-data'
import { useTheme } from '../providers/ThemeProvider'

gsap.registerPlugin(ScrollTrigger)

/**
 * Cinematic Hero Section with Parallax
 * Full viewport with name, animated headline, and scroll-driven parallax
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
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  useEffect(() => {
    if (!contentRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 })

      // Name animation
      tl.from('.hero-name', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      })
      
      // Title words stagger
      .from('.hero-word', {
        y: 80,
        opacity: 0,
        rotationX: 45,
        duration: 1.2,
        stagger: 0.12,
        ease: "power3.out"
      }, "-=0.5")
      
      // Subtitle
      .from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4")

      // Floating elements
      .from('.hero-float', {
        scale: 0,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "elastic.out(1, 0.5)"
      }, "-=0.6")

      // Scroll indicator
      .from('.hero-scroll', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.3")

      // Continuous floating animation for decorative elements
      gsap.to('.hero-float', {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.5
      })

      // Scroll indicator bounce
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
      className="relative w-full h-screen flex items-center justify-center overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: isDark ? '#0E0E0B' : '#F5F0E8' }}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            background: isDark 
              ? 'radial-gradient(ellipse at 30% 20%, rgba(232, 87, 12, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(212, 165, 116, 0.1) 0%, transparent 50%)'
              : 'radial-gradient(ellipse at 30% 20%, rgba(232, 87, 12, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(212, 165, 116, 0.1) 0%, transparent 50%)'
          }}
        />
      </div>
      
      {/* Floating Decorative Elements */}
      <div className="hero-float absolute top-[15%] left-[10%] w-20 h-20 rounded-full opacity-20" style={{ background: 'linear-gradient(135deg, #E8570C 0%, #FF6B1A 100%)' }} />
      <div className="hero-float absolute top-[25%] right-[15%] w-12 h-12 rounded-full opacity-15" style={{ backgroundColor: '#D4A574' }} />
      <div className="hero-float absolute bottom-[30%] left-[20%] w-8 h-8 rounded-full opacity-10" style={{ backgroundColor: '#E8570C' }} />
      <div className="hero-float absolute bottom-[20%] right-[10%] w-16 h-16 rounded-full opacity-20" style={{ background: 'linear-gradient(135deg, #D4A574 0%, #E8570C 100%)' }} />

      {/* Main Content with Parallax */}
      <motion.div 
        ref={contentRef}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        style={{ y, opacity, scale }}
      >
        {/* Name - Large Display */}
        <div className="hero-name mb-6">
          <span 
            className="text-sm md:text-base uppercase tracking-[0.3em] font-medium"
            style={{ color: '#E8570C' }}
          >
            Hello, I'm
          </span>
        </div>
        
        <h1 className="hero-name font-display mb-8 leading-[0.9] transition-colors duration-500" style={{ fontSize: 'clamp(3rem, 12vw, 9rem)', color: isDark ? '#F0EBE0' : '#1A1208', fontWeight: 700 }}>
          {resumeData.personal.name.split(' ').map((word, i) => (
            <span key={i} className="block">
              {i === 1 ? <span style={{ color: '#E8570C' }}>{word}</span> : word}
            </span>
          ))}
        </h1>

        {/* Role Title */}
        <div className="overflow-hidden mb-6">
          <p className="hero-word text-xl md:text-2xl lg:text-3xl font-light transition-colors duration-500" style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}>
            Full-Stack Developer & Creative Engineer
          </p>
        </div>

        {/* Summary Line */}
        <p className="hero-subtitle text-base md:text-lg max-w-2xl mx-auto leading-relaxed transition-colors duration-500" style={{ color: isDark ? '#9B8B70' : '#4A3C2A', opacity: 0.8 }}>
          Building scalable systems, crafting interactive experiences, and shipping production-grade solutions across web, ML, and blockchain.
        </p>

        {/* CTA Buttons */}
        <div className="hero-subtitle flex flex-wrap gap-4 justify-center mt-10">
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
            style={{ borderColor: isDark ? '#F0EBE0' : '#1A1208', color: isDark ? '#F0EBE0' : '#1A1208' }}
          >
            Get in Touch
          </a>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <div className="hero-scroll absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs uppercase tracking-[0.2em] font-medium" style={{ color: isDark ? '#9B8B70' : '#C4B49A' }}>
          Scroll
        </span>
        <div className="w-6 h-10 rounded-full border-2 flex justify-center pt-2" style={{ borderColor: isDark ? '#9B8B70' : '#C4B49A' }}>
          <div className="w-1.5 h-3 rounded-full" style={{ backgroundColor: '#E8570C' }} />
        </div>
      </div>
    </section>
  )
}
