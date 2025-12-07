'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Check, X } from 'lucide-react'

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
      className={`
        inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium
        transition-all duration-200
        cursor-pointer hover:opacity-80
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:cursor-wait disabled:opacity-70
        ${
          isActive
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
        }
      `}
      title={`Click to ${isActive ? 'deactivate' : 'activate'} ${itemName}`}
    >
      {isActive ? (
        <Check className="w-3 h-3" />
      ) : (
        <X className="w-3 h-3" />
      )}
      <span>{isActive ? 'Active' : 'Inactive'}</span>
    </button>
  )
}

