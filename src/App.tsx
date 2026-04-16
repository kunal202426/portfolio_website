import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { Navbar } from './components/ui/Navbar'
import { ScrollProgress } from './components/ui/ScrollProgress'
import { ThemeTransition } from './components/ui/ThemeTransition'
import { HeroSection } from './components/ui/sections/HeroSection'
import { AboutSection } from './components/ui/sections/AboutSection'
import { ProjectsSection } from './components/ui/sections/ProjectsSection'
import { ExperienceSection } from './components/ui/sections/ExperienceSection'
import { TechMarquee } from './components/ui/sections/TechMarquee'
import { EducationSection } from './components/ui/sections/EducationSection'
import { CertificationsSection } from './components/ui/sections/CertificationsSection'
import { ResumeSection } from './components/ui/sections/ResumeSection'
import { ContactSection } from './components/ui/sections/ContactSection'
import { LenisProvider } from './components/providers/LenisProvider'
import { ThemeProvider, useTheme } from './components/providers/ThemeProvider'

function AppContent() {
  const [isLoading, setIsLoading] = useState(true)
  const { resolvedTheme } = useTheme()
  const educationCertRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: educationCertRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 320,
    damping: 34,
    mass: 0.18,
  })

  // Complete the certifications straighten-up earlier so it doesn't exit while still tilted.
  const section1Scale = useTransform(smoothProgress, [0, 0.56, 1], [1, 0.74, 0.74])
  const section1Rotate = useTransform(smoothProgress, [0, 0.56, 1], [0, -7, -7])
  const section2Scale = useTransform(smoothProgress, [0, 0.12, 0.58, 1], [0.72, 0.72, 1, 1])
  const section2Rotate = useTransform(smoothProgress, [0, 0.12, 0.58, 1], [7, 7, 0, 0])

  useEffect(() => {
    // Simulate loading time - reduced for better UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const isDark = resolvedTheme === 'dark'

  return (
    <div 
      className="w-full overflow-x-hidden transition-colors duration-500" 
      style={{ 
        backgroundColor: isDark ? '#0E0E0B' : '#F5F0E8', 
        color: isDark ? '#F0EBE0' : '#1A1208' 
      }}
    >
      {isLoading && <LoadingScreen onLoadComplete={() => setIsLoading(false)} />}

      <ThemeTransition />
      <ScrollProgress />
      <Navbar />

      <main className="min-h-screen">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <TechMarquee />
        <ExperienceSection />
        <ResumeSection />
        <div ref={educationCertRef} className="relative py-2 md:py-4">
          <motion.div
            style={{
              scale: section1Scale,
              rotate: section1Rotate,
              willChange: 'transform',
              transformOrigin: 'center top',
            }}
            className="sticky top-0 z-0 px-2 md:px-4"
          >
            <div
              className="rounded-2xl overflow-hidden border-2"
              style={{
                borderColor: isDark ? 'rgba(232, 87, 12, 0.48)' : 'rgba(232, 87, 12, 0.55)',
                boxShadow: isDark ? '0 22px 50px rgba(0, 0, 0, 0.38)' : '0 22px 50px rgba(26, 18, 8, 0.16)',
              }}
            >
              <EducationSection />
            </div>
          </motion.div>

          <motion.div
            style={{
              scale: section2Scale,
              rotate: section2Rotate,
              willChange: 'transform',
              transformOrigin: 'center top',
            }}
            className="relative z-10 px-2 md:px-4"
          >
            <div
              className="rounded-2xl overflow-hidden border-2"
              style={{
                borderColor: isDark ? 'rgba(212, 165, 116, 0.48)' : 'rgba(212, 165, 116, 0.6)',
                boxShadow: isDark ? '0 24px 52px rgba(0, 0, 0, 0.42)' : '0 24px 52px rgba(26, 18, 8, 0.2)',
              }}
            >
              <CertificationsSection />
            </div>
          </motion.div>
        </div>
        <ContactSection />
      </main>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <LenisProvider>
        <AppContent />
      </LenisProvider>
    </ThemeProvider>
  )
}

export default App
