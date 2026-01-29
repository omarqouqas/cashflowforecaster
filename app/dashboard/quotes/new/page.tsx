import { redirect } from 'next/navigation';
import { canUseInvoicing } from '@/lib/stripe/subscription';
import { NewQuoteForm } from '@/components/quotes/new-quote-form';
import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';

export default async function NewQuotePage() {
  const hasAccess = await canUseInvoicing();
  if (!hasAccess) {
    redirect('/dashboard/quotes');
  }

  // Get user's default currency
  const user = await requireAuth();
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from('user_settings')
    .select('currency')
    .eq('user_id', user.id)
    .single();

  const defaultCurrency = settings?.currency ?? 'USD';

  return <NewQuoteForm defaultCurrency={defaultCurrency} />;
}
