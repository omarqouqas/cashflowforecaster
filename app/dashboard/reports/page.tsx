import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { getExportLimits } from '@/lib/stripe/feature-gate';
import { ReportsPageContent } from '@/components/reports/reports-page-content';
import type { ExportHistoryItem } from '@/lib/export/types';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  // Fetch export limits and history in parallel
  const [exportLimits, exportsResult] = await Promise.all([
    getExportLimits(user.id),
    supabase
      .from('exports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  // Handle potential table not existing yet (migration not run)
  const exportHistory: ExportHistoryItem[] = exportsResult.error
    ? []
    : (exportsResult.data as unknown as ExportHistoryItem[]) ?? [];

  // Serialize limits for client (Infinity -> null)
  const serializedLimits = {
    tier: exportLimits.tier,
    allowedFormats: exportLimits.allowedFormats,
    allowedReports: exportLimits.allowedReports,
    historyLimit: exportLimits.historyLimit === Infinity ? null : exportLimits.historyLimit,
  };

  return (
    <ReportsPageContent
      userId={user.id}
      exportLimits={serializedLimits}
      exportHistory={exportHistory}
    />
  );
}
