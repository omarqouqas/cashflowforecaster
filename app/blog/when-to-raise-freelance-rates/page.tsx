import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { getPostBySlug } from '@/lib/blog/posts';
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Users,
  Zap,
} from 'lucide-react';

const post = getPostBySlug('when-to-raise-freelance-rates')!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  keywords: post.keywords,
  alternates: {
    canonical: `https://cashflowforecaster.io/blog/${post.slug}`,
  },
  openGraph: {
    title: post.title,
    description: post.description,
    url: `https://cashflowforecaster.io/blog/${post.slug}`,
    siteName: 'Cash Flow Forecaster',
    type: 'article',
    publishedTime: post.publishedAt,
    authors: [post.author.name],
  },
  twitter: {
    card: 'summary_large_image',
    title: post.title,
    description: post.description,
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.description,
  datePublished: post.publishedAt,
  author: {
    '@type': 'Organization',
    name: post.author.name,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Cash Flow Forecaster',
    url: 'https://cashflowforecaster.io',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://cashflowforecaster.io/blog/${post.slug}`,
  },
};

const signs = [
  {
    icon: Users,
    title: 'You\'re fully booked',
    description: 'If you\'re turning away clients, your rates are too low. High demand = raise prices.',
    urgency: 'high',
  },
  {
    icon: Clock,
    title: 'You haven\'t raised rates in 12+ months',
    description: 'Inflation alone means your effective rate drops ~3-4% per year. Annual increases are normal.',
    urgency: 'medium',
  },
  {
    icon: Zap,
    title: 'Your skills have improved significantly',
    description: 'New certifications, tools, or experience should translate to higher rates.',
    urgency: 'medium',
  },
  {
    icon: TrendingUp,
    title: 'Competitors charge more for similar work',
    description: 'Research market rates. If you\'re below average, you\'re leaving money on the table.',
    urgency: 'medium',
  },
  {
    icon: AlertTriangle,
    title: 'You resent the work',
    description: 'Feeling underpaid leads to burnout and poor work. Rates affect your motivation.',
    urgency: 'high',
  },
];

export default function WhenToRaiseRatesPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Breadcrumbs
        items={[
          breadcrumbs.home,
          breadcrumbs.blog,
          { name: 'When to Raise Rates', url: `https://cashflowforecaster.io/blog/${post.slug}` },
        ]}
        className="mb-8"
      />

      <header className="mb-12">
        <div className="flex items-center gap-3 text-sm text-zinc-400 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 text-xs font-medium text-teal-400">
            {post.category}
          </span>
          <span>{post.readingTime}</span>
          <span>•</span>
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="mt-4 text-lg text-zinc-300 leading-relaxed">{post.description}</p>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-zinc-950 font-bold text-sm">
            CF
          </div>
          <div>
            <p className="text-sm font-medium text-white">{post.author.name}</p>
            <p className="text-sm text-zinc-500">{post.author.role}</p>
          </div>
        </div>
      </header>

      <div className="prose prose-invert prose-zinc max-w-none">
        <p>
          Most freelancers wait too long to raise their rates. They fear losing clients, feel uncomfortable asking
          for more money, or simply don&apos;t realize they&apos;re undercharging.
        </p>

        <p>
          Here&apos;s the truth: <strong>if you&apos;ve never had a client say no to your rates, they&apos;re too low.</strong>
        </p>

        <h2>5 Signs It&apos;s Time to Raise Your Rates</h2>

        <div className="not-prose my-8 space-y-4">
          {signs.map((sign) => (
            <div
              key={sign.title}
              className={`flex items-start gap-4 rounded-xl border p-5 ${
                sign.urgency === 'high'
                  ? 'border-amber-500/30 bg-amber-500/5'
                  : 'border-zinc-800 bg-zinc-900/40'
              }`}
            >
              <sign.icon
                className={`h-6 w-6 flex-shrink-0 ${
                  sign.urgency === 'high' ? 'text-amber-400' : 'text-teal-400'
                }`}
              />
              <div>
                <p className="font-semibold text-white">{sign.title}</p>
                <p className="text-sm text-zinc-400 mt-1">{sign.description}</p>
              </div>
            </div>
          ))}
        </div>

        <h2>How Much Should You Raise Rates?</h2>

        <p>The answer depends on your situation:</p>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
          <div className="divide-y divide-zinc-800">
            <div className="grid grid-cols-2 p-4">
              <span className="font-medium text-zinc-300">Situation</span>
              <span className="font-medium text-zinc-300">Recommended Increase</span>
            </div>
            <div className="grid grid-cols-2 p-4 bg-zinc-900/40">
              <span className="text-white">Annual cost-of-living adjustment</span>
              <span className="text-teal-300">3-5%</span>
            </div>
            <div className="grid grid-cols-2 p-4">
              <span className="text-white">New skills or certifications</span>
              <span className="text-teal-300">10-15%</span>
            </div>
            <div className="grid grid-cols-2 p-4 bg-zinc-900/40">
              <span className="text-white">Fully booked / turning away work</span>
              <span className="text-teal-300">15-25%</span>
            </div>
            <div className="grid grid-cols-2 p-4">
              <span className="text-white">Significantly underpriced vs. market</span>
              <span className="text-teal-300">25-50%</span>
            </div>
          </div>
        </div>

        <div className="not-prose my-8 rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">The 10% Test</p>
              <p className="text-sm text-zinc-300">
                If you&apos;re unsure how much to raise rates, start with 10%. If no clients push back,
                you probably could have gone higher. Use this feedback to calibrate future increases.
              </p>
            </div>
          </div>
        </div>

        <h2>How to Tell Existing Clients</h2>

        <p>
          This is the part that scares people. Here&apos;s a simple framework:
        </p>

        <ol>
          <li><strong>Give advance notice</strong> (30-60 days minimum)</li>
          <li><strong>Be direct</strong>, not apologetic</li>
          <li><strong>Explain the value</strong>, not the reason you need more money</li>
          <li><strong>Offer a transition</strong> if appropriate</li>
        </ol>

        <h3>Email Template: Rate Increase</h3>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-teal-400" />
            <span className="text-sm font-medium text-zinc-400">Copy/paste template</span>
          </div>
          <div className="text-sm text-zinc-300 space-y-4 font-mono bg-zinc-950/50 p-4 rounded-lg">
            <p>Hi [Client Name],</p>
            <p>
              I wanted to give you advance notice that my rates will be increasing starting [Date - 30-60 days out].
            </p>
            <p>
              My new rate for [service] will be [New Rate]. This reflects [brief reason - expanded skills,
              market alignment, increased demand, etc.].
            </p>
            <p>
              I&apos;ve really enjoyed working with you on [specific project or ongoing work], and I look forward
              to continuing to deliver great results.
            </p>
            <p>
              If you&apos;d like to lock in work at the current rate, I&apos;m happy to discuss prepaying for
              upcoming projects before [Date].
            </p>
            <p>
              Let me know if you have any questions.
            </p>
            <p>Best,<br />[Your Name]</p>
          </div>
        </div>

        <h3>For New Clients</h3>

        <p>
          Raising rates for new clients is easier—just update your proposals and quotes. No explanation needed.
          You can even raise rates for new clients <em>before</em> existing clients to test the market.
        </p>

        <h2>What If Clients Push Back?</h2>

        <p>
          Some will. That&apos;s actually <em>healthy</em>. If no one ever pushes back, you&apos;re undercharging.
        </p>

        <p>Here&apos;s how to handle common objections:</p>

        <div className="not-prose my-8 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="font-medium text-white mb-2">&quot;We can&apos;t afford that increase.&quot;</p>
            <p className="text-sm text-zinc-400">
              Offer to reduce scope instead of price. &quot;I understand. We could adjust the scope to [specific
              reduction] to stay within your budget.&quot;
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="font-medium text-white mb-2">&quot;Other freelancers charge less.&quot;</p>
            <p className="text-sm text-zinc-400">
              Don&apos;t compete on price. &quot;I understand there are cheaper options. My rates reflect the quality
              and reliability I provide. I&apos;m happy to recommend alternatives if budget is the priority.&quot;
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="font-medium text-white mb-2">&quot;Can you make an exception for us?&quot;</p>
            <p className="text-sm text-zinc-400">
              Only if there&apos;s a real reason (long-term contract, referrals, interesting work). Otherwise:
              &quot;I apply rates consistently across all clients to be fair.&quot;
            </p>
          </div>
        </div>

        <h2>When to Apply New Rates</h2>

        <ul>
          <li><strong>New clients:</strong> Immediately</li>
          <li><strong>Existing clients (project-based):</strong> Next project</li>
          <li><strong>Existing clients (retainer):</strong> Give 30-60 days notice, apply at next renewal</li>
        </ul>

        <div className="not-prose my-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-300 mb-2">Don&apos;t Raise Rates Mid-Project</p>
              <p className="text-sm text-zinc-300">
                Honor existing agreements. If you quoted $5,000 for a project, don&apos;t ask for $6,000 halfway
                through. Raise rates for the <em>next</em> project instead.
              </p>
            </div>
          </div>
        </div>

        <h2>The Impact on Your Cash Flow</h2>

        <p>
          A 15% rate increase doesn&apos;t mean 15% more income—it could mean much more. If you&apos;re currently
          working 40 billable hours/week at $75/hour and raise to $86/hour:
        </p>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-zinc-400">Before: 40 hrs × $75</span>
              <span className="text-white">$3,000/week</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">After: 40 hrs × $86</span>
              <span className="text-white">$3,440/week</span>
            </div>
            <div className="border-t border-zinc-700 pt-3 flex justify-between">
              <span className="text-zinc-300">Annual increase</span>
              <span className="text-teal-400 font-semibold">+$22,880/year</span>
            </div>
          </div>
        </div>

        <p>
          Or, you could work fewer hours for the same income—giving you time back for business development,
          skills training, or life outside work.
        </p>

        <h2>Key Takeaways</h2>

        <ul>
          <li><strong>Raise rates annually</strong> at minimum—inflation erodes your effective rate</li>
          <li><strong>Being fully booked</strong> is a clear signal to raise prices</li>
          <li><strong>Give existing clients 30-60 days notice</strong></li>
          <li><strong>Be direct, not apologetic</strong>—you&apos;re providing value</li>
          <li><strong>Some pushback is healthy</strong>—if everyone says yes, rates are too low</li>
        </ul>

        {/* CTA */}
        <div className="not-prose my-10 rounded-xl border border-teal-500/30 bg-teal-500/5 p-6 text-center">
          <TrendingUp className="h-8 w-8 text-teal-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-3">
            See How Rate Changes Affect Your Cash Flow
          </h3>
          <p className="text-zinc-300 mb-4">
            Use Cash Flow Forecaster to model how a rate increase would impact your income over the next
            3, 6, or 12 months—before you make the change.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-sm transition-colors"
          >
            Try Free for 14 Days
          </Link>
        </div>
      </div>

      {/* Related Content */}
      <section className="mt-16 pt-10 border-t border-zinc-800">
        <h2 className="text-xl font-semibold text-white mb-6">Related Articles</h2>
        <div className="grid gap-4">
          <Link
            href="/tools/freelance-rate-calculator"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Freelance Rate Calculator
            </p>
            <p className="mt-1 text-sm text-zinc-400">Calculate your minimum hourly rate based on income goals.</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              Try calculator <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/blog/how-to-manage-irregular-income-as-freelancer"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Managing Irregular Income as a Freelancer
            </p>
            <p className="mt-1 text-sm text-zinc-400">Strategies for handling unpredictable freelance income.</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              Read article <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </section>
    </article>
  );
}
