'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'
import { showError, showSuccess } from '@/lib/toast'

interface DeleteBillButtonProps {
  billId: string
  billName: string
}

export function DeleteBillButton({ billId, billName }: DeleteBillButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)

    const supabase = createClient()

    const { error } = await supabase.from('bills').delete().eq('id', billId)

    if (error) {
      showError(error.message)
      setIsDeleting(false)
      setIsConfirming(false)
    } else {
      showSuccess('Deleted successfully')
      router.push('/dashboard/bills')
      router.refresh()
    }
  }

  if (!isConfirming) {
    return (
      <button
        onClick={() => setIsConfirming(true)}
        aria-label={`Delete ${billName}`}
        className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    )
  }

  return (
    <div
      className={[
        'flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-md px-3 py-1.5',
        isDeleting ? 'opacity-50 cursor-not-allowed' : '',
      ].join(' ')}
    >
      {isDeleting && (
        <svg
          className="animate-spin h-4 w-4 text-rose-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      <span className="text-sm text-rose-700">Delete?</span>

      <button
        type="button"
        onClick={() => setIsConfirming(false)}
        disabled={isDeleting}
        className="text-sm text-zinc-600 hover:text-zinc-900 px-2 py-1 disabled:pointer-events-none"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-sm font-medium text-rose-600 hover:text-rose-700 px-2 py-1 disabled:pointer-events-none"
      >
        Confirm
      </button>
    </div>
  )
}

