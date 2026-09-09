import { motion } from 'framer-motion'

// A resume-shaped skeleton where each line grows in from the left, top to
// bottom, on a staggered delay - reads as the page being typed out rather
// than a generic shimmer block. Shown only during a variant switch in
// ResumeModal, never on the very first load (that keeps the plain spinner).
type SkeletonLine = { width: string; height?: number; accent?: boolean }

const NAME_BLOCK: SkeletonLine[] = [
  { width: '42%', height: 16 },
  { width: '68%', height: 10 },
]

const SECTIONS: SkeletonLine[][] = [
  [
    { width: '28%', height: 11, accent: true },
    { width: '96%', height: 9 },
    { width: '91%', height: 9 },
    { width: '58%', height: 9 },
  ],
  [
    { width: '34%', height: 11, accent: true },
    { width: '93%', height: 9 },
    { width: '52%', height: 9 },
  ],
  [
    { width: '24%', height: 11, accent: true },
    { width: '89%', height: 9 },
    { width: '71%', height: 9 },
  ],
]

export const ResumeWritingSkeleton = ({ isDark }: { isDark: boolean }) => {
  const cardBg = isDark ? '#0E0C08' : '#FFFFFF'
  const lineBg = isDark ? 'rgba(240,235,224,0.14)' : 'rgba(26,18,8,0.1)'
  const accentBg = isDark ? 'rgba(var(--accent-primary-rgb),0.45)' : 'rgba(var(--accent-primary-rgb),0.55)'

  let lineIndex = -1

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        background: cardBg,
        borderRadius: 4,
        padding: '36px 32px',
        boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.5)' : '0 20px 50px rgba(26,18,8,0.12)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      {/* Continuous shimmer sweep across the whole page, reinforcing "still being written" */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(100deg, transparent 30%, ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)'} 50%, transparent 70%)`,
          pointerEvents: 'none',
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
        {NAME_BLOCK.map((line, i) => {
          lineIndex += 1
          return <SkeletonBar key={`name-${i}`} line={line} index={lineIndex} lineBg={lineBg} accentBg={accentBg} />
        })}
      </div>

      {SECTIONS.map((section, si) => (
        <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: si === 0 ? 8 : 20 }}>
          {section.map((line, i) => {
            lineIndex += 1
            return <SkeletonBar key={`${si}-${i}`} line={line} index={lineIndex} lineBg={lineBg} accentBg={accentBg} />
          })}
        </div>
      ))}
    </div>
  )
}

const SkeletonBar = ({
  line,
  index,
  lineBg,
  accentBg,
}: {
  line: SkeletonLine
  index: number
  lineBg: string
  accentBg: string
}) => (
  <motion.div
    initial={{ width: 0, opacity: 0.4 }}
    animate={{ width: line.width, opacity: 1 }}
    transition={{ duration: 0.4, delay: index * 0.045, ease: [0.22, 1, 0.36, 1] }}
    style={{
      height: line.height ?? 9,
      borderRadius: 3,
      background: line.accent ? accentBg : lineBg,
    }}
  />
)
