'use client'

import { memo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface FlipButtonProps {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled: boolean
  transform?: string
}

export const FlipButton = memo(function FlipButton({
  direction,
  onClick,
  disabled,
  transform = 'none'
}: FlipButtonProps) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
  const label = direction === 'prev' ? 'Página anterior' : 'Próxima página'

  return (
    <button
      className="flip-btn"
      onClick={onClick}
      style={{ transform }}
      disabled={disabled}
      aria-label={label}
      type="button"
    >
      <Icon size={64} className="style-arrow" />
    </button>
  )
})
