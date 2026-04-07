import { ButtonHTMLAttributes } from 'react'

interface BrutalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  tone?: 'default' | 'on-dark'
  arrow?: string
}

export const BrutalButton = ({
  children,
  className = '',
  tone = 'default',
  arrow = '→',
  type = 'button',
  ...props
}: BrutalButtonProps) => {
  const toneClass = tone === 'on-dark' ? 'brutal-btn--on-dark' : ''
  const finalClassName = ['brutal-btn', toneClass, className].filter(Boolean).join(' ')

  return (
    <button type={type} className={finalClassName} {...props}>
      <span>{children}</span>
      <span className="arrow" aria-hidden="true">
        {arrow}
      </span>
    </button>
  )
}
