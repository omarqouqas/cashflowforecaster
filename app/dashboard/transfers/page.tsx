import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { TransfersContent } from '@/components/transfers/transfers-content';

export default async function TransfersPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  // Fetch transfers with account names
  const { data: transfers } = await supabase
    .from('transfers')
    .select(`
      *,
      from_account:accounts!transfers_from_account_id_fkey(id, name, account_type, current_balance),
      to_account:accounts!transfers_to_account_id_fkey(id, name, account_type, current_balance, credit_limit)
    `)
    .eq('user_id', user.id)
    .order('transfer_date', { ascending: true });

  // Fetch accounts for display and filtering
  const { data: accounts } = await supabase
    .from('accounts')
    .select('id, name, account_type, current_balance, credit_limit')
    .eq('user_id', user.id)
    .order('name');

  // Fetch user settings for currency
  const { data: settings } = await supabase
    .from('user_settings')
    .select('currency')
    .eq('user_id', user.id)
    .single();

  const currency = settings?.currency || 'USD';

  return (
    <TransfersContent
      transfers={(transfers || []) as any}
      accounts={(accounts || []) as any}
      currency={currency}
    />
  );
}
