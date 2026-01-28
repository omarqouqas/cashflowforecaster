'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Info } from 'lucide-react'

interface TooltipProps {
  content: React.ReactNode
  children?: React.ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Close on click outside
  useEffect(() => {
    if (!isVisible) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isVisible])

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="p-1 text-teal-500 hover:text-teal-700 transition-colors rounded-full hover:bg-teal-100"
        aria-label="More information"
      >
        {children || <Info className="w-4 h-4" />}
      </button>

      {isVisible && (
        <div
          ref={tooltipRef}
          className="absolute z-50 w-72 p-3 mt-2 text-sm bg-zinc-900 text-zinc-100 rounded-lg shadow-lg border border-zinc-700 left-1/2 -translate-x-1/2"
          role="tooltip"
        >
          {content}
          {/* Arrow */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 border-l border-t border-zinc-700 rotate-45" />
        </div>
      )}
    </div>
  )
}

export function InfoTooltip({ content }: { content: React.ReactNode }) {
  return (
    <Tooltip content={content}>
      <Info className="w-4 h-4" />
    </Tooltip>
  )
}
