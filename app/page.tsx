import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, Clock, PlusCircle, Wallet } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-zinc-50/50 to-white selection-teal">
      {/* subtle dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.25]"
        style={{
          backgroundImage: 'radial-gradient(rgba(24,24,27,0.10) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          backgroundPosition: 'center',
        }}
      />

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-zinc-200">
        <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-zinc-900">
            Cash Flow Forecaster
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-zinc-600 hover:text-zinc-900 transition-colors">
              Log in
            </Link>
            <Link href="/auth/signup">
              <Button variant="primary" size="md">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="px-6 pt-16 pb-12">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight">
              See Your Bank Balance 60 Days Into the Future
            </h1>

            <p className="mt-5 text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
              Stop guessing if you can afford it. Project your daily balance and spot overdrafts weeks
              before they happen. Perfect for freelancers, gig workers, and anyone living paycheck to
              paycheck.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3">
              <Link href="/auth/signup">
                <Button
                  variant="primary"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg text-lg font-medium h-auto"
                >
                  Get Started Free
                </Button>
              </Link>

              <p className="text-sm text-zinc-500">No credit card required • Free forever plan</p>

              <p className="text-sm text-zinc-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-teal-700 hover:text-teal-800 hover:underline">
                  Log in
                </Link>
              </p>
            </div>

            <div className="mt-10 max-w-4xl mx-auto rounded-xl shadow-2xl border border-zinc-200 overflow-hidden bg-white">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200 bg-white">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="relative">
                <Image
                  src="/hero-dashboard.png"
                  alt="Cash Flow Forecaster dashboard preview"
                  width={1600}
                  height={900}
                  priority
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-14">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold text-center text-zinc-900">How it works</h2>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-zinc-200 bg-white p-6">
                <div className="h-11 w-11 rounded-lg bg-zinc-100 flex items-center justify-center">
                  <PlusCircle className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900">Add Your Accounts</h3>
                <p className="mt-2 text-zinc-600">
                  Enter your bank balances, income sources, and recurring bills
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-6">
                <div className="h-11 w-11 rounded-lg bg-zinc-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900">See 60 Days Ahead</h3>
                <p className="mt-2 text-zinc-600">We project your daily balance automatically</p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-6">
                <div className="h-11 w-11 rounded-lg bg-zinc-100 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900">Get Warned Early</h3>
                <p className="mt-2 text-zinc-600">
                  Know about low-balance days weeks before they happen
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-14">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold text-center text-zinc-900">
              Everything you need to stop overdrafting
            </h2>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-zinc-200 bg-white p-6">
                <div className="h-11 w-11 rounded-lg bg-zinc-100 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900">Safe to Spend</h3>
                <p className="mt-2 text-zinc-600">Know exactly how much you can spend today</p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-6">
                <div className="h-11 w-11 rounded-lg bg-zinc-100 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900">Low Balance Alerts</h3>
                <p className="mt-2 text-zinc-600">Get warned days before you run low</p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-6">
                <div className="h-11 w-11 rounded-lg bg-zinc-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900">60-Day Forecast</h3>
                <p className="mt-2 text-zinc-600">See your projected balance every day</p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-6">
                <div className="h-11 w-11 rounded-lg bg-zinc-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900">5-Minute Setup</h3>
                <p className="mt-2 text-zinc-600">
                  No bank login needed. Just add your info.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-14">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold text-center text-zinc-900">
              Simple, transparent pricing
            </h2>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-zinc-200 bg-white p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-semibold text-zinc-900">Free</h3>
                  <p className="text-zinc-600">
                    <span className="text-3xl font-semibold text-zinc-900">$0</span>
                    <span className="text-sm">/forever</span>
                  </p>
                </div>
                <ul className="mt-4 space-y-2 text-zinc-600">
                  <li>Manual entry</li>
                  <li>Up to 10 bills</li>
                  <li>60-day forecast</li>
                </ul>
              </div>

              <div className="rounded-xl border border-teal-200 bg-white p-6 shadow-sm">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-semibold text-zinc-900">Pro</h3>
                  <p className="text-zinc-600">
                    <span className="text-3xl font-semibold text-zinc-900">$7.99</span>
                    <span className="text-sm">/month</span>
                  </p>
                </div>
                <ul className="mt-4 space-y-2 text-zinc-600">
                  <li>Email bill parser</li>
                  <li>Unlimited bills</li>
                  <li>Priority support</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Link href="/auth/signup">
                <Button
                  variant="primary"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg text-lg font-medium h-auto"
                >
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="px-6 py-14 bg-zinc-50 border-y border-zinc-200">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="text-2xl font-semibold text-zinc-900">
              Ready to see your financial future?
            </h2>
            <p className="mt-2 text-zinc-600">
              Join freelancers who finally know where their money is going.
            </p>
            <div className="mt-6 flex justify-center">
              <Link href="/auth/signup">
                <Button
                  variant="primary"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg text-lg font-medium h-auto"
                >
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="px-6 py-10">
          <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <p>© 2024 Cash Flow Forecaster</p>
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:text-zinc-700">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-zinc-700">
                Terms of Service
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
