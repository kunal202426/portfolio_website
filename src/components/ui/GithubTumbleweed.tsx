import { motion, useReducedMotion } from 'framer-motion'
import { resumeData } from '../../lib/resume-data'

const TONES = ['#D4A574', '#9B8B70', '#B5813F']

// Overlapping flattened ellipses at different angles + spiky twigs at the
// rim read as a tangled scrub-brush ball — the classic western-showdown
// "tumbleweed rolls by" prop.
const strands = [
  { rx: 40, ry: 22, rotate: 0, tone: 0 },
  { rx: 38, ry: 20, rotate: 12, tone: 1 },
  { rx: 41, ry: 19, rotate: 24, tone: 2 },
  { rx: 36, ry: 23, rotate: 37, tone: 0 },
  { rx: 39, ry: 18, rotate: 50, tone: 1 },
  { rx: 34, ry: 21, rotate: 64, tone: 2 },
  { rx: 40, ry: 17, rotate: 79, tone: 0 },
  { rx: 37, ry: 22, rotate: 93, tone: 1 },
  { rx: 35, ry: 19, rotate: 107, tone: 2 },
  { rx: 41, ry: 20, rotate: 121, tone: 0 },
  { rx: 33, ry: 16, rotate: 134, tone: 1 },
  { rx: 38, ry: 21, rotate: 148, tone: 2 },
  { rx: 30, ry: 14, rotate: 20, tone: 1 },
  { rx: 30, ry: 14, rotate: 95, tone: 0 },
  { rx: 28, ry: 13, rotate: 60, tone: 2 },
  { rx: 28, ry: 13, rotate: 160, tone: 1 },
]

// Short spikes radiating from the rim (inner r=38 -> outer r=48, every 30deg)
const twigs = [
  { x1: 90, y1: 52, x2: 100, y2: 52 },
  { x1: 84.9, y1: 71, x2: 93.6, y2: 76 },
  { x1: 71, y1: 84.9, x2: 76, y2: 93.6 },
  { x1: 52, y1: 90, x2: 52, y2: 100 },
  { x1: 33, y1: 84.9, x2: 28, y2: 93.6 },
  { x1: 19.1, y1: 71, x2: 10.4, y2: 76 },
  { x1: 14, y1: 52, x2: 4, y2: 52 },
  { x1: 19.1, y1: 33, x2: 10.4, y2: 28 },
  { x1: 33, y1: 19.1, x2: 28, y2: 10.4 },
  { x1: 52, y1: 14, x2: 52, y2: 4 },
  { x1: 71, y1: 19.1, x2: 76, y2: 10.4 },
  { x1: 84.9, y1: 33, x2: 93.6, y2: 28 },
]

// Shared with the wrapper's offset math below so the ball, horizon line,
// shadow and dust all stay in sync regardless of viewport width.
const BALL_SIZE = 'clamp(140px, 18vw, 200px)'
// How much of the ball's top stays tucked behind the card above it.
const PEEK_BEHIND_CARDS = 30

const TumbleweedBall = () => (
  <svg style={{ width: BALL_SIZE, height: BALL_SIZE, display: 'block' }} viewBox="0 0 104 104">
    <defs>
      <radialGradient id="tw-shade" cx="35%" cy="30%" r="72%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
        <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.24" />
      </radialGradient>
    </defs>

    {/* Spiky rim twigs, behind the main tangle */}
    {twigs.map((t, i) => (
      <line
        key={i}
        x1={t.x1}
        y1={t.y1}
        x2={t.x2}
        y2={t.y2}
        stroke={i % 2 === 0 ? '#D4A574' : '#9B8B70'}
        strokeWidth={1.3}
        strokeLinecap="round"
        opacity={0.7}
      />
    ))}

    {/* Tangled scrub-brush body */}
    <g transform="translate(52 52)">
      {strands.map((s, i) => (
        <ellipse
          key={i}
          rx={s.rx}
          ry={s.ry}
          fill="none"
          stroke={TONES[s.tone]}
          strokeWidth={1.4}
          opacity={0.58 + (i % 4) * 0.07}
          transform={`rotate(${s.rotate})`}
        />
      ))}
    </g>

    {/* Volumetric shading overlay for a bit of dimensionality */}
    <circle cx={52} cy={52} r={44} fill="url(#tw-shade)" />

    {/* GitHub badge riding at the center */}
    <circle cx={52} cy={52} r={19} fill="#1A1208" stroke="#E8570C" strokeWidth={2} />
    <svg x={37} y={37} width={30} height={30} viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="#F5F0E8" />
    </svg>
  </svg>
)

const DUST_PUFFS = [
  { offset: 40, size: 26, delay: 0 },
  { offset: 72, size: 34, delay: 0.5 },
  { offset: 108, size: 40, delay: 1 },
]

/**
 * A wireframe tumbleweed with a GitHub badge at its core, rolling right to
 * left across the bottom of the section on an infinite loop — a nod to the
 * old western-showdown "tumbleweed rolls through frame" beat. Clicking it
 * opens the GitHub profile. Respects prefers-reduced-motion (static, centered).
 */
export const GithubTumbleweed = () => {
  const reduce = useReducedMotion()

  // Anchored to the bottom of the card stack's own stacking context (see
  // ProjectCarousel), z-5 sits below the cards (z 8-10) but above the grid
  // background (z-0) — so it visibly tucks behind the lower edge of
  // whichever card it's rolling past, while staying visible everywhere else.
  // `bottom` is set to (peek - ballSize): a negative offset that pushes the
  // ball mostly below the card stack while leaving exactly
  // PEEK_BEHIND_CARDS px of its top edge inside the container, tucked
  // behind whichever card sits above it. An explicit height is required —
  // every child here is itself position:absolute, so auto-height would
  // otherwise collapse this wrapper to 0 and break the offset math.
  const wrapperBottom = `calc(${PEEK_BEHIND_CARDS}px - ${BALL_SIZE})`

  if (reduce) {
    return (
      <div
        className="absolute left-0 right-0 flex justify-center pointer-events-none z-[5]"
        style={{ bottom: wrapperBottom, height: BALL_SIZE }}
      >
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
    <div
      className="absolute left-0 right-0 pointer-events-none z-[5]"
      style={{ bottom: wrapperBottom, height: BALL_SIZE }}
    >
      {/* Desert horizon line, right where the ball's underside touches ground */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: BALL_SIZE,
          background:
            'linear-gradient(90deg, transparent, rgba(212,165,116,0.35) 18%, rgba(212,165,116,0.35) 82%, transparent)',
          height: 1,
        }}
      />

      {/* Horizontal travel only — shadow, dust and bounce all live inside this so they track the ball across the screen */}
      <motion.div
        className="absolute left-0 top-0 pointer-events-auto"
        style={{ willChange: 'transform' }}
        animate={{ x: ['118vw', '-30vw'] }}
        transition={{ duration: 17, repeat: Infinity, ease: 'linear' }}
      >
        {/* Ground contact shadow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            top: `calc(${BALL_SIZE} + 6px)`,
            width: 110,
            height: 20,
            background: 'radial-gradient(ellipse, rgba(26,18,8,0.32), transparent 72%)',
            filter: 'blur(4px)',
          }}
        />

        {/* Kicked-up dust puffs trailing behind, each looping independently */}
        {DUST_PUFFS.map((d, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none rounded-full"
            style={{
              top: `calc(${BALL_SIZE} - 40px)`,
              right: d.offset,
              width: d.size,
              height: d.size * 0.7,
              background: 'radial-gradient(ellipse, rgba(212,165,116,0.4), rgba(212,165,116,0) 70%)',
              filter: 'blur(5px)',
            }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.6, 1.15, 1.4], x: [0, -16, -32] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut', delay: d.delay }}
          />
        ))}

        {/* Uneven ground bounce, independent of the cross-screen travel */}
        <motion.div
          animate={{ y: [0, -14, 0, -7, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Tumbling spin, its own independent timing */}
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: 'linear' }}
            whileHover={{ scale: 1.08 }}
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
      </motion.div>
    </div>
  )
}
