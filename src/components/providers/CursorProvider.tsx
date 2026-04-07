import { createContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useMousePosition } from '../../hooks'

interface CursorContextType {
  isHovering: boolean
}

export const CursorContext = createContext<CursorContextType>({ isHovering: false })

export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [isHovering, setIsHovering] = useState(false)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorOutlineRef = useRef<HTMLDivElement>(null)
  const position = useMousePosition()

  useEffect(() => {
    // Update cursor dot position
    if (cursorDotRef.current) {
      cursorDotRef.current.style.left = `${position.x}px`
      cursorDotRef.current.style.top = `${position.y}px`
    }

    // Update cursor outline position with slight delay for trailing effect
    if (cursorOutlineRef.current) {
      cursorOutlineRef.current.style.left = `${position.x}px`
      cursorOutlineRef.current.style.top = `${position.y}px`
    }
  }, [position])

  useEffect(() => {
    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"], input, textarea')
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  return (
    <>
      {/* Cursor Dot */}
      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed w-2 h-2 bg-accent-primary rounded-full z-[9999] transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
        style={{
          opacity: isHovering ? 0 : 1,
        }}
      />

      {/* Cursor Outline */}
      <div
        ref={cursorOutlineRef}
        className={`pointer-events-none fixed w-8 h-8 border-2 rounded-full z-[9998] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
          isHovering ? 'border-accent-primary scale-150' : 'border-accent-primary/30'
        }`}
      />

      {/* Context Provider */}
      <CursorContext.Provider value={{ isHovering }}>{children}</CursorContext.Provider>
    </>
  )
}
