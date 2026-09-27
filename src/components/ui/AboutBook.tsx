import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface AboutBookProps {
  /** Cover art: a photo instead of the plain title cover. */
  image?: string
  imageAlt?: string
  coverLabel: string
  coverTitle: ReactNode
  coverSubtitle?: string
  pageLabel: string
  children: ReactNode
}

// The cover fades and shrinks away to reveal the page underneath - plain
// 2D opacity/scale, no 3D transform. An earlier rotateY "flip" version of
// this kept glitching (a hard seam, both faces' content bleeding through
// at once) during the actual rotation on some GPUs - a compositing bug
// tied to animating backface-visibility on a live 3D transform. This
// avoids that whole bug class by never using a 3D transform at all.
export const AboutBook = ({ image, imageAlt, coverLabel, coverTitle, coverSubtitle, pageLabel, children }: AboutBookProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{ width: '100%', maxWidth: 220, aspectRatio: '0.7 / 1', cursor: 'pointer' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
      role="button"
      tabIndex={0}
      aria-label={`${coverTitle} - hover or tap to open`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setOpen((o) => !o)
        }
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Page - sits behind the cover, revealed as it fades away */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#FAF5F2',
            borderRadius: 10,
            padding: '11% 8%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 10,
            overflowY: 'auto',
            boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
          }}
        >
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#BF5B3D',
              margin: 0,
            }}
          >
            {pageLabel}
          </p>
          {children}
        </div>

        {/* Cover */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 10,
            overflow: 'hidden',
            background: image ? '#1A1510' : 'linear-gradient(150deg, var(--accent-primary), #7A3524)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: image ? 'flex-end' : 'center',
            textAlign: 'center',
            padding: image ? 0 : '10%',
            pointerEvents: open ? 'none' : 'auto',
          }}
          animate={{ opacity: open ? 0 : 1, scale: open ? 0.92 : 1, y: open ? -10 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {image ? (
            <>
              <img
                src={image}
                alt={imageAlt ?? ''}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 18%' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(10,8,6,0.85) 0%, rgba(10,8,6,0.1) 45%, transparent 70%)',
                }}
              />
              <div style={{ position: 'relative', padding: '10% 8%', width: '100%' }}>
                <p className="spec-label" style={{ color: 'rgba(245,240,232,0.7)', marginBottom: 4, opacity: 1 }}>
                  {coverLabel}
                </p>
                <h3 className="font-display" style={{ fontSize: 'clamp(18px, 4vw, 22px)', color: '#F5F0E8', margin: 0, lineHeight: 1.05 }}>
                  {coverTitle}
                </h3>
              </div>
            </>
          ) : (
            <>
              <span className="spec-label" style={{ color: 'rgba(245,240,232,0.7)', marginBottom: 12, opacity: 1 }}>
                {coverLabel}
              </span>
              <h3 className="font-display" style={{ fontSize: 'clamp(20px, 4vw, 26px)', color: '#F5F0E8', margin: 0, lineHeight: 1.1 }}>
                {coverTitle}
              </h3>
              {coverSubtitle && (
                <>
                  <div style={{ width: 32, height: 2, background: 'rgba(245,240,232,0.5)', margin: '14px 0' }} />
                  <span className="spec-label" style={{ color: 'rgba(245,240,232,0.5)', opacity: 1 }}>
                    {coverSubtitle}
                  </span>
                </>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
