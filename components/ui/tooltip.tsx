'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Info } from 'lucide-react'

interface TooltipProps {
  content: React.ReactNode
  children?: React.ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Update tooltip position when visible
  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 8,
      })
    }
  }, [isVisible])

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

      {isVisible && typeof document !== 'undefined' && createPortal(
        <div
          ref={tooltipRef}
          className="fixed z-[9999] w-80 p-4 text-sm bg-zinc-900 text-zinc-100 rounded-lg shadow-xl border border-zinc-700"
          style={{
            top: position.top,
            left: position.left,
            transform: 'translateY(-50%)',
          }}
          role="tooltip"
        >
          {content}
          {/* Arrow pointing left */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-zinc-900 border-l border-b border-zinc-700 rotate-45" />
        </div>,
        document.body
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
