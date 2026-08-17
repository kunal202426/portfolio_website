import { useState } from 'react'
import { motion } from 'framer-motion'

const BIO_PARAGRAPHS = [
  "I'm a Software Engineer focused on backend engineering, machine learning, and real-time data systems. My work centers on designing scalable architectures that perform reliably under production-level load.",
  "Currently building production features at YES Securities (YES Bank) as a Full Stack Developer Intern, while completing my B.Tech in Computer Science & Engineering at VIT. I also work on independent software projects, competitive engineering challenges, and UI/UX design.",
]

// Adapted from a Framer "Book" reference: the cover swings open on its
// spine to reveal a page underneath. The reference showed a title/author
// on that page - here it's the bio text that used to sit beside it.
export const AboutBook = () => {
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{ perspective: 1600, width: '100%', maxWidth: 320, aspectRatio: '0.7 / 1', margin: '0 auto', cursor: 'pointer' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
      role="button"
      tabIndex={0}
      aria-label="About Kunal - hover or tap to open"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setOpen((o) => !o)
        }
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
        {/* Page - sits behind the cover, revealed as it swings open */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#FAF5F2',
            borderRadius: 10,
            padding: '13% 9%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 14,
            overflowY: 'auto',
            boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
          }}
        >
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#BF5B3D',
              margin: 0,
            }}
          >
            About Kunal
          </p>
          {BIO_PARAGRAPHS.map((paragraph, i) => (
            <p key={i} style={{ fontSize: 13, lineHeight: 1.65, color: '#4A3C2A', margin: 0 }}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Cover - swings open on its left edge */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
            borderRadius: 10,
            background: 'linear-gradient(150deg, var(--accent-primary), #7A3524)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '10%',
          }}
          animate={{ rotateY: open ? -100 : 0 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
        >
          <span
            className="spec-label"
            style={{ color: 'rgba(245,240,232,0.7)', marginBottom: 14, opacity: 1 }}
          >
            Software Engineer
          </span>
          <h3 className="font-display" style={{ fontSize: 'clamp(30px, 6vw, 42px)', color: '#F5F0E8', margin: 0, lineHeight: 1.05 }}>
            Kunal
            <br />
            Mathur
          </h3>
          <div style={{ width: 40, height: 2, background: 'rgba(245,240,232,0.5)', margin: '18px 0' }} />
          <span className="spec-label" style={{ color: 'rgba(245,240,232,0.5)', opacity: 1 }}>
            A Field Notebook
          </span>
        </motion.div>
      </div>
    </div>
  )
}
