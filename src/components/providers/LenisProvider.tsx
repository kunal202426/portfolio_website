import { useEffect, useRef, useState, createContext, useContext, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

declare global {
  interface Window {
    lenis?: Lenis | null
  }
}

const LenisContext = createContext<Lenis | null>(null)

export const useLenis = () => {
  return useContext(LenisContext)
}

export const LenisProvider = ({ children }: { children: ReactNode }) => {
  const lenisRef = useRef<Lenis | null>(null)
  const rafIdRef = useRef<number | null>(null)
  const scrollTriggerRafRef = useRef<number | null>(null)
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3.5),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
    })
    lenisRef.current = lenis
    setLenisInstance(lenis)

    window.lenis = lenis

    const onLenisScroll = () => {
      if (scrollTriggerRafRef.current !== null) return

      scrollTriggerRafRef.current = requestAnimationFrame(() => {
        scrollTriggerRafRef.current = null
        ScrollTrigger.update()
      })
    }
    lenis.on('scroll', onLenisScroll)

    const raf = (time: number) => {
      lenis.raf(time)
      rafIdRef.current = requestAnimationFrame(raf)
    }

    rafIdRef.current = requestAnimationFrame(raf)

    return () => {
      lenis.off('scroll', onLenisScroll)
      if (scrollTriggerRafRef.current !== null) {
        cancelAnimationFrame(scrollTriggerRafRef.current)
      }
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
      lenis.destroy()
      lenisRef.current = null
      setLenisInstance(null)
      window.lenis = null
    }
  }, [])

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  )
}
