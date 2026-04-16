import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { ThemeSwitch } from './ThemeSwitch'
import { LimelightNav } from './LimelightNav'
import { useTheme } from '../providers/ThemeProvider'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' },
]

const navSectionIds = navItems.map((item) => item.href.slice(1))

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(navSectionIds[0])
  const [activeNavIndex, setActiveNavIndex] = useState(0)
  const scrollLockSectionRef = useRef<string | null>(null)
  const scrollLockUntilRef = useRef(0)
  const sectionRatioRef = useRef<Record<string, number>>({})
  const { resolvedTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'
  const limelightItems = useMemo(
    () =>
      navItems.map((item) => ({
        id: item.label.toLowerCase(),
        label: item.label,
      })),
    []
  )

  useEffect(() => {
    let frameId = 0

    const updateOnScroll = () => {
      frameId = 0
      const scrolled = window.scrollY > 80
      setIsScrolled((prev) => (prev === scrolled ? prev : scrolled))
    }

    const handleScroll = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(updateOnScroll)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateOnScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [])

  useEffect(() => {
    const sectionElements = navSectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element))

    if (sectionElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).id
          sectionRatioRef.current[id] = entry.isIntersecting ? entry.intersectionRatio : 0
        })

        if (scrollLockSectionRef.current && Date.now() < scrollLockUntilRef.current) {
          return
        }

        if (scrollLockSectionRef.current && Date.now() >= scrollLockUntilRef.current) {
          scrollLockSectionRef.current = null
        }

        let nextSection = navSectionIds[0]
        let bestRatio = 0

        for (const id of navSectionIds) {
          const ratio = sectionRatioRef.current[id] ?? 0
          if (ratio > bestRatio) {
            bestRatio = ratio
            nextSection = id
          }
        }

        if (bestRatio === 0) {
          const anchorY = 110
          let bestTop = Number.NEGATIVE_INFINITY
          let nearestUpcomingSection = navSectionIds[0]
          let nearestUpcomingTop = Number.POSITIVE_INFINITY

          sectionElements.forEach((element) => {
            const top = element.getBoundingClientRect().top

            if (top <= anchorY && top > bestTop) {
              bestTop = top
              nextSection = element.id
            }

            if (top > anchorY && top < nearestUpcomingTop) {
              nearestUpcomingTop = top
              nearestUpcomingSection = element.id
            }
          })

          if (bestTop === Number.NEGATIVE_INFINITY) {
            nextSection = nearestUpcomingSection
          }
        }

        setActiveSection((prev) => (prev === nextSection ? prev : nextSection))
      },
      {
        root: null,
        rootMargin: '-18% 0px -58% 0px',
        threshold: [0, 0.08, 0.16, 0.25, 0.4, 0.6, 0.8, 1],
      }
    )

    sectionElements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const sectionIndex = navSectionIds.indexOf(activeSection)
    if (sectionIndex >= 0) {
      setActiveNavIndex((prev) => (prev === sectionIndex ? prev : sectionIndex))
    }
  }, [activeSection])

  const handleMobileNavClick = (href: string, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault()
    event.stopPropagation()
    handleNavClick(href)
  }

  const handleNavClick = (href: string) => {
    const targetSection = href.replace('#', '')
    const targetIndex = navSectionIds.indexOf(targetSection)

    // Update active state immediately so limelight does not jump back before scroll observer catches up.
    if (targetSection && targetIndex >= 0) {
      scrollLockSectionRef.current = targetSection
      scrollLockUntilRef.current = Date.now() + 1700
      setActiveSection((prev) => (prev === targetSection ? prev : targetSection))
      setActiveNavIndex((prev) => (prev === targetIndex ? prev : targetIndex))
    }

    // Close mobile menu immediately for better UX
    const shouldDelayScroll = isMobileMenuOpen
    setIsMobileMenuOpen(false)

    const runScroll = () => {
      const target = document.querySelector(href)

      if (target) {
        // Get element position relative to document
        const elementTop = target.getBoundingClientRect().top + window.pageYOffset - 80
        
        // Use simple scroll - this should always work
        window.scrollTo({
          top: elementTop,
          behavior: 'smooth'
        })
        
        // Fallback for older browsers
        setTimeout(() => {
          if (Math.abs(window.pageYOffset - elementTop) > 50) {
            window.scrollTo(0, elementTop)
          }
        }, 1000)
      } else {
        // Last resort - try direct hash navigation
        window.location.hash = href
      }
    }

    if (shouldDelayScroll) {
      setTimeout(runScroll, 100)
      return
    }

    runScroll()
  }

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          backdropFilter: isScrolled ? 'blur(10px)' : 'blur(6px)',
          WebkitBackdropFilter: isScrolled ? 'blur(10px)' : 'blur(6px)',
          backgroundColor: isScrolled 
            ? (isDark ? 'rgba(14, 14, 11, 0.95)' : 'rgba(245, 240, 232, 0.95)')
            : (isDark ? 'rgba(14, 14, 11, 0.85)' : 'rgba(245, 240, 232, 0.85)'),
          borderBottom: isScrolled ? '1px solid rgba(232, 87, 12, 0.15)' : '1px solid transparent',
          height: isScrolled ? '56px' : '72px',
          willChange: 'transform',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <motion.button
            onClick={() => handleNavClick('#home')}
            className="text-2xl font-display font-bold"
            style={{ color: '#E8570C' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Kunal Mathur
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <LimelightNav
              items={limelightItems}
              activeIndex={activeNavIndex}
              onTabChange={(index) => {
                const item = navItems[index]
                if (item) handleNavClick(item.href)
              }}
              isDark={isDark}
            />
          </div>

          {/* Right side - Theme Switch */}
          <div className="hidden md:flex items-center">
            <ThemeSwitch />
          </div>

          {/* Mobile: Theme Toggle & Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeSwitch />
            <motion.button
              style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          height: isMobileMenuOpen ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-16 left-0 right-0 md:hidden z-30 overflow-hidden"
        style={{ 
          backgroundColor: isDark ? '#0E0E0B' : '#F5F0E8',
          borderBottom: '1px solid rgba(212, 165, 116, 0.3)'
        }}
      >
        <div className="flex flex-col gap-4 p-6">
          {navItems.map((item, i) => (
            <motion.button
              key={item.label}
              onClick={(e) => handleMobileNavClick(item.href, e)}
              onTouchStart={(e) => handleMobileNavClick(item.href, e)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-left transition-colors py-3 px-4 rounded-lg hover:bg-opacity-10 active:scale-95 cursor-pointer select-none"
              style={{ 
                color: isDark ? '#F0EBE0' : '#1A1208',
                backgroundColor: 'transparent',
                touchAction: 'manipulation' // Prevents double-tap zoom on mobile
              }}
              whileTap={{ scale: 0.95, backgroundColor: 'rgba(232, 87, 12, 0.1)' }}
            >
              {item.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </>
  )
}
