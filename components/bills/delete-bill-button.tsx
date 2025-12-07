'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

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
      alert('Error deleting bill: ' + error.message)
      setIsDeleting(false)
      setIsConfirming(false)
    } else {
      router.refresh()
    }
  }

  if (!isConfirming) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsConfirming(true)}
        title="Delete bill"
        className="border-red-500 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-500 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsConfirming(false)}
        disabled={isDeleting}
        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        Cancel
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex-1"
      >
        {isDeleting ? 'Deleting...' : 'Confirm'}
      </Button>
    </div>
  )
}

