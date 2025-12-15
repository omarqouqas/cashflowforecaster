import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Wallet, Calendar, TrendingUp, FileText } from 'lucide-react';

interface EmptyCalendarStateProps {
  type: 'no-accounts' | 'no-data';
  message?: string;
}

/**
 * EmptyCalendarState component - displays empty states for the calendar
 * 
 * Two types:
 * - 'no-accounts': When user has no accounts
 * - 'no-data': When user has accounts but no income/bills
 */
export function EmptyCalendarState({ type, message }: EmptyCalendarStateProps) {
  if (type === 'no-accounts') {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-zinc-800 rounded-full flex items-center justify-center">
          <Wallet className="w-10 h-10 text-zinc-400" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-zinc-100">
          No Accounts Yet
        </h3>
        <p className="text-zinc-400 mb-8 max-w-md mx-auto">
          {message ||
            'Add your first bank account to start tracking your cash flow forecast. Your 60-day projection will appear here once you have accounts set up.'}
        </p>
        <Link href="/dashboard/accounts/new">
          <Button variant="primary" size="lg">
            Add Your First Account
          </Button>
        </Link>
      </div>
    );
  }

  // type === 'no-data'
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 mx-auto mb-6 bg-zinc-800 rounded-full flex items-center justify-center">
        <Calendar className="w-10 h-10 text-teal-400" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-zinc-100">
        Your Calendar is Ready!
      </h3>
      <p className="text-zinc-400 mb-8 max-w-md mx-auto">
        {message ||
          'Add income sources and bills to see your detailed 60-day cash flow forecast. Your calendar will show projected balances based on your recurring transactions.'}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link href="/dashboard/income/new">
          <Button variant="primary" size="lg" className="w-full sm:w-auto">
            <TrendingUp className="w-4 h-4 mr-2" />
            Add Income
          </Button>
        </Link>
        <Link href="/dashboard/bills/new">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <FileText className="w-4 h-4 mr-2" />
            Add Bill
          </Button>
        </Link>
      </div>
    </div>
  );
}
