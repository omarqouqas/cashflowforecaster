'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface DeleteAccountButtonProps {
  accountId: string
  accountName: string
}

export function DeleteAccountButton({ accountId, accountName }: DeleteAccountButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)

    const supabase = createClient()

    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', accountId)

    if (error) {
      alert('Error deleting account: ' + error.message)
      setIsDeleting(false)
    } else {
      router.push('/dashboard/accounts?success=account-deleted')
      router.refresh() // Refresh to update list
    }
  }

  if (!isConfirming) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsConfirming(true)}
        aria-label={`Delete ${accountName}`}
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
      >
        Cancel
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={handleDelete}
        disabled={isDeleting}
        loading={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Confirm Delete'}
      </Button>
    </div>
  )
}

