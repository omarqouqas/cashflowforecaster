import 'server-only';

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

function requireEnv(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`Missing ${name} environment variable`);
  return v;
}

/**
 * Supabase service-role client for server-to-server operations (cron/webhooks/unsubscribe).
 * Never expose this key to the browser.
 */
export function createAdminClient() {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  const serviceKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

  return createClient<Database>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}


