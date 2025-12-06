'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { AlertCircle } from 'lucide-react'

interface EmailVerificationBannerProps {
  user: User
}

export function EmailVerificationBanner({ user }: EmailVerificationBannerProps) {
  // Debug logging (remove in production)
  useEffect(() => {
    console.log('EmailVerificationBanner - User:', user)
    console.log('Email confirmed at:', user.email_confirmed_at)
    console.log('Should show banner:', !user.email_confirmed_at)
  }, [user])

  const [isResending, setIsResending] = useState(false)
  const [resent, setResent] = useState(false)

  const supabase = createClient()

  // Don't show if email is already confirmed
  if (user.email_confirmed_at) {
    return null
  }

  const handleResend = async () => {
    setIsResending(true)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email!
    })

    if (!error) {
      setResent(true)
      setTimeout(() => setResent(false), 5000) // Hide after 5 seconds
    }
    setIsResending(false)
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-4 rounded-r-lg">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Verify your email address
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            We sent a verification email to <strong>{user.email}</strong>.
            Please check your inbox and click the verification link.
          </p>
        </div>
        <button
          onClick={handleResend}
          disabled={isResending || resent}
          className="ml-4 text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100 underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline transition-colors"
        >
          {resent ? 'Email sent!' : isResending ? 'Sending...' : 'Resend email'}
        </button>
      </div>
    </div>
  )
}

