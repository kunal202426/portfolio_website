import { motion, useReducedMotion, useSpring, useScroll, useVelocity } from 'framer-motion'
import { useEffect, useRef, useState, type CSSProperties } from 'react'

type CharacterVariant = 'bouncer' | 'hanger'

interface KeycapCharacterProps {
  variant: CharacterVariant
  className?: string
  style?: CSSProperties
}

type Palette = {
  light: string
  mid: string
  panel: string
  visor: string
  glow: string
  bolt: string
  line: string
}

const PALETTES: Record<CharacterVariant, Palette> = {
  // Steel robot — pops against the orange button
  bouncer: {
    light: '#E3E6EC',
    mid: '#B9BEC9',
    panel: '#2E3440',
    visor: '#0E1116',
    glow: '#38E1E1',
    bolt: '#8A909C',
    line: '#767C88',
  },
  // Orange robot — pops against the cream button
  hanger: {
    light: '#F5793B',
    mid: '#E0561F',
    panel: '#7A2E0E',
    visor: '#180B04',
    glow: '#FFD27A',
    bolt: '#B5561F',
    line: '#A2380F',
  },
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

/**
 * Boxy robot characters that constantly play on the keycap buttons:
 *  - `bouncer` stands on the button and does a squash-and-stretch jump loop
 *  - `hanger`  grips the button's bottom edge and does bouncy pull-ups
 *
 * On top of the idle loops they are REACTIVE: they lean/turn toward the mouse
 * cursor on pointer devices (laptops), and sway with scroll velocity on touch
 * devices (phones). Decorative only (pointer-events-none) and respects
 * prefers-reduced-motion.
 */
export const KeycapCharacter = ({ variant, className = '', style }: KeycapCharacterProps) => {
  const reduce = useReducedMotion()
  const p = PALETTES[variant]
  const svgRef = useRef<SVGSVGElement>(null)
  const [isTouch, setIsTouch] = useState(false)

  // Reactive lean (degrees) + horizontal shift (user units), spring-smoothed
  const rotate = useSpring(0, { stiffness: 110, damping: 13, mass: 0.4 })
  const shiftX = useSpring(0, { stiffness: 110, damping: 13, mass: 0.4 })

  // Detect touch vs pointer once on mount
  useEffect(() => {
    setIsTouch(!window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])

  // Laptop/desktop: lean toward the mouse cursor
  useEffect(() => {
    if (reduce || isTouch) return
    let raf = 0
    const onMove = (e: MouseEvent) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const el = svgRef.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const nx = clamp((e.clientX - cx) / 340, -1, 1)
        rotate.set(nx * (variant === 'hanger' ? 20 : 15))
        shiftX.set(nx * 6)
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduce, isTouch, variant, rotate, shiftX])

  // Phone/touch: sway with scroll velocity, settling back to rest when idle
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  useEffect(() => {
    if (reduce || !isTouch) return
    const unsubscribe = scrollVelocity.on('change', (v) => {
      const n = clamp(v / 2200, -1, 1)
      rotate.set(n * (variant === 'hanger' ? 22 : 16))
      shiftX.set(n * 5)
    })
    return () => unsubscribe()
  }, [reduce, isTouch, variant, rotate, shiftX, scrollVelocity])

  const reactiveOrigin = variant === 'bouncer' ? 'bottom center' : 'top center'
  const reactiveStyle = {
    rotate,
    x: shiftX,
    transformBox: 'fill-box' as const,
    transformOrigin: reactiveOrigin,
  }

  // Glowing visor eyes (shared)
  const Eyes = ({ x, y }: { x: number; y: number }) => (
    <>
      <rect x={x} y={y} width={5.5} height={4} rx={1.4} fill={p.glow} opacity={0.4} />
      <rect x={x + 8.5} y={y} width={5.5} height={4} rx={1.4} fill={p.glow} opacity={0.4} />
      <motion.g
        animate={reduce ? undefined : { opacity: [1, 0.45, 1] }}
        transition={reduce ? undefined : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x={x + 1} y={y + 0.8} width={3.5} height={2.4} rx={1} fill="#fff" />
        <rect x={x + 9.5} y={y + 0.8} width={3.5} height={2.4} rx={1} fill="#fff" />
      </motion.g>
    </>
  )

  const Bolt = ({ cx, cy }: { cx: number; cy: number }) => (
    <circle cx={cx} cy={cy} r={1.2} fill={p.bolt} stroke={p.line} strokeWidth={0.4} />
  )

  if (variant === 'bouncer') {
    return (
      <svg ref={svgRef} width={52} height={56} viewBox="0 0 56 60" className={className} style={style} aria-hidden="true" role="presentation">
        {/* Reactive lean toward mouse (desktop) / scroll (mobile) */}
        <motion.g style={reactiveStyle}>
        {/* Wandering drift + lean so it never sits dead-center */}
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: 'bottom center' }}
          animate={reduce ? undefined : { x: [-6, 7, -6], rotate: [-3, 3, -3] }}
          transition={reduce ? undefined : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        >
        {/* Ground shadow that shrinks as the robot leaps */}
        <motion.ellipse
          cx={28}
          cy={57}
          rx={13}
          ry={2.6}
          fill="#000"
          opacity={0.18}
          animate={reduce ? undefined : { rx: [13, 8, 13], opacity: [0.18, 0.08, 0.18] }}
          transition={reduce ? undefined : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />

        {/* Jump loop: crouch -> launch -> squash on landing */}
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: 'bottom center' }}
          animate={reduce ? undefined : { y: [0, -3, -20, -20, -3, 0, 0], scaleY: [0.82, 1.12, 1, 1, 1.1, 0.82, 0.82], scaleX: [1.12, 0.92, 1, 1, 0.94, 1.12, 1.12] }}
          transition={reduce ? undefined : { duration: 1.4, times: [0, 0.14, 0.34, 0.5, 0.72, 0.86, 1], repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Legs + feet */}
          <rect x={19} y={45} width={7} height={9} rx={2} fill={p.mid} stroke={p.line} strokeWidth={0.7} />
          <rect x={30} y={45} width={7} height={9} rx={2} fill={p.mid} stroke={p.line} strokeWidth={0.7} />
          <rect x={16.5} y={52} width={11} height={4.5} rx={1.6} fill={p.panel} />
          <rect x={28.5} y={52} width={11} height={4.5} rx={1.6} fill={p.panel} />

          {/* Arms raised on launch */}
          <motion.rect
            x={7} y={28} width={5.5} height={15} rx={2.5} fill={p.light} stroke={p.line} strokeWidth={0.7}
            style={{ transformBox: 'fill-box', transformOrigin: 'top center' }}
            animate={reduce ? undefined : { rotate: [12, -28, 12] }}
            transition={reduce ? undefined : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.rect
            x={43.5} y={28} width={5.5} height={15} rx={2.5} fill={p.light} stroke={p.line} strokeWidth={0.7}
            style={{ transformBox: 'fill-box', transformOrigin: 'top center' }}
            animate={reduce ? undefined : { rotate: [-12, 28, -12] }}
            transition={reduce ? undefined : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Torso */}
          <rect x={13} y={26} width={30} height={21} rx={6} fill={p.mid} stroke={p.line} strokeWidth={0.8} />
          <rect x={19} y={30} width={18} height={12} rx={2.5} fill={p.panel} />
          {/* Chest LEDs */}
          <motion.g
            animate={reduce ? undefined : { opacity: [1, 0.4, 1] }}
            transition={reduce ? undefined : { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx={23} cy={34} r={1.6} fill={p.glow} />
            <circle cx={28} cy={34} r={1.6} fill={p.glow} />
            <circle cx={33} cy={34} r={1.6} fill={p.glow} />
          </motion.g>
          <rect x={21} y={38} width={14} height={2} rx={1} fill={p.mid} opacity={0.6} />
          <Bolt cx={16} cy={29} />
          <Bolt cx={40} cy={29} />
          <Bolt cx={16} cy={44} />
          <Bolt cx={40} cy={44} />

          {/* Neck */}
          <rect x={24} y={23} width={8} height={4} rx={1.5} fill={p.mid} stroke={p.line} strokeWidth={0.5} />

          {/* Side audio units */}
          <rect x={12} y={13} width={3.5} height={7} rx={1.5} fill={p.mid} stroke={p.line} strokeWidth={0.5} />
          <rect x={40.5} y={13} width={3.5} height={7} rx={1.5} fill={p.mid} stroke={p.line} strokeWidth={0.5} />

          {/* Head */}
          <rect x={15} y={5} width={26} height={19} rx={5} fill={p.light} stroke={p.line} strokeWidth={0.8} />
          <rect x={18} y={11} width={20} height={8} rx={3} fill={p.visor} />
          <Eyes x={20} y={13} />

          {/* Antenna */}
          <line x1={28} y1={5} x2={28} y2={1.5} stroke={p.line} strokeWidth={1.4} strokeLinecap="round" />
          <motion.circle
            cx={28} cy={1.4} r={2.1} fill={p.glow}
            animate={reduce ? undefined : { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
            transition={reduce ? undefined : { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          />
        </motion.g>
        </motion.g>
        </motion.g>
      </svg>
    )
  }

  // Hanger — grips the button's bottom edge, does bouncy pull-ups, legs kicking
  return (
    <svg ref={svgRef} width={48} height={60} viewBox="0 0 52 66" className={className} style={style} aria-hidden="true" role="presentation">
      {/* Reactive lean toward mouse (desktop) / scroll (mobile) */}
      <motion.g style={reactiveStyle}>
      {/* Pendulum swing around the grip so it sways while hanging */}
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: 'top center' }}
        animate={reduce ? undefined : { rotate: [-9, 9, -9] }}
        transition={reduce ? undefined : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      >
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: 'top center' }}
        animate={reduce ? undefined : { y: [0, -18, -14, 0], scaleY: [1, 1.02, 1, 1] }}
        transition={reduce ? undefined : { duration: 1.25, times: [0, 0.45, 0.62, 1], repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Arms reaching up to grip the rim */}
        <rect x={17} y={7} width={5.5} height={17} rx={2.5} fill={p.mid} stroke={p.line} strokeWidth={0.7} transform="rotate(7 19.5 15)" />
        <rect x={29.5} y={7} width={5.5} height={17} rx={2.5} fill={p.mid} stroke={p.line} strokeWidth={0.7} transform="rotate(-7 32.5 15)" />
        {/* Gripping claws */}
        <rect x={15.5} y={2.5} width={7} height={5} rx={1.6} fill={p.panel} />
        <rect x={29.5} y={2.5} width={7} height={5} rx={1.6} fill={p.panel} />

        {/* Legs kicking */}
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: 'top' }}
          animate={reduce ? undefined : { rotate: [18, -14, 18] }}
          transition={reduce ? undefined : { duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}
        >
          <rect x={17.5} y={50} width={6} height={12} rx={2} fill={p.mid} stroke={p.line} strokeWidth={0.7} />
          <rect x={15.5} y={60} width={10} height={4} rx={1.5} fill={p.panel} />
        </motion.g>
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: 'top' }}
          animate={reduce ? undefined : { rotate: [-14, 18, -14] }}
          transition={reduce ? undefined : { duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}
        >
          <rect x={28.5} y={50} width={6} height={12} rx={2} fill={p.mid} stroke={p.line} strokeWidth={0.7} />
          <rect x={26.5} y={60} width={10} height={4} rx={1.5} fill={p.panel} />
        </motion.g>

        {/* Torso */}
        <rect x={13} y={35} width={26} height={18} rx={5} fill={p.mid} stroke={p.line} strokeWidth={0.8} />
        <rect x={18} y={39} width={16} height={10} rx={2.5} fill={p.panel} />
        <motion.g
          animate={reduce ? undefined : { opacity: [1, 0.4, 1] }}
          transition={reduce ? undefined : { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx={22.5} cy={44} r={1.5} fill={p.glow} />
          <circle cx={26} cy={44} r={1.5} fill={p.glow} />
          <circle cx={29.5} cy={44} r={1.5} fill={p.glow} />
        </motion.g>
        <Bolt cx={16} cy={38} />
        <Bolt cx={36} cy={38} />
        <Bolt cx={16} cy={50} />
        <Bolt cx={36} cy={50} />

        {/* Neck */}
        <rect x={22} y={32} width={8} height={4} rx={1.5} fill={p.mid} stroke={p.line} strokeWidth={0.5} />

        {/* Side audio units */}
        <rect x={11} y={22} width={3.5} height={7} rx={1.5} fill={p.mid} stroke={p.line} strokeWidth={0.5} />
        <rect x={37.5} y={22} width={3.5} height={7} rx={1.5} fill={p.mid} stroke={p.line} strokeWidth={0.5} />

        {/* Head */}
        <rect x={14} y={15} width={24} height={18} rx={5} fill={p.light} stroke={p.line} strokeWidth={0.8} />
        <rect x={17} y={20} width={18} height={8} rx={3} fill={p.visor} />
        <Eyes x={19} y={22} />

        {/* Antenna */}
        <line x1={26} y1={15} x2={26} y2={11.5} stroke={p.line} strokeWidth={1.4} strokeLinecap="round" />
        <motion.circle
          cx={26} cy={11.4} r={2.1} fill={p.glow}
          animate={reduce ? undefined : { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
          transition={reduce ? undefined : { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
      </motion.g>
      </motion.g>
      </motion.g>
    </svg>
  )
}
