import { useState, useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { Navbar } from './components/ui/Navbar'
import { ScrollProgress } from './components/ui/ScrollProgress'
import { ThemeTransition } from './components/ui/ThemeTransition'
import { HeroSection } from './components/ui/sections/HeroSection'
import { AboutSection } from './components/ui/sections/AboutSection'
import { ProjectsSection } from './components/ui/sections/ProjectsSection'
import { ExperienceSection } from './components/ui/sections/ExperienceSection'
import { TechMarquee } from './components/ui/sections/TechMarquee'
import { CertificationsSection } from './components/ui/sections/CertificationsSection'
import { ResumeSection } from './components/ui/sections/ResumeSection'
import { ContactSection } from './components/ui/sections/ContactSection'
import { LenisProvider } from './components/providers/LenisProvider'
import { ThemeProvider, useTheme } from './components/providers/ThemeProvider'

function AppContent() {
  const [isLoading, setIsLoading] = useState(true)
  const { resolvedTheme } = useTheme()

  // Scroll-triggered animations (e.g. the Career Journey timeline path) get
  // set up while still hidden behind the loading screen, against layout
  // that hasn't fully settled yet (fonts/images still loading) - refresh
  // every ScrollTrigger once the loading screen is actually gone and the
  // real page is visible, instead of relying on it happening to be correct
  // by the time a user scrolls past it.
  useEffect(() => {
    if (isLoading) return
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(frame)
  }, [isLoading])

  const isDark = resolvedTheme !== 'light'

  return (
    <div
      className="w-full transition-colors duration-500"
      style={{
        backgroundColor: isDark ? 'var(--bg-primary)' : '#F5F0E8',
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
        <CertificationsSection />
        <ContactSection />
      </main>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="green">
      <LenisProvider>
        <AppContent />
      </LenisProvider>
    </ThemeProvider>
  )
}

export default App
