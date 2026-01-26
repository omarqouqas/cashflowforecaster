'use client';

import { BarChart3, PieChart, TrendingUp, Database, Lock } from 'lucide-react';
import type { ReportType } from '@/lib/export/types';

interface QuickReportsSectionProps {
  allowedReports: string[];
  isPro: boolean;
  onSelectReport: (reportType: ReportType) => void;
}

const QUICK_REPORTS: Array<{
  id: ReportType;
  name: string;
  description: string;
  icon: typeof BarChart3;
  requiredTier: 'free' | 'pro';
}> = [
  {
    id: 'monthly_summary',
    name: 'Monthly Summary',
    description: 'Income vs expenses, net cash flow',
    icon: BarChart3,
    requiredTier: 'free',
  },
  {
    id: 'category_spending',
    name: 'Category Spending',
    description: 'Breakdown by category with percentages',
    icon: PieChart,
    requiredTier: 'free',
  },
  {
    id: 'cash_forecast',
    name: 'Cash Forecast',
    description: 'Daily projected balances',
    icon: TrendingUp,
    requiredTier: 'pro',
  },
  {
    id: 'all_data',
    name: 'All Data',
    description: 'Complete backup of your data',
    icon: Database,
    requiredTier: 'pro',
  },
];

export function QuickReportsSection({
  allowedReports,
  isPro,
  onSelectReport,
}: QuickReportsSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-zinc-100 mb-4">Quick Reports</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_REPORTS.map((report) => {
          const Icon = report.icon;
          const isAllowed = allowedReports.includes(report.id);
          const isLocked = !isAllowed && !isPro;

          return (
            <button
              key={report.id}
              onClick={() => !isLocked && onSelectReport(report.id)}
              disabled={isLocked}
              className={[
                'relative flex flex-col items-center p-6 rounded-xl border transition-all text-center',
                isLocked
                  ? 'bg-zinc-900/50 border-zinc-800 cursor-not-allowed opacity-60'
                  : 'bg-zinc-900 border-zinc-800 hover:border-teal-500/50 hover:bg-zinc-800/50 cursor-pointer',
              ].join(' ')}
            >
              {/* Pro Badge */}
              {report.requiredTier === 'pro' && !isPro && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-400">
                  <Lock className="w-3 h-3" />
                  Pro
                </div>
              )}

              {/* Icon */}
              <div
                className={[
                  'w-12 h-12 rounded-xl flex items-center justify-center mb-3',
                  isLocked ? 'bg-zinc-800' : 'bg-teal-500/10',
                ].join(' ')}
              >
                <Icon
                  className={['w-6 h-6', isLocked ? 'text-zinc-500' : 'text-teal-400'].join(' ')}
                />
              </div>

              {/* Title */}
              <h3
                className={[
                  'font-medium mb-1',
                  isLocked ? 'text-zinc-500' : 'text-zinc-100',
                ].join(' ')}
              >
                {report.name}
              </h3>

              {/* Description */}
              <p className={['text-sm', isLocked ? 'text-zinc-600' : 'text-zinc-400'].join(' ')}>
                {report.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
