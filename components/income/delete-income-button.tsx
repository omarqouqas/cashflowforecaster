'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface DeleteIncomeButtonProps {
  incomeId: string
  incomeName: string
}

export function DeleteIncomeButton({ incomeId, incomeName }: DeleteIncomeButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  
  const handleDelete = async () => {
    setIsDeleting(true)
    
    const supabase = createClient()
    
    const { error } = await supabase
      .from('income')
      .delete()
      .eq('id', incomeId)
    
    if (error) {
      alert('Error deleting income: ' + error.message)
      setIsDeleting(false)
    } else {
      router.push('/dashboard/income?success=income-deleted')
      router.refresh()
    }
  }
  
  if (!isConfirming) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsConfirming(true)}
        title="Delete income source"
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
      >
        Cancel
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  )
}

