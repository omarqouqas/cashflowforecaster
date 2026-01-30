'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { QuickReportsSection } from './quick-reports-section';
import { ExportHistorySection } from './export-history-section';
import { ExportBuilderModal } from './export-builder-modal';
import type { ExportHistoryItem, ExportFormat, ReportType } from '@/lib/export/types';

interface ReportsPageContentProps {
  userId: string;
  exportLimits: {
    tier: string;
    allowedFormats: ExportFormat[];
    allowedReports: string[];
    historyLimit: number | null;
  };
  exportHistory: ExportHistoryItem[];
}

export function ReportsPageContent({
  userId,
  exportLimits,
  exportHistory: initialHistory,
}: ReportsPageContentProps) {
  const [showExportBuilder, setShowExportBuilder] = useState(false);
  const [exportHistory, setExportHistory] = useState(initialHistory);
  const [preSelectedReport, setPreSelectedReport] = useState<ReportType | undefined>();

  const isPro = exportLimits.tier === 'pro' || exportLimits.tier === 'premium' || exportLimits.tier === 'lifetime';

  const handleQuickExport = (reportType: ReportType) => {
    setPreSelectedReport(reportType);
    setShowExportBuilder(true);
  };

  const handleCustomExport = () => {
    setPreSelectedReport(undefined);
    setShowExportBuilder(true);
  };

  const handleExportComplete = (newExport: ExportHistoryItem) => {
    setExportHistory((prev) => [newExport, ...prev]);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-zinc-400 hover:text-teal-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Reports & Export</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Generate reports and export your financial data
          </p>
        </div>
        <button
          onClick={handleCustomExport}
          className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Custom Export
        </button>
      </div>

      {/* Quick Reports Section */}
      <QuickReportsSection
        allowedReports={exportLimits.allowedReports}
        isPro={isPro}
        onSelectReport={handleQuickExport}
      />

      {/* Export History Section */}
      <ExportHistorySection
        history={exportHistory}
        historyLimit={exportLimits.historyLimit}
        isPro={isPro}
      />

      {/* Export Builder Modal */}
      <ExportBuilderModal
        open={showExportBuilder}
        onClose={() => setShowExportBuilder(false)}
        userId={userId}
        exportLimits={exportLimits}
        preSelectedReport={preSelectedReport}
        onExportComplete={handleExportComplete}
      />
    </>
  );
}
