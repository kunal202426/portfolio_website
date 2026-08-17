import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface EyeFollowButtonProps {
  href: string
  label: string
}

const EYE_SIZE = 24
const PUPIL_SIZE = 9
const EYE_GAP = 6
const MAX_DISTANCE = ((EYE_SIZE - PUPIL_SIZE) / 2) * 0.8

function eyeOffset(containerRef: React.RefObject<HTMLElement>, mouseX: number, mouseY: number, eyeOffsetX: number) {
  const relX = mouseX - eyeOffsetX
  const relY = mouseY
  const distance = Math.sqrt(relX * relX + relY * relY)
  if (distance === 0) return { x: 0, y: 0 }
  const clamped = Math.min(distance, MAX_DISTANCE)
  const angle = Math.atan2(relY, relX)
  return { x: Math.cos(angle) * clamped, y: Math.sin(angle) * clamped }
}

function Eye({ pupil }: { pupil: { x: number; y: number } }) {
  return (
    <span
      style={{
        width: EYE_SIZE,
        height: EYE_SIZE,
        borderRadius: '50%',
        background: '#F5F0E8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <motion.span
        style={{ width: PUPIL_SIZE, height: PUPIL_SIZE, borderRadius: '50%', background: '#1A1208', display: 'block' }}
        animate={{ x: pupil.x, y: pupil.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      />
    </span>
  )
}

// Adapted from a Framer "Eye Follow Button" reference: two little eyes
// track the cursor anywhere on the page, not just while hovering the
// button itself.
export const EyeFollowButton = ({ href, label }: EyeFollowButtonProps) => {
  const containerRef = useRef<HTMLAnchorElement>(null)
  const [leftPupil, setLeftPupil] = useState({ x: 0, y: 0 })
  const [rightPupil, setRightPupil] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const mouseX = event.clientX - centerX
      const mouseY = event.clientY - centerY
      const eyeOffsetX = EYE_SIZE / 2 + EYE_GAP / 2
      setLeftPupil(eyeOffset(containerRef, mouseX, mouseY, -eyeOffsetX))
      setRightPupil(eyeOffset(containerRef, mouseX, mouseY, eyeOffsetX))
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <motion.a
      ref={containerRef}
      href={href}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: '10px 10px 10px 24px',
        height: 60,
        borderRadius: 999,
        background: 'var(--accent-primary)',
        color: '#F5F0E8',
        textDecoration: 'none',
        fontFamily: "'Inter', system-ui, sans-serif",
        fontWeight: 700,
        fontSize: 15,
        boxShadow: '0 12px 28px rgba(var(--accent-primary-rgb), 0.35)',
      }}
    >
      {label}
      <span style={{ display: 'flex', gap: EYE_GAP }}>
        <Eye pupil={leftPupil} />
        <Eye pupil={rightPupil} />
      </span>
    </motion.a>
  )
}
