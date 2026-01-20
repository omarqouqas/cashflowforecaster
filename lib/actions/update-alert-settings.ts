'use server';

import { createClient } from '@/lib/supabase/server';
import { captureServerEvent } from '@/lib/posthog/server';

export async function updateAlertSettings(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const lowBalanceAlertEnabled = formData.get('lowBalanceAlertEnabled') === 'true';

    const { error: dbError } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: user.id,
          low_balance_alert_enabled: lowBalanceAlertEnabled,
        },
        { onConflict: 'user_id' }
      );

    if (dbError) {
      console.error('Failed to update alert settings:', dbError);
      return { success: false, error: 'Failed to save settings' };
    }

    await captureServerEvent('alert_settings_updated', {
      distinctId: user.id,
      properties: {
        low_balance_alert_enabled: lowBalanceAlertEnabled,
      },
    });

    return { success: true };
  } catch (err) {
    console.error('updateAlertSettings error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
