'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'

interface UserMenuProps {
  user: User
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-50 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-medium">
          {user.email?.[0].toUpperCase()}
        </div>
        <span className="text-sm hidden sm:block text-zinc-700">
          {user.email}
        </span>
        <svg
          className={`w-4 h-4 text-zinc-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-md border border-zinc-200 z-50">
          <div className="px-4 py-3 border-b border-zinc-200">
            <p className="text-sm text-zinc-900 font-medium">
              {user.email}
            </p>
          </div>

          <div className="py-1">
            <Link
              href="/dashboard/settings"
              className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-zinc-50 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

