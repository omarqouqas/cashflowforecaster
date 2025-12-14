'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface SpendableToggleButtonProps {
  id: string
  isSpendable: boolean
  accountName: string
}

export function SpendableToggleButton({
  id,
  isSpendable: initialIsSpendable,
  accountName,
}: SpendableToggleButtonProps) {
  const [isSpendable, setIsSpendable] = useState(initialIsSpendable)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    const previousState = isSpendable
    setIsSpendable(!isSpendable)
    setIsLoading(true)

    try {
      const supabase = createClient()
      const next = !previousState

      const { error } = await supabase
        .from('accounts')
        .update({ is_spendable: next })
        .eq('id', id)

      if (error) {
        setIsSpendable(previousState)
        console.error('Error updating account spendable:', error)
        alert(`Error updating ${accountName}: ${error.message}`)
      } else {
        router.refresh()
      }
    } catch (e) {
      setIsSpendable(previousState)
      console.error('Unexpected error updating account spendable:', e)
      alert(`Unexpected error updating ${accountName}: ${e instanceof Error ? e.message : 'Unknown error'}`)
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
      aria-checked={isSpendable}
      aria-label={`${accountName} is ${isSpendable ? 'spendable' : 'not spendable'}. Click to ${
        isSpendable ? 'disable' : 'enable'
      } spendable.`}
      className={[
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        isSpendable ? 'bg-teal-600' : 'bg-zinc-200',
        'focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2',
        isLoading ? 'opacity-50 cursor-not-allowed' : '',
      ].join(' ')}
      title={`Click to ${isSpendable ? 'disable' : 'enable'} spendable for ${accountName}`}
    >
      <span className="sr-only">{isSpendable ? 'Spendable' : 'Not spendable'}</span>
      <span
        className={[
          'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform',
          isSpendable ? 'translate-x-6' : 'translate-x-1',
        ].join(' ')}
      />
    </button>
  )
}
