'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface ActiveToggleButtonProps {
  id: string
  isActive: boolean
  tableName: 'bills' | 'income'
  itemName: string
}

export function ActiveToggleButton({
  id,
  isActive: initialIsActive,
  tableName,
  itemName,
}: ActiveToggleButtonProps) {
  const [isActive, setIsActive] = useState(initialIsActive)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    // Optimistic UI update
    const previousState = isActive
    setIsActive(!isActive)
    setIsLoading(true)

    try {
      const supabase = createClient()
      const newActiveState = !previousState

      const { error } = await supabase
        .from(tableName)
        .update({ is_active: newActiveState })
        .eq('id', id)

      if (error) {
        // Revert optimistic update on error
        setIsActive(previousState)
        console.error(`Error updating ${tableName}:`, error)
        alert(`Error updating ${itemName}: ${error.message}`)
      } else {
        // Success - refresh the router to sync with server state
        router.refresh()
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsActive(previousState)
      console.error(`Unexpected error updating ${tableName}:`, error)
      alert(
        `Unexpected error updating ${itemName}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      type="button"
      role="switch"
      aria-checked={isActive}
      aria-label={`${itemName} is ${isActive ? 'active' : 'inactive'}. Click to ${
        isActive ? 'deactivate' : 'activate'
      }.`}
      className={[
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        isActive ? 'bg-emerald-500' : 'bg-zinc-200',
        'focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2',
        isLoading ? 'opacity-50 cursor-not-allowed' : '',
      ].join(' ')}
      title={`Click to ${isActive ? 'deactivate' : 'activate'} ${itemName}`}
    >
      <span className="sr-only">{isActive ? 'Active' : 'Inactive'}</span>
      <span
        className={[
          'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform',
          isActive ? 'translate-x-6' : 'translate-x-1',
        ].join(' ')}
      />
    </button>
  )
}

