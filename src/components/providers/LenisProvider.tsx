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
  const rafIdRef = useRef<number | null>(null)
  const scrollTriggerRafRef = useRef<number | null>(null)
  // Lazy initializer: creates the instance once, synchronously, instead of via
  // an effect + setState, so there's no extra render after mount.
  const [lenisInstance] = useState(
    () =>
      new Lenis({
        duration: 1.05,
        easing: (t) => 1 - Math.pow(1 - t, 3.5),
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 0.85,
        touchMultiplier: 1.2,
      })
  )

  useEffect(() => {
    const lenis = lenisInstance
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
      window.lenis = null
    }
  }, [lenisInstance])

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  )
}
