import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'

type KeycapTone = 'orange' | 'cream' | 'blue' | 'dark'
type KeycapSize = 'compact' | 'wide'

interface BaseProps {
  label: string
  icon: ReactNode
  tone?: KeycapTone
  size?: KeycapSize
  className?: string
}

type KeycapButtonProps = BaseProps &
  (
    | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
    | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
  )

const toneStyles: Record<KeycapTone, { base: string; top: string; label: string; icon: string }> = {
  orange: {
    base: '#c44a20',
    top: 'linear-gradient(145deg, #f06030, #e04820)',
    label: '#fff',
    icon: '#fff',
  },
  cream: {
    base: '#b5a890',
    top: 'linear-gradient(145deg, #f0e8d8, #e0d4c0)',
    label: '#3a2e20',
    icon: '#3a2e20',
  },
  blue: {
    base: '#1a4a8a',
    top: 'linear-gradient(145deg, #2e6fd4, #1a50a8)',
    label: '#fff',
    icon: '#fff',
  },
  dark: {
    base: '#111111',
    top: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
    label: '#fff',
    icon: '#fff',
  },
}

const sizeStyles: Record<KeycapSize, { baseWidth: string; baseHeight: string; inset: string; labelSize: string; iconSize: string; radius: string; shadow: string }> = {
  compact: {
    baseWidth: '72px',
    baseHeight: '72px',
    inset: '8px',
    labelSize: '10px',
    iconSize: '18px',
    radius: '14px',
    shadow: '0 6px 0 rgba(0, 0, 0, 0.35), 0 10px 16px rgba(0, 0, 0, 0.35)',
  },
  wide: {
    baseWidth: '200px',
    baseHeight: '70px',
    inset: '10px',
    labelSize: '13px',
    iconSize: '18px',
    radius: '12px',
    shadow: '0 7px 0 rgba(0, 0, 0, 0.25), 0 11px 18px rgba(0, 0, 0, 0.35)',
  },
}

export const KeycapButton = ({
  label,
  icon,
  tone = 'orange',
  size = 'wide',
  className = '',
  ...props
}: KeycapButtonProps) => {
  const toneStyle = toneStyles[tone]
  const sizeStyle = sizeStyles[size]
  const isLink = 'href' in props && typeof props.href === 'string'

  const sharedClassName = [
    'relative inline-flex select-none items-center justify-center align-middle',
    'transition-[transform,filter] duration-100 ease-out',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-[#1FA971]',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const inner = (
    <span
      className="flex items-end justify-center"
      style={{
        width: sizeStyle.baseWidth,
        height: sizeStyle.baseHeight,
        borderRadius: sizeStyle.radius,
        background: toneStyle.base,
        paddingBottom: size === 'wide' ? '5px' : '6px',
        boxShadow: sizeStyle.shadow,
      }}
    >
      <span
        className="flex flex-col items-center justify-center"
        style={{
          width: `calc(${sizeStyle.baseWidth} - ${sizeStyle.inset})`,
          height: `calc(${sizeStyle.baseHeight} - ${sizeStyle.inset})`,
          borderRadius: size === 'wide' ? '9px' : '10px',
          background: toneStyle.top,
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.22), inset 0 -2px 4px rgba(0,0,0,0.18)',
          color: toneStyle.label,
        }}
      >
        <span style={{ fontSize: sizeStyle.iconSize, lineHeight: 1, color: toneStyle.icon }}>{icon}</span>
        <span
          className="mt-1 text-center font-medium leading-none"
          style={{ fontSize: sizeStyle.labelSize, letterSpacing: '0.03em' }}
        >
          {label}
        </span>
      </span>
    </span>
  )

  const motionProps = {
    className: sharedClassName,
    whileTap: { y: 4, scale: 0.97, filter: 'brightness(0.93)' },
    whileHover: { y: -1, scale: 1.01 },
  }

  if (isLink) {
    const { href, ...anchorProps } = props as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

    return (
      <motion.a href={href} {...motionProps} {...anchorProps}>
        {inner}
      </motion.a>
    )
  }

  const { type = 'button', ...buttonProps } = props as ButtonHTMLAttributes<HTMLButtonElement>

  return (
    <motion.button type={type} {...motionProps} {...buttonProps}>
      {inner}
    </motion.button>
  )
}