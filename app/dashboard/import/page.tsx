import { requireAuth } from '@/lib/auth/session';
import { getUserUsageStats } from '@/lib/stripe/feature-gate';
import { ImportPageClient } from '@/components/import/import-page-client';

export default async function ImportPage() {
  const user = await requireAuth();
  const usage = await getUserUsageStats(user.id);

  // Infinity is not serializable to client components; normalize to null = unlimited
  const safeUsage = {
    tier: usage.tier,
    bills: { current: usage.bills.current, limit: usage.bills.limit === Infinity ? null : usage.bills.limit },
    income: { current: usage.income.current, limit: usage.income.limit === Infinity ? null : usage.income.limit },
  };

  return <ImportPageClient userId={user.id} usage={safeUsage} />;
}


