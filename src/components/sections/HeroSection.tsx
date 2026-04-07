import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { MagneticButton } from '../ui/MagneticButton'
// Disabled for performance: import { HeroScene } from '../canvas'
import { useParallax, useReducedMotion } from '../../hooks'
import { staggerContainer, staggerItem } from '../../lib/animation-variants'

/**
 * Individual letter component with spring animation
 */
const HeroLetter = ({ letter, delay }: { letter: string; delay: number }) => {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.span
      className="gradient-text inline-block"
      initial={{ opacity: 0, y: 40, rotateZ: -10 }}
      animate={{ opacity: 1, y: 0, rotateZ: 0 }}
      transition={{
        type: prefersReducedMotion ? 'tween' : 'spring',
        stiffness: 400,
        damping: 30,
        delay: prefersReducedMotion ? 0 : delay * 0.15,
        duration: prefersReducedMotion ? 0.1 : undefined,
      }}
    >
      {letter}
    </motion.span>
  )
}

/**
 * Typewriter text component
 */
const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('')
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedText(text)
      return
    }

    const startTime = Date.now() + delay * 1000

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const charIndex = Math.floor(elapsed / 60) // ~60ms per character

      if (charIndex >= text.length) {
        setDisplayedText(text)
        clearInterval(interval)
      } else {
        setDisplayedText(text.substring(0, charIndex))
      }
    }, 50)

    return () => clearInterval(interval)
  }, [text, delay, prefersReducedMotion])

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
      className="text-2xl md:text-3xl text-text-secondary font-light leading-relaxed"
    >
      {displayedText}
      {displayedText !== text && !prefersReducedMotion && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="inline-block w-1 h-6 ml-1 bg-accent-primary"
        />
      )}
    </motion.p>
  )
}

export const HeroSection = () => {
  const parallaxY = useParallax(0.3)
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="home" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary" />
      
      {/* Animated grid pattern */}
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Glow orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-accent-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-cyan/15 rounded-full blur-3xl" />
      <div
        className="absolute top-1/2 left-1/2 w-72 h-72 bg-accent-rose/5 rounded-full blur-3xl"
        style={{ animation: 'float 10s ease-in-out infinite reverse' }}
      />

      {/* Content with Parallax */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        style={{
          y: parallaxY,
        }}
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Role Tag */}
        <motion.div
          variants={staggerItem}
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-border-subtle bg-bg-card/50 backdrop-blur-sm"
        >
          <span className="inline-block w-2 h-2 bg-accent-primary rounded-full animate-pulse" />
          <span className="text-sm text-text-secondary font-accent">
            UI/UX Designer & Creative Developer
          </span>
        </motion.div>

        {/* Main Heading with Letter Animation */}
        <motion.div variants={staggerItem} className="mb-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight mb-4">
            {['K', 'U', 'N', 'A', 'L'].map((letter, index) => (
              <HeroLetter key={index} letter={letter} delay={index} />
            ))}
          </h1>
          <motion.div
            className="h-1 w-24 mx-auto bg-gradient-to-r from-accent-primary to-accent-glow rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          />
        </motion.div>

        {/* Subtitle with Typewriter Effect */}
        <motion.div variants={staggerItem} className="mb-12">
          <TypewriterText text="Crafting Interfaces That Think & Feel" delay={0.8} />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <MagneticButton
            onClick={() =>
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }
            variant="primary"
          >
            View My Work
          </MagneticButton>
          <MagneticButton variant="ghost">Download Resume</MagneticButton>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col items-center gap-2"
          animate={{ y: prefersReducedMotion ? 0 : [0, 10, 0] }}
          transition={{ duration: 2, repeat: prefersReducedMotion ? 0 : Infinity }}
        >
          <span className="text-xs text-text-secondary uppercase tracking-widest">
            Scroll to explore
          </span>
          <ChevronDown size={20} className="text-accent-primary" />
        </motion.div>
      </motion.div>
    </section>
  )
}
