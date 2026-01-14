'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const taxSettingsSchema = z.object({
  tax_rate: z.number().min(0).max(100),
  tax_tracking_enabled: z.boolean(),
  estimated_tax_q1_paid: z.number().min(0).optional(),
  estimated_tax_q2_paid: z.number().min(0).optional(),
  estimated_tax_q3_paid: z.number().min(0).optional(),
  estimated_tax_q4_paid: z.number().min(0).optional(),
})

export async function updateTaxSettings(data: z.infer<typeof taxSettingsSchema>) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Validate input
    const validated = taxSettingsSchema.parse(data)

    // Update settings
    const { error } = await supabase
      .from('user_settings')
      .update({
        tax_rate: validated.tax_rate,
        tax_tracking_enabled: validated.tax_tracking_enabled,
        estimated_tax_q1_paid: validated.estimated_tax_q1_paid ?? 0,
        estimated_tax_q2_paid: validated.estimated_tax_q2_paid ?? 0,
        estimated_tax_q3_paid: validated.estimated_tax_q3_paid ?? 0,
        estimated_tax_q4_paid: validated.estimated_tax_q4_paid ?? 0,
        tax_year: new Date().getFullYear(),
      })
      .eq('user_id', session.user.id)

    if (error) {
      console.error('Error updating tax settings:', error)
      return { success: false, error: 'Failed to update tax settings' }
    }

    revalidatePath('/dashboard/settings')
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error in updateTaxSettings:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid input data' }
    }
    return { success: false, error: 'Failed to update tax settings' }
  }
}
