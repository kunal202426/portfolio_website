import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { MagneticButton } from './MagneticButton'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
]

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)

      // Update active section based on scroll
      const sections = ['home', 'about', 'projects', 'experience', 'skills', 'education', 'certifications', 'contact']
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
          backgroundColor: isScrolled ? 'rgba(8, 8, 16, 0.9)' : 'rgba(8, 8, 16, 0.7)',
          borderBottom: isScrolled ? '1px solid rgba(108, 99, 255, 0.12)' : 'transparent',
          height: isScrolled ? '56px' : '72px',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#home"
            className="text-2xl font-display font-bold bg-gradient-to-r from-accent-primary to-accent-glow bg-clip-text text-transparent"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            K.
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`relative text-sm font-accent transition-colors ${
                  activeSection === item.href.slice(1)
                    ? 'text-accent-primary'
                    : 'text-text-secondary hover:text-accent-primary'
                }`}
                whileHover={{ y: -2 }}
              >
                {item.label}
                {activeSection === item.href.slice(1) && (
                  <motion.div
                    className="absolute -bottom-4 left-0 right-0 h-0.5 bg-accent-primary"
                    layoutId="underline"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Right side - CTA Button or Mobile Menu */}
          <div className="hidden md:flex">
            <MagneticButton variant="ghost">Hire Me</MagneticButton>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
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
        className="fixed top-16 left-0 right-0 md:hidden bg-bg-secondary border-b border-border-subtle z-30 overflow-hidden"
      >
        <div className="flex flex-col gap-4 p-6">
          {navItems.map((item, i) => (
            <motion.button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-left text-text-primary hover:text-accent-primary transition-colors"
            >
              {item.label}
            </motion.button>
          ))}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: navItems.length * 0.1 }}
            className="pt-4 border-t border-border-subtle"
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
