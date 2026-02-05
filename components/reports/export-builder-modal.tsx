'use client';

import { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Download,
  FileSpreadsheet,
  Lock,
  ChevronRight,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { showError, showSuccess } from '@/lib/toast';
import type {
  ExportFormat,
  ReportType,
  DataInclude,
  DateRangePreset,
  ExportConfig,
  ExportHistoryItem,
} from '@/lib/export/types';
import { DATE_RANGE_PRESETS, FORMAT_OPTIONS, REPORT_TYPES } from '@/lib/export/types';

interface ExportBuilderModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  exportLimits: {
    tier: string;
    allowedFormats: ExportFormat[];
    allowedReports: string[];
    historyLimit: number | null;
  };
  preSelectedReport?: ReportType;
  onExportComplete: (newExport: ExportHistoryItem) => void;
}

const DATA_OPTIONS: Array<{ id: DataInclude; label: string; description: string }> = [
  { id: 'bills', label: 'Bills', description: 'Recurring expenses' },
  { id: 'income', label: 'Income', description: 'Income sources' },
  { id: 'accounts', label: 'Accounts', description: 'Account balances' },
  { id: 'invoices', label: 'Invoices', description: 'Invoice history' },
];

export function ExportBuilderModal({
  open,
  onClose,
  userId: _userId,
  exportLimits,
  preSelectedReport,
  onExportComplete,
}: ExportBuilderModalProps) {
  // userId available for future use (e.g., saved templates)
  const [mounted, setMounted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Form state
  const [reportType, setReportType] = useState<ReportType>('custom');
  const [selectedData, setSelectedData] = useState<DataInclude[]>(['bills', 'income']);
  const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset>('this_month');
  const [format, setFormat] = useState<ExportFormat>('csv');

  const isPro = exportLimits.tier === 'pro' || exportLimits.tier === 'premium' || exportLimits.tier === 'lifetime';

  // Initialize with preselected report if provided
  useEffect(() => {
    if (open && preSelectedReport) {
      setReportType(preSelectedReport);
      const reportConfig = REPORT_TYPES.find((r) => r.id === preSelectedReport);
      if (reportConfig?.defaultConfig) {
        if (reportConfig.defaultConfig.includes) {
          setSelectedData(reportConfig.defaultConfig.includes);
        }
        if (reportConfig.defaultConfig.format) {
          setFormat(reportConfig.defaultConfig.format);
        }
      }
    }
  }, [open, preSelectedReport]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setExportSuccess(false);
      setIsExporting(false);
    }
  }, [open]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape closes
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const handleDataToggle = (dataId: DataInclude) => {
    setSelectedData((prev) =>
      prev.includes(dataId) ? prev.filter((d) => d !== dataId) : [...prev, dataId]
    );
  };

  const handleExport = async () => {
    if (selectedData.length === 0) {
      showError('Please select at least one data type to export');
      return;
    }

    setIsExporting(true);

    try {
      // Get date range (using local timezone)
      const preset = DATE_RANGE_PRESETS.find((p) => p.id === dateRangePreset);
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const dateRange = preset?.getRange() ?? {
        start: today,
        end: today,
        preset: dateRangePreset,
      };

      const config: ExportConfig = {
        reportType,
        format,
        dateRange,
        includes: selectedData,
      };

      const response = await fetch('/api/exports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Export failed');
      }

      const result = await response.json();

      // For immediate download (small exports), we get the data directly
      if (result.downloadUrl) {
        // Trigger download
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = result.filename || 'export';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Add to history
      if (result.export) {
        onExportComplete(result.export);
      }

      setExportSuccess(true);
      showSuccess('Export generated successfully');

      // Close after short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  // Computed: estimate what will be exported
  const previewInfo = useMemo(() => {
    const types = selectedData.length;
    const datePreset = DATE_RANGE_PRESETS.find((p) => p.id === dateRangePreset);
    return {
      dataTypes: types,
      dateLabel: datePreset?.label ?? 'Custom',
      formatLabel: FORMAT_OPTIONS.find((f) => f.id === format)?.label ?? format.toUpperCase(),
    };
  }, [selectedData, dateRangePreset, format]);

  if (!mounted || !open) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={cn(
          'relative w-full sm:max-w-lg bg-zinc-900 border border-zinc-800 shadow-xl',
          'sm:rounded-2xl rounded-t-2xl',
          'max-h-[90vh] overflow-hidden flex flex-col'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">
                {preSelectedReport
                  ? REPORT_TYPES.find((r) => r.id === preSelectedReport)?.name ?? 'Export'
                  : 'Custom Export'}
              </h2>
              <p className="text-sm text-zinc-400">Configure your export</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Data Selection */}
          {!preSelectedReport && (
            <section>
              <h3 className="text-sm font-medium text-zinc-300 mb-3">What to export</h3>
              <div className="grid grid-cols-2 gap-2">
                {DATA_OPTIONS.map((option) => {
                  const isSelected = selectedData.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleDataToggle(option.id)}
                      className={cn(
                        'flex flex-col items-start p-3 rounded-lg border text-left transition-all',
                        isSelected
                          ? 'bg-teal-500/10 border-teal-500/50 text-teal-100'
                          : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:border-zinc-600'
                      )}
                    >
                      <span className="text-sm font-medium">{option.label}</span>
                      <span className="text-xs text-zinc-500">{option.description}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Date Range */}
          <section>
            <h3 className="text-sm font-medium text-zinc-300 mb-3">Date range</h3>
            <div className="flex flex-wrap gap-2">
              {DATE_RANGE_PRESETS.slice(0, 5).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setDateRangePreset(preset.id)}
                  className={cn(
                    'px-3 py-2 text-sm rounded-lg border transition-all',
                    dateRangePreset === preset.id
                      ? 'bg-teal-500/10 border-teal-500/50 text-teal-100'
                      : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </section>

          {/* Format Selection */}
          <section>
            <h3 className="text-sm font-medium text-zinc-300 mb-3">Format</h3>
            <div className="grid grid-cols-2 gap-2">
              {FORMAT_OPTIONS.map((option) => {
                const isSelected = format === option.id;
                const isLocked = option.requiresPro && !isPro;
                const isDisabled = isLocked || option.comingSoon;

                return (
                  <button
                    key={option.id}
                    onClick={() => !isDisabled && setFormat(option.id)}
                    disabled={isDisabled}
                    className={cn(
                      'relative flex flex-col items-start p-3 rounded-lg border text-left transition-all',
                      isDisabled
                        ? 'bg-zinc-800/30 border-zinc-800 cursor-not-allowed'
                        : isSelected
                          ? 'bg-teal-500/10 border-teal-500/50 text-teal-100'
                          : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:border-zinc-600'
                    )}
                  >
                    {option.comingSoon && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 text-zinc-500">
                        <span className="text-xs">Soon</span>
                      </div>
                    )}
                    {isLocked && !option.comingSoon && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 text-amber-400">
                        <Lock className="w-3 h-3" />
                        <span className="text-xs">Pro</span>
                      </div>
                    )}
                    <span
                      className={cn('text-sm font-medium', isDisabled && 'text-zinc-500')}
                    >
                      {option.label}
                    </span>
                    <span
                      className={cn('text-xs', isDisabled ? 'text-zinc-600' : 'text-zinc-500')}
                    >
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Preview */}
          <section className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-300 mb-2">Export summary</h3>
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <span>
                <strong className="text-zinc-200">{previewInfo.dataTypes}</strong> data type
                {previewInfo.dataTypes !== 1 && 's'}
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
              <span>
                <strong className="text-zinc-200">{previewInfo.dateLabel}</strong>
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
              <span>
                <strong className="text-zinc-200">{previewInfo.formatLabel}</strong>
              </span>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || exportSuccess || selectedData.length === 0}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all',
              exportSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-teal-600 hover:bg-teal-500 text-white',
              (isExporting || selectedData.length === 0) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : exportSuccess ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Exported!
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
