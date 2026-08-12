import { motion, useReducedMotion } from 'framer-motion'
import { resumeData } from '../../lib/resume-data'

// Overlapping flattened ellipses at different angles read as a tangled
// scrub-brush ball — the classic western-showdown "tumbleweed rolls by" prop.
const strands = [
  { rx: 34, ry: 19, rotate: 0, tone: 0 },
  { rx: 34, ry: 19, rotate: 30, tone: 1 },
  { rx: 34, ry: 19, rotate: 60, tone: 0 },
  { rx: 34, ry: 19, rotate: 90, tone: 1 },
  { rx: 34, ry: 19, rotate: 120, tone: 0 },
  { rx: 34, ry: 19, rotate: 150, tone: 1 },
  { rx: 27, ry: 13, rotate: 18, tone: 1 },
  { rx: 27, ry: 13, rotate: 78, tone: 0 },
  { rx: 27, ry: 13, rotate: 138, tone: 1 },
]

const TumbleweedBall = () => (
  <svg width={76} height={76} viewBox="0 0 76 76">
    <g transform="translate(38 38)">
      {strands.map((s, i) => (
        <ellipse
          key={i}
          rx={s.rx}
          ry={s.ry}
          fill="none"
          stroke={s.tone === 0 ? '#D4A574' : '#9B8B70'}
          strokeWidth={1.4}
          opacity={0.8}
          transform={`rotate(${s.rotate})`}
        />
      ))}
    </g>
    {/* GitHub badge riding at the center */}
    <circle cx={38} cy={38} r={15} fill="#1A1208" stroke="#E8570C" strokeWidth={1.5} />
    <svg x={26} y={26} width={24} height={24} viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="#F5F0E8" />
    </svg>
  </svg>
)

/**
 * A wireframe tumbleweed with a GitHub badge at its core, rolling right to
 * left across the bottom of the section on an infinite loop — a nod to the
 * old western-showdown "tumbleweed rolls through frame" beat. Clicking it
 * opens the GitHub profile. Respects prefers-reduced-motion (static, centered).
 */
export const GithubTumbleweed = () => {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none z-[3]">
        <a
          href={resumeData.personal.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit my GitHub profile"
          className="pointer-events-auto block"
        >
          <TumbleweedBall />
        </a>
      </div>
    )
  }

  return (
    <div className="absolute inset-x-0 bottom-4 md:bottom-8 h-20 pointer-events-none overflow-hidden z-[3]">
      {/* Desert horizon line */}
      <div
        className="absolute left-0 right-0 bottom-3 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(212,165,116,0.35) 18%, rgba(212,165,116,0.35) 82%, transparent)',
        }}
      />

      {/* Translation only — keeps the dust trail horizontal while the ball spins independently */}
      <motion.div
        className="absolute bottom-0 pointer-events-auto"
        style={{ willChange: 'transform' }}
        animate={{ x: ['115vw', '-20vw'] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
      >
        {/* Dust trail kicked up behind it */}
        <div
          className="absolute top-1/2 right-full -translate-y-1/2 pointer-events-none"
          style={{
            width: 150,
            height: 44,
            background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.24) 55%, rgba(212,165,116,0.08))',
            filter: 'blur(7px)',
            borderRadius: '50%',
          }}
        />

        {/* Tumbling spin, independent timing from the cross-screen travel */}
        <motion.div
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 2.3, repeat: Infinity, ease: 'linear' }}
          whileHover={{ scale: 1.12 }}
        >
          <a
            href={resumeData.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit my GitHub profile"
            className="block"
          >
            <TumbleweedBall />
          </a>
        </motion.div>
      </motion.div>
    </div>
  )
}
