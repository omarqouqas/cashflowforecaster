import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-6">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent">
            See Your Bank Balance 60 Days Into the Future
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Project your daily balance for the next 60 days. Know exactly when you&apos;ll run low
          before it happens. Perfect for freelancers, gig workers, and anyone living paycheck to paycheck.
        </p>

        <div className="flex flex-col items-center gap-4">
          <Link href="/auth/signup">
            <Button variant="primary" size="lg">
              Get Started Free
            </Button>
          </Link>

          <p className="text-sm text-slate-500 dark:text-slate-500">No credit card required</p>
        </div>
      </div>
    </main>
  );
}
