import { useEffect, createContext, useContext } from 'react'
import Lenis from 'lenis'

const LenisContext = createContext<Lenis | null>(null)

export const useLenis = () => {
  return useContext(LenisContext)
}

export const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  let lenis: Lenis | null = null

  useEffect(() => {
    // Initialize Lenis smooth scrolling
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 2,
    })

    // Expose Lenis instance globally for navigation
    // @ts-ignore
    window.lenis = lenis

    // Request animation frame loop
    function raf(time: number) {
      lenis?.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Cleanup
    return () => {
      if (lenis) {
        lenis.destroy()
        // @ts-ignore
        window.lenis = null
      }
    }
  }, [])

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  )
}
