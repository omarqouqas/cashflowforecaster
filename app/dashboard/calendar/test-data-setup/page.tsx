'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * Test data setup page for calendar testing.
 * Allows setting multiple income sources and bills to the same date
 * to test the multiple transactions on same day functionality.
 * 
 * ⚠️ DELETE THIS PAGE BEFORE PRODUCTION
 */
export default function TestDataSetupPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    income?: { success: boolean; count?: number; error?: string };
    bills?: { success: boolean; count?: number; error?: string };
  }>({});

  // Calculate dates within 60-day window from today
  const today = new Date();
  const incomeDate = new Date(today);
  incomeDate.setDate(incomeDate.getDate() + 15); // 15 days from today
  const billsDate = new Date(today);
  billsDate.setDate(billsDate.getDate() + 30); // 30 days from today

  const incomeDateStr = incomeDate.toISOString().split('T')[0];
  const billsDateStr = billsDate.toISOString().split('T')[0];

  const handleUpdateIncome = async () => {
    setLoading(true);
    setResults({});

    try {
      const supabase = createClient();
      
      // Update all weekly and biweekly income to the same date
      const { data, error, count } = await supabase
        .from('income')
        .update({ next_date: incomeDateStr })
        .in('frequency', ['weekly', 'biweekly'])
        .select();

      if (error) {
        setResults({
          income: {
            success: false,
            error: error.message,
          },
        });
      } else {
        setResults({
          income: {
            success: true,
            count: count || data?.length || 0,
          },
        });
      }
    } catch (error) {
      setResults({
        income: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBills = async () => {
    setLoading(true);
    setResults(prev => ({ ...prev }));

    try {
      const supabase = createClient();
      
      // Update all monthly bills to the same date
      const { data, error, count } = await supabase
        .from('bills')
        .update({ due_date: billsDateStr })
        .eq('frequency', 'monthly')
        .select();

      if (error) {
        setResults(prev => ({
          ...prev,
          bills: {
            success: false,
            error: error.message,
          },
        }));
      } else {
        setResults(prev => ({
          ...prev,
          bills: {
            success: true,
            count: count || data?.length || 0,
          },
        }));
      }
    } catch (error) {
      setResults(prev => ({
        ...prev,
        bills: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        }));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAll = async () => {
    setLoading(true);
    setResults({});

    try {
      const supabase = createClient();
      
      // Update income
      const incomeResult = await supabase
        .from('income')
        .update({ next_date: incomeDateStr })
        .in('frequency', ['weekly', 'biweekly'])
        .select();

      // Update bills
      const billsResult = await supabase
        .from('bills')
        .update({ due_date: billsDateStr })
        .eq('frequency', 'monthly')
        .select();

      setResults({
        income: incomeResult.error
          ? { success: false, error: incomeResult.error.message }
          : { success: true, count: incomeResult.data?.length || 0 },
        bills: billsResult.error
          ? { success: false, error: billsResult.error.message }
          : { success: true, count: billsResult.data?.length || 0 },
      });
    } catch (error) {
      setResults({
        income: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        bills: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/calendar/test"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Calendar Test
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Test Data Setup
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Set multiple income sources and bills to the same date to test multiple transactions on same day functionality.
        </p>
        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ <strong>Warning:</strong> This will modify your database. Only use for testing purposes.
          </p>
        </div>
      </div>

      {/* Date Information */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-6 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
          Target Dates
        </h2>
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Income Date (weekly/biweekly):
            </span>
            <span className="ml-2 text-sm text-slate-900 dark:text-white font-mono">
              {incomeDateStr}
            </span>
            <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
              ({Math.ceil((incomeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} days from today)
            </span>
          </div>
          <div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Bills Date (monthly):
            </span>
            <span className="ml-2 text-sm text-slate-900 dark:text-white font-mono">
              {billsDateStr}
            </span>
            <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
              ({Math.ceil((billsDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} days from today)
            </span>
          </div>
        </div>
      </div>

      {/* Update Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-6 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
          Update Actions
        </h2>
        <div className="space-y-4">
          {/* Update Income */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">
                  Update Income (Weekly/Biweekly)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Sets all weekly and biweekly income sources to {incomeDateStr}
                </p>
              </div>
              <Button
                onClick={handleUpdateIncome}
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Updating...' : 'Update Income'}
              </Button>
            </div>
            {results.income && (
              <div className={`mt-3 p-3 rounded ${
                results.income.success
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}>
                {results.income.success ? (
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✓ Successfully updated {results.income.count} income source(s)
                  </p>
                ) : (
                  <p className="text-sm text-red-800 dark:text-red-200">
                    ✗ Error: {results.income.error}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Update Bills */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">
                  Update Bills (Monthly)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Sets all monthly bills to {billsDateStr}
                </p>
              </div>
              <Button
                onClick={handleUpdateBills}
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Updating...' : 'Update Bills'}
              </Button>
            </div>
            {results.bills && (
              <div className={`mt-3 p-3 rounded ${
                results.bills.success
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}>
                {results.bills.success ? (
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✓ Successfully updated {results.bills.count} bill(s)
                  </p>
                ) : (
                  <p className="text-sm text-red-800 dark:text-red-200">
                    ✗ Error: {results.bills.error}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Update All */}
          <div className="border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">
                  Update All
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Updates both income and bills in one operation
                </p>
              </div>
              <Button
                onClick={handleUpdateAll}
                disabled={loading}
                variant="primary"
              >
                {loading ? 'Updating...' : 'Update All'}
              </Button>
            </div>
            {results.income && results.bills && (
              <div className="mt-3 space-y-2">
                {results.income.success && results.bills.success && (
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✓ All updates completed successfully
                  </p>
                )}
                {(!results.income.success || !results.bills.success) && (
                  <div className="space-y-1">
                    {!results.income.success && (
                      <p className="text-sm text-red-800 dark:text-red-200">
                        ✗ Income update failed: {results.income.error}
                      </p>
                    )}
                    {!results.bills.success && (
                      <p className="text-sm text-red-800 dark:text-red-200">
                        ✗ Bills update failed: {results.bills.error}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SQL Reference */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
          SQL Reference
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          Equivalent SQL commands (for reference or direct database execution):
        </p>
        <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 overflow-x-auto">
          <code className="text-xs text-green-400 font-mono">
            <div className="text-slate-400">-- Set multiple income sources to same date</div>
            <div className="mt-2">
              <span className="text-blue-400">UPDATE</span>{' '}
              <span className="text-yellow-400">income</span>
            </div>
            <div className="ml-2">
              <span className="text-blue-400">SET</span>{' '}
              <span className="text-yellow-400">next_date</span>{' '}
              <span className="text-blue-400">=</span>{' '}
              <span className="text-green-300">'{incomeDateStr}'</span>
            </div>
            <div className="ml-2">
              <span className="text-blue-400">WHERE</span>{' '}
              <span className="text-yellow-400">frequency</span>{' '}
              <span className="text-blue-400">IN</span>{' '}
              <span className="text-green-300">('weekly', 'biweekly')</span>;
            </div>
            <div className="mt-4 text-slate-400">-- Set multiple bills to same date</div>
            <div className="mt-2">
              <span className="text-blue-400">UPDATE</span>{' '}
              <span className="text-yellow-400">bills</span>
            </div>
            <div className="ml-2">
              <span className="text-blue-400">SET</span>{' '}
              <span className="text-yellow-400">due_date</span>{' '}
              <span className="text-blue-400">=</span>{' '}
              <span className="text-green-300">'{billsDateStr}'</span>
            </div>
            <div className="ml-2">
              <span className="text-blue-400">WHERE</span>{' '}
              <span className="text-yellow-400">frequency</span>{' '}
              <span className="text-blue-400">=</span>{' '}
              <span className="text-green-300">'monthly'</span>;
            </div>
          </code>
        </div>
      </div>
    </div>
  );
}

