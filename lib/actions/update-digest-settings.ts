'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { captureServerEvent } from '@/lib/posthog/server';

const DigestSettingsSchema = z.object({
  emailDigestEnabled: z.coerce.boolean(),
  emailDigestDay: z.coerce.number().min(0).max(6),
  // Keep column in DB for future upgrades. Optional for now (Vercel Hobby cron runs daily).
  emailDigestTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
});

export async function updateDigestSettings(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    const parsed = DigestSettingsSchema.safeParse({
      emailDigestEnabled: formData.get('emailDigestEnabled'),
      emailDigestDay: formData.get('emailDigestDay'),
      emailDigestTime: formData.get('emailDigestTime'),
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid settings' };
    }

    const { emailDigestEnabled, emailDigestDay, emailDigestTime } = parsed.data;

    const upsertRow: {
      user_id: string;
      email_digest_enabled: boolean;
      email_digest_day: number;
      email_digest_time?: string;
    } = {
      user_id: user.id,
      email_digest_enabled: emailDigestEnabled,
      email_digest_day: emailDigestDay,
    };

    // Only update time if provided (backwards compatible + preserves existing value)
    if (emailDigestTime) {
      upsertRow.email_digest_time = `${emailDigestTime}:00`;
    }

    const { error } = await supabase
      .from('user_settings')
      .upsert(
        upsertRow,
        { onConflict: 'user_id' }
      );

    if (error) return { success: false, error: error.message };

    await captureServerEvent('digest_settings_updated', {
      distinctId: user.id,
      properties: {
        enabled: emailDigestEnabled,
        day: emailDigestDay,
        ...(emailDigestTime ? { time: emailDigestTime } : {}),
      },
    });

    revalidatePath('/dashboard/settings');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message ?? 'Failed to update settings' };
  }
}


