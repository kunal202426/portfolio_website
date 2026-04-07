import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { MagneticButton } from './MagneticButton'
import { ThemeTogglerButton } from './ThemeTogglerButton'
import { useTheme } from '../providers/ThemeProvider'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' },
]

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { resolvedTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)

      // Update active section based on scroll
      const sections = ['home', 'about', 'projects', 'experience', 'skills', 'resume', 'education', 'certifications', 'contact']
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          backdropFilter: 'blur(20px)',
          backgroundColor: isScrolled 
            ? (isDark ? 'rgba(14, 14, 11, 0.95)' : 'rgba(245, 240, 232, 0.95)')
            : (isDark ? 'rgba(14, 14, 11, 0.85)' : 'rgba(245, 240, 232, 0.85)'),
          borderBottom: isScrolled ? '1px solid rgba(232, 87, 12, 0.15)' : '1px solid transparent',
          height: isScrolled ? '56px' : '72px',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#home"
            className="text-2xl font-display font-bold"
            style={{ color: '#E8570C' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Kunal Mathur
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="relative text-sm font-medium transition-colors"
                style={{
                  color: activeSection === item.href.slice(1) 
                    ? '#E8570C' 
                    : (isDark ? '#D4C4A8' : '#4A3C2A'),
                }}
                whileHover={{ y: -2, color: '#E8570C' }}
              >
                {item.label}
                {activeSection === item.href.slice(1) && (
                  <motion.div
                    className="absolute -bottom-4 left-0 right-0 h-0.5"
                    style={{ backgroundColor: '#E8570C' }}
                    layoutId="underline"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Right side - Theme Toggle & CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeTogglerButton 
              variant="ghost" 
              size="md" 
              direction="vertical"
              modes={['light', 'dark', 'system']}
            />
            <MagneticButton variant="ghost">Hire Me</MagneticButton>
          </div>

          {/* Mobile: Theme Toggle & Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeTogglerButton 
              variant="ghost" 
              size="sm" 
              direction="vertical"
              modes={['light', 'dark', 'system']}
            />
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
              onClick={() => handleNavClick(item.href)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-left transition-colors"
              style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}
            >
              {item.label}
            </motion.button>
          ))}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: navItems.length * 0.1 }}
            className="pt-4"
            style={{ borderTop: '1px solid rgba(212, 165, 116, 0.3)' }}
          >
            <MagneticButton variant="primary" className="w-full">
              Hire Me
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
