import { useEffect, useState } from 'react'
import { motion, useMotionValue, animate, type PanInfo } from 'framer-motion'
import { Award } from 'lucide-react'
import { resumeData } from '../../lib/resume-data'

type Certification = (typeof resumeData.certifications)[number]

const ACCENTS = ['#BF5B3D', '#D4A574', '#B8860B', '#C85A3A', '#8B6F47', '#A67C52']
const SPRING = { type: 'spring' as const, stiffness: 45, damping: 16, mass: 1.2 }

function CertFace({ cert, accent }: { cert: Certification; accent: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 20,
        overflow: 'hidden',
        background: 'rgba(20, 16, 11, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${accent}40`,
        boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 30px ${accent}25`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          position: 'relative',
          height: 150,
          flexShrink: 0,
          background: `linear-gradient(135deg, ${accent}35 0%, ${accent}10 60%, transparent 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span className="spec-label" style={{ position: 'absolute', top: 14, left: 16, opacity: 0.65, color: '#F0EBE0' }}>
          Cert. {cert.year}
        </span>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 16,
            background: '#FFFFFF',
            border: `1px solid ${accent}50`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {cert.logo ? (
            <img src={cert.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 10 }} />
          ) : (
            <Award color={accent} size={26} />
          )}
        </div>
      </div>

      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <p className="spec-label" style={{ color: accent, marginBottom: 8, opacity: 0.9 }}>
          {cert.issuer}
        </p>
        <h3 className="font-display" style={{ fontSize: 19, color: '#F0EBE0', margin: '0 0 10px', lineHeight: 1.1 }}>
          {cert.title}
        </h3>
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: 'rgba(240, 235, 224, 0.6)',
            margin: 0,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 5,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {cert.description}
        </p>
      </div>
    </div>
  )
}

function NavArrow({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  const sideStyle = direction === 'left' ? { left: 0 } : { right: 0 }
  return (
    <button
      onClick={onClick}
      aria-label={direction === 'left' ? 'Previous certification' : 'Next certification'}
      style={{
        position: 'absolute',
        top: '50%',
        ...sideStyle,
        transform: 'translateY(-50%)',
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.15)',
        color: '#F0EBE0',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
        <path
          d={direction === 'left' ? 'M11 4L6 9L11 14' : 'M7 4L12 9L7 14'}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

// 3D octagonal-cylinder carousel. Arrows/dots step one card at a time;
// dragging (mouse or touch) freely spins the cylinder and snaps to the
// nearest face on release, instead of only responding to the arrows.
export const CertificationCarousel3D = ({ certifications }: { certifications: Certification[] }) => {
  const totalCards = Math.min(certifications.length, 8)
  const anglePerCard = 360 / totalCards
  const cardDepth = 380

  const rotation = useMotionValue(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const rotateTo = (index: number) => {
    setActiveIndex((prev) => {
      let diff = index - prev
      if (diff > totalCards / 2) diff -= totalCards
      if (diff < -totalCards / 2) diff += totalCards
      animate(rotation, rotation.get() - diff * anglePerCard, SPRING)
      return index
    })
  }

  const goPrev = () => rotateTo((activeIndex - 1 + totalCards) % totalCards)
  const goNext = () => rotateTo((activeIndex + 1) % totalCards)

  useEffect(() => {
    if (isPaused || isMobile) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % totalCards
        animate(rotation, rotation.get() - anglePerCard, SPRING)
        return next
      })
    }, 4200)
    return () => clearInterval(timer)
  }, [isPaused, isMobile, totalCards, anglePerCard, rotation])

  const handlePanEnd = (_event: unknown, _info: PanInfo) => {
    setIsPaused(false)
    const current = rotation.get()
    const steps = Math.round(current / anglePerCard)
    animate(rotation, steps * anglePerCard, SPRING)
    setActiveIndex((((-steps) % totalCards) + totalCards) % totalCards)
  }

  const faceAngles = Array.from({ length: totalCards }, (_, i) => i * anglePerCard)

  if (isMobile) {
    return (
      <div
        style={{
          display: 'flex',
          gap: 14,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: 8,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {certifications.slice(0, totalCards).map((cert, i) => (
          <div key={cert.title} style={{ position: 'relative', flexShrink: 0, width: 250, height: 360, scrollSnapAlign: 'center' }}>
            <CertFace cert={cert} accent={ACCENTS[i % ACCENTS.length]} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: 24,
        background: '#0E0E0B',
        overflow: 'hidden',
        padding: '48px 20px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div style={{ position: 'relative', width: '100%', maxWidth: 1000, height: 440, perspective: 1300, perspectiveOrigin: '50% 50%' }}>
        <motion.div
          onPanStart={() => setIsPaused(true)}
          onPan={(_event, info) => rotation.set(rotation.get() + info.delta.x * 0.35)}
          onPanEnd={handlePanEnd}
          style={{
            position: 'absolute',
            width: 300,
            height: 400,
            left: '50%',
            top: '50%',
            marginLeft: -150,
            marginTop: -200,
            transformStyle: 'preserve-3d',
            rotateY: rotation,
            cursor: 'grab',
            touchAction: 'pan-y',
          }}
        >
          {certifications.slice(0, totalCards).map((cert, i) => (
            <div
              key={cert.title}
              style={{
                position: 'absolute',
                width: 300,
                height: 400,
                top: 0,
                left: 0,
                transform: `rotateY(${faceAngles[i]}deg) translateZ(${cardDepth}px)`,
                backfaceVisibility: 'hidden',
              }}
            >
              <CertFace cert={cert} accent={ACCENTS[i % ACCENTS.length]} />
            </div>
          ))}
        </motion.div>

        <NavArrow direction="left" onClick={goPrev} />
        <NavArrow direction="right" onClick={goNext} />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 24, position: 'relative', zIndex: 10 }}>
        {Array.from({ length: totalCards }).map((_, i) => (
          <button
            key={i}
            onClick={() => rotateTo(i)}
            aria-label={`Go to certification ${i + 1}`}
            style={{
              width: i === activeIndex ? 22 : 8,
              height: 8,
              borderRadius: 4,
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              background: i === activeIndex ? ACCENTS[i % ACCENTS.length] : 'rgba(255,255,255,0.15)',
              transition: 'all 0.35s ease',
            }}
          />
        ))}
      </div>

      <p className="spec-label" style={{ color: '#F0EBE0', opacity: 0.4, marginTop: 16 }}>
        Drag to rotate — or use the arrows
      </p>
    </div>
  )
}
