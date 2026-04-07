import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// Check for reduced motion preference
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export const useGSAP = (callback: (context: gsap.Context) => void, deps?: React.DependencyList) => {
  const ref = useRef<HTMLElement>(null)

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(callback, ref)
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (prefersReducedMotion) {
      // Complete all animations instantly
      gsap.globalTimeline.progress(1)
    }

    return () => ctx.revert()
  }, deps)

  return ref
}

export const useGSAPContext = (callback: () => void, deps?: React.DependencyList) => {
  useIsomorphicLayoutEffect(() => {
    callback()
    
    return () => {
      // Cleanup function for GSAP animations
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, deps)
}