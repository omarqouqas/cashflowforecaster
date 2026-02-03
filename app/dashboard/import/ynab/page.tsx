import { requireAuth } from '@/lib/auth/session';
import { getUserUsageStats } from '@/lib/stripe/feature-gate';
import { YnabImportPageClient } from '@/components/import/ynab-import-page-client';

export default async function YnabImportPage() {
  const user = await requireAuth();
  const usage = await getUserUsageStats(user.id);

  // Infinity is not serializable to client components; normalize to null = unlimited
  const safeUsage = {
    tier: usage.tier,
    bills: { current: usage.bills.current, limit: usage.bills.limit === Infinity ? null : usage.bills.limit },
    income: { current: usage.income.current, limit: usage.income.limit === Infinity ? null : usage.income.limit },
  };

  return <YnabImportPageClient userId={user.id} usage={safeUsage} />;
}
