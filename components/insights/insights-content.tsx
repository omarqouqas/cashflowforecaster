'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles, TrendingUp, TrendingDown, Minus, Calendar, Users, Info, Bug } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import type { SerializedIncomePatternAnalysis, DataQuality, IncomeTrend } from '@/lib/forecasting/types';
import { SourceBreakdown } from './source-breakdown';
import { SeasonalitySection } from './seasonality-section';
import { ForecastChart } from './forecast-chart';

interface InsightsContentProps {
  analysis: SerializedIncomePatternAnalysis | null;
  currency?: string;
}

/**
 * Data quality configuration.
 */
const DATA_QUALITY_CONFIG: Record<
  DataQuality,
  { label: string; description: string; features: string[]; nextLevel: string | null; color: string; bg: string }
> = {
  basic: {
    label: 'Basic',
    description: 'Less than 3 months of payment history',
    features: ['Basic forecasting using default estimates'],
    nextLevel: 'Track more invoices to reach Moderate (3+ months)',
    color: 'text-zinc-700 dark:text-zinc-400',
    bg: 'bg-zinc-200 dark:bg-zinc-700',
  },
  moderate: {
    label: 'Moderate',
    description: '3-6 months of payment history',
    features: ['Basic pattern detection', 'Simple trend analysis'],
    nextLevel: 'Continue tracking to reach Good (6+ months)',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-500/20',
  },
  good: {
    label: 'Good',
    description: '6-12 months of payment history',
    features: ['Seasonality detection', 'Trend analysis', 'Improved forecasting accuracy'],
    nextLevel: 'Reach Excellent (12+ months) for full analysis',
    color: 'text-teal-700 dark:text-teal-400',
    bg: 'bg-teal-100 dark:bg-teal-500/20',
  },
  excellent: {
    label: 'Excellent',
    description: '12+ months of payment history',
    features: ['Full pattern analysis', 'High-confidence forecasts', 'Detailed seasonal insights', 'Reliable trend detection'],
    nextLevel: null,
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-500/20',
  },
};

/**
 * Trend configuration.
 */
const TREND_CONFIG: Record<
  IncomeTrend,
  { icon: typeof TrendingUp; color: string; label: string; description: string }
> = {
  growing: {
    icon: TrendingUp,
    color: 'text-emerald-600 dark:text-emerald-400',
    label: 'Growing',
    description: 'Income is trending upward',
  },
  stable: {
    icon: Minus,
    color: 'text-zinc-700 dark:text-zinc-400',
    label: 'Stable',
    description: 'Income is relatively consistent',
  },
  declining: {
    icon: TrendingDown,
    color: 'text-rose-600 dark:text-rose-400',
    label: 'Declining',
    description: 'Income is trending downward',
  },
};

/**
 * Empty state when no analysis is available.
 */
function EmptyState() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <Sparkles className="h-12 w-12 text-violet-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          No Income Data Yet
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Start tracking invoices and income to see AI-powered insights about your earning patterns.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard/invoices/new"
            className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Create an invoice
          </Link>
          <Link
            href="/dashboard/income"
            className="inline-flex items-center justify-center px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-600 transition-colors"
          >
            Add income
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * InsightsContent - Full page income pattern analysis.
 */
export function InsightsContent({
  analysis,
  currency = 'USD',
}: InsightsContentProps) {
  if (!analysis) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-teal-400 transition-colors group mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Income Insights</h1>
          </div>
          <EmptyState />
        </div>
      </div>
    );
  }

  const qualityConfig = DATA_QUALITY_CONFIG[analysis.dataQuality];
  const trendConfig = TREND_CONFIG[analysis.overallTrend];
  const TrendIcon = trendConfig.icon;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-teal-400 transition-colors group mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Income Insights</h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                AI-powered analysis of your income patterns
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded text-sm font-medium ${qualityConfig.bg} ${qualityConfig.color}`}
              >
                {qualityConfig.label}
              </span>
              <Sparkles className="h-5 w-5 text-violet-400" />
            </div>
          </div>
        </div>

        {/* Data Quality Explanation */}
        <div className="mb-6 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Data Quality: {qualityConfig.label}
                </span>
                <span className="text-xs text-zinc-600 dark:text-zinc-500">
                  ({analysis.monthsOfData} month{analysis.monthsOfData !== 1 ? 's' : ''} of data)
                </span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                {qualityConfig.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {qualityConfig.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  >
                    {feature}
                  </span>
                ))}
              </div>
              {qualityConfig.nextLevel && (
                <p className="text-xs text-teal-600 dark:text-teal-400">
                  {qualityConfig.nextLevel}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* 90-Day Forecast */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg p-4">
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
              90-Day Forecast
            </p>
            <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
              {formatCurrency(analysis.forecast90DaysP50, currency)}
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-1">
              {formatCurrency(analysis.forecast90DaysP10, currency)} &ndash;{' '}
              {formatCurrency(analysis.forecast90DaysP90, currency)}
            </p>
          </div>

          {/* Overall Trend */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg p-4">
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
              Overall Trend
            </p>
            <div className="flex items-center gap-2 mt-1">
              <TrendIcon className={`h-5 w-5 ${trendConfig.color}`} />
              <span className={`text-xl font-semibold ${trendConfig.color}`}>
                {trendConfig.label}
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-1">
              {Math.round(analysis.overallTrendConfidence * 100)}% confidence
            </p>
          </div>

          {/* Income Sources */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg p-4">
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
              Income Sources
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Users className="h-5 w-5 text-teal-400" />
              <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                {analysis.sourceCount}
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-1">
              Clients & income streams
            </p>
          </div>

          {/* Data History */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg p-4">
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
              Data History
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="h-5 w-5 text-violet-400" />
              <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                {analysis.monthsOfData}
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-1">
              months of payment data
            </p>
          </div>
        </div>

        {/* 90-Day Forecast Chart */}
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            90-Day Income Forecast
          </h2>
          <ForecastChart forecast={analysis.forecast} currency={currency} />
        </div>

        {/* Seasonality Section (if detected) */}
        {analysis.seasonalityDetected && analysis.seasonality.length > 0 && (
          <div className="mb-8">
            <SeasonalitySection patterns={analysis.seasonality} />
          </div>
        )}

        {/* Source Breakdown */}
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Income Source Breakdown
          </h2>
          <SourceBreakdown
            sources={analysis.sourceMetrics}
            currency={currency}
          />
        </div>

        {/* Debug: Forecast Calculation Breakdown */}
        <div className="border border-amber-800/50 bg-amber-900/10 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bug className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-amber-200">
              Forecast Calculation Debug
            </h2>
          </div>
          <p className="text-xs text-amber-400/70 mb-4">
            This section shows how the monthly baseline is calculated for debugging purposes.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-4">
              <p className="text-xs text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-1">
                From Recurring Income
              </p>
              <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(analysis.debugFromRecurring, currency)}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-1">
                Monthly from Income page entries
              </p>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-4">
              <p className="text-xs text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-1">
                From Invoice History
              </p>
              <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(analysis.debugFromSources, currency)}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-1">
                Monthly from paid invoices (2+ payments)
              </p>
            </div>
            <div className="bg-teal-800/30 rounded-lg p-4 border border-teal-700/50">
              <p className="text-xs text-teal-400 uppercase tracking-wide mb-1">
                Final Monthly Baseline
              </p>
              <p className="text-xl font-semibold text-teal-300">
                {formatCurrency(analysis.debugBaselineMonthly, currency)}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-1">
                Used for Monte Carlo simulation
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-zinc-800/30 rounded text-xs text-zinc-600 dark:text-zinc-400">
            <p className="mb-1">
              <strong>Expected 90-day forecast:</strong>{' '}
              {formatCurrency(analysis.debugBaselineMonthly * 3, currency)} (baseline × 3 months)
            </p>
            <p>
              <strong>Actual 90-day forecast:</strong>{' '}
              {formatCurrency(analysis.forecast90DaysP50, currency)} (with variance applied)
            </p>
          </div>

          {/* Per-source debug details */}
          <div className="mt-4">
            <p className="text-xs text-amber-400/70 mb-2">Sources with 2+ payments (used in forecast):</p>
            <div className="space-y-2">
              {analysis.sourceMetrics
                .filter(s => s.paymentCount >= 2)
                .map(source => (
                  <div key={source.sourceId} className="p-3 bg-zinc-100 dark:bg-zinc-800/50 rounded text-xs">
                    <p className="font-medium text-zinc-800 dark:text-zinc-200">{source.name}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-zinc-600 dark:text-zinc-400">
                      <div>
                        <span className="text-zinc-600 dark:text-zinc-500">Payments:</span> {source.paymentCount}
                      </div>
                      <div>
                        <span className="text-zinc-600 dark:text-zinc-500">Avg Amount:</span> {formatCurrency(source.avgAmount, currency)}
                      </div>
                      <div>
                        <span className="text-zinc-600 dark:text-zinc-500">Avg Days Between:</span> {source.avgDaysBetween.toFixed(1)}
                      </div>
                      <div>
                        <span className="text-zinc-600 dark:text-zinc-500">Frequency:</span> {source.detectedFrequency}
                      </div>
                    </div>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-500">
                      Monthly contribution: {formatCurrency(
                        source.detectedFrequency === 'weekly' ? source.avgAmount * (52 / 12) :
                        source.detectedFrequency === 'biweekly' ? source.avgAmount * (26 / 12) :
                        source.detectedFrequency === 'semi-monthly' ? source.avgAmount * 2 :
                        source.detectedFrequency === 'monthly' ? source.avgAmount :
                        source.detectedFrequency === 'quarterly' ? source.avgAmount / 3 :
                        source.detectedFrequency === 'annually' ? source.avgAmount / 12 :
                        source.avgDaysBetween > 0 ? source.avgAmount * (30 / source.avgDaysBetween) :
                        0,
                        currency
                      )}
                    </p>
                  </div>
                ))}
              {analysis.sourceMetrics.filter(s => s.paymentCount >= 2).length === 0 && (
                <p className="text-zinc-600 dark:text-zinc-500 italic">No sources with 2+ payments</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
