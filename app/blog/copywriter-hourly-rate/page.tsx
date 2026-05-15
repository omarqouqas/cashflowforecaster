import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { getPostBySlug } from '@/lib/blog/posts';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  MapPin,
  Briefcase,
  Award,
  ArrowRight,
  CheckCircle2,
  FileText,
  MessageSquare,
  Mail,
  Globe,
} from 'lucide-react';

const post = getPostBySlug('copywriter-hourly-rate')!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  keywords: post.keywords,
  alternates: {
    canonical: `https://cashcast.money/blog/${post.slug}`,
  },
  openGraph: {
    title: post.title,
    description: post.description,
    url: `https://cashcast.money/blog/${post.slug}`,
    siteName: 'Cashcast',
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
    name: 'Cashcast',
    url: 'https://cashcast.money',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://cashcast.money/blog/${post.slug}`,
  },
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['.speakable-headline', '.speakable-summary'],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the average hourly rate for a freelance copywriter in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The average freelance copywriter hourly rate in 2026 ranges from $75-150/hour for experienced copywriters in the US market. Entry-level copywriters charge $35-60/hour, while specialized or senior copywriters charge $150-350/hour for high-converting sales copy, technical writing, or brand strategy work.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much do copywriters charge per word or per project?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Copywriters often charge $0.10-1.00 per word for content writing and $0.50-3.00+ per word for high-converting sales copy. Project rates vary: blog posts ($150-800), website copy ($2,000-10,000), email sequences ($500-3,000), and sales pages ($1,000-10,000+). Pricing depends on complexity, research required, and potential ROI.',
      },
    },
    {
      '@type': 'Question',
      name: 'What factors affect copywriter hourly rates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Key factors include: specialization (direct response vs content), years of experience, industry expertise (B2B SaaS, finance, health), project complexity, turnaround time, and proven results. Copywriters with documented conversion lifts or revenue impact can charge significantly more.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should copywriters charge hourly or per-project rates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most experienced copywriters prefer project-based or value-based pricing because it rewards efficiency and results. Hourly works better for ongoing retainers, editing work, or projects with unclear scope. Per-word rates are best avoided as they incentivize quantity over quality.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do copywriter rates compare to content writer rates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Copywriters typically charge 2-5x more than content writers. Content writers create informational blog posts and articles ($50-150/hour), while copywriters create persuasive sales copy designed to convert ($100-350/hour). The higher rates reflect the direct revenue impact of effective copy.',
      },
    },
  ],
};

const ratesByExperience = [
  { level: 'Entry-Level (0-2 years)', range: '$35-60/hr', project: '$100-500', notes: 'Blog posts, basic web copy' },
  { level: 'Mid-Level (3-5 years)', range: '$60-100/hr', project: '$500-2,000', notes: 'Standard market rate' },
  { level: 'Senior (6-10 years)', range: '$100-175/hr', project: '$2,000-5,000', notes: 'Strategic projects' },
  { level: 'Expert/Specialist (10+ years)', range: '$175-350/hr', project: '$5,000-25,000+', notes: 'High-converting copy, brand voice' },
];

const ratesBySpecialization = [
  { specialty: 'Content Writing (Blogs/Articles)', range: '$50-100/hr', demand: 'Very High', notes: 'SEO content, thought leadership' },
  { specialty: 'Website Copywriting', range: '$75-150/hr', demand: 'High', notes: 'Landing pages, homepages, product pages' },
  { specialty: 'Email Marketing', range: '$100-200/hr', demand: 'High', notes: 'Sequences, newsletters, campaigns' },
  { specialty: 'Direct Response/Sales Copy', range: '$150-350/hr', demand: 'High', notes: 'Sales pages, VSLs, funnels' },
  { specialty: 'B2B/SaaS Copywriting', range: '$100-200/hr', demand: 'Very High', notes: 'Tech-savvy, conversion-focused' },
  { specialty: 'UX Writing', range: '$85-150/hr', demand: 'Growing', notes: 'Microcopy, product copy, UI text' },
  { specialty: 'Technical Writing', range: '$75-150/hr', demand: 'High', notes: 'Documentation, whitepapers, manuals' },
  { specialty: 'Brand Strategy/Voice', range: '$150-300/hr', demand: 'Medium', notes: 'Messaging frameworks, brand guidelines' },
];

const ratesByLocation = [
  { location: 'New York City', range: '$100-250/hr', multiplier: '1.4x' },
  { location: 'San Francisco / LA', range: '$90-200/hr', multiplier: '1.2x' },
  { location: 'Chicago / Boston', range: '$80-175/hr', multiplier: '1.1x' },
  { location: 'Other Major US Cities', range: '$70-150/hr', multiplier: '1.0x' },
  { location: 'Remote (US clients)', range: '$75-175/hr', multiplier: '1.0x' },
  { location: 'UK / Western Europe', range: '£50-120/hr', multiplier: '0.85x' },
  { location: 'Australia', range: 'AU$80-180/hr', multiplier: '0.9x' },
  { location: 'International (US clients)', range: '$40-100/hr', multiplier: '0.6x' },
];

const projectPricing = [
  { project: 'Blog Post (1,000-1,500 words)', low: '$150', mid: '$400', high: '$800' },
  { project: 'Website Copy (5-7 pages)', low: '$2,000', mid: '$5,000', high: '$10,000' },
  { project: 'Email Sequence (5-7 emails)', low: '$500', mid: '$1,500', high: '$3,000' },
  { project: 'Sales Page (Long-form)', low: '$1,500', mid: '$4,000', high: '$10,000' },
  { project: 'Product Descriptions (10)', low: '$300', mid: '$800', high: '$1,500' },
  { project: 'Case Study', low: '$500', mid: '$1,500', high: '$3,000' },
  { project: 'Brand Messaging Guide', low: '$2,500', mid: '$7,500', high: '$15,000' },
];

export default function CopywriterHourlyRatePage() {
  return (
    <article className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Breadcrumbs
        items={[
          breadcrumbs.home,
          breadcrumbs.blog,
          { name: 'Copywriter Rates', url: `https://cashcast.money/blog/${post.slug}` },
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

        <h1 className="speakable-headline text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="speakable-summary mt-4 text-lg text-zinc-300 leading-relaxed">{post.description}</p>

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
        {/* Introduction */}
        <p>
          If you&apos;re a freelance copywriter figuring out what to charge—or a business trying to understand fair market
          rates—this guide breaks down copywriter hourly rates for 2026. We cover rates by experience level, specialization,
          location, and project type, based on industry data and real freelancer experiences.
        </p>

        <div className="not-prose my-8 rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">Quick Answer</p>
              <p className="text-sm text-zinc-300">
                Freelance copywriter rates in 2026 typically range from <strong className="text-teal-300">$75-150/hour</strong> for
                experienced copywriters in the US market. Direct response and sales copywriters charge <strong className="text-teal-300">$150-350/hour</strong> or more.
              </p>
            </div>
          </div>
        </div>

        {/* Rates by Experience */}
        <h2 id="by-experience">Copywriter Rates by Experience Level</h2>

        <p>
          Experience significantly impacts copywriter rates. Here&apos;s what freelancers at different levels typically charge:
        </p>

        <div className="not-prose my-8 overflow-hidden rounded-xl border border-zinc-800">
          <div className="grid grid-cols-4 gap-px bg-zinc-800">
            <div className="bg-zinc-900 p-4 font-semibold text-white">Level</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Hourly</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Project</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Notes</div>
          </div>
          <div className="divide-y divide-zinc-800">
            {ratesByExperience.map((rate, index) => (
              <div key={index} className="grid grid-cols-4 gap-px bg-zinc-800">
                <div className="bg-zinc-900/60 p-4 text-sm text-white">{rate.level}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-teal-300 font-medium">{rate.range}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-zinc-300">{rate.project}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-zinc-400">{rate.notes}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">Key Insight</p>
              <p className="text-sm text-zinc-300">
                The biggest rate jump happens when copywriters can demonstrate measurable results—conversion lifts,
                revenue generated, or A/B test wins. Proof of ROI is worth more than years of experience alone.
              </p>
            </div>
          </div>
        </div>

        {/* Rates by Specialization */}
        <h2 id="by-specialization">Copywriter Rates by Specialization</h2>

        <p>
          Specialization dramatically affects what you can charge. Conversion-focused copy commands the highest premiums:
        </p>

        <div className="not-prose my-8 overflow-hidden rounded-xl border border-zinc-800">
          <div className="grid grid-cols-4 gap-px bg-zinc-800">
            <div className="bg-zinc-900 p-4 font-semibold text-white">Specialty</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Rate Range</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Demand</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Focus</div>
          </div>
          <div className="divide-y divide-zinc-800">
            {ratesBySpecialization.map((spec, index) => (
              <div key={index} className="grid grid-cols-4 gap-px bg-zinc-800">
                <div className="bg-zinc-900/60 p-4 text-sm text-white">{spec.specialty}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-teal-300 font-medium">{spec.range}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-zinc-300">{spec.demand}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-zinc-400">{spec.notes}</div>
              </div>
            ))}
          </div>
        </div>

        <h3>Hot Specializations for 2026</h3>

        <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
            <Mail className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Email Copywriting</p>
            <p className="text-sm text-zinc-400">
              Email sequences, launches, and retention campaigns. High ROI makes this a premium specialty ($100-200/hr).
            </p>
          </div>
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
            <Globe className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">B2B SaaS Copy</p>
            <p className="text-sm text-zinc-400">
              Technical products, complex buyer journeys. High demand from funded startups ($100-200/hr).
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <FileText className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Long-Form Sales Copy</p>
            <p className="text-sm text-zinc-400">
              Sales pages, VSLs, and webinar scripts. Premium rates for proven converters ($150-350/hr).
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <MessageSquare className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">UX Writing</p>
            <p className="text-sm text-zinc-400">
              Product copy, microcopy, and in-app messaging. Growing demand from tech companies ($85-150/hr).
            </p>
          </div>
        </div>

        {/* Rates by Location */}
        <h2 id="by-location">Copywriter Rates by Location</h2>

        <p>
          Location influences rates, though remote work has narrowed the gap. What matters most is who your clients are:
        </p>

        <div className="not-prose my-8 overflow-hidden rounded-xl border border-zinc-800">
          <div className="grid grid-cols-3 gap-px bg-zinc-800">
            <div className="bg-zinc-900 p-4 font-semibold text-white">Location</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Rate Range</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">vs. Average</div>
          </div>
          <div className="divide-y divide-zinc-800">
            {ratesByLocation.map((loc, index) => (
              <div key={index} className="grid grid-cols-3 gap-px bg-zinc-800">
                <div className="bg-zinc-900/60 p-4 text-sm text-white flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                  {loc.location}
                </div>
                <div className="bg-zinc-900/60 p-4 text-sm text-teal-300 font-medium">{loc.range}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-zinc-400">{loc.multiplier}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">Remote Work Reality</p>
              <p className="text-sm text-zinc-300">
                Remote copywriters working with US clients can charge US rates regardless of location.
                Your client&apos;s budget, not your cost of living, should drive your pricing. Strong portfolios
                and English fluency matter more than geography.
              </p>
            </div>
          </div>
        </div>

        {/* Project Pricing */}
        <h2 id="project-pricing">Copywriting Project Pricing</h2>

        <p>
          Most experienced copywriters prefer project-based pricing. Here are typical project rates:
        </p>

        <div className="not-prose my-8 overflow-hidden rounded-xl border border-zinc-800">
          <div className="grid grid-cols-4 gap-px bg-zinc-800">
            <div className="bg-zinc-900 p-4 font-semibold text-white">Project Type</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white text-center">Budget</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white text-center">Standard</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white text-center">Premium</div>
          </div>
          <div className="divide-y divide-zinc-800">
            {projectPricing.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-px bg-zinc-800">
                <div className="bg-zinc-900/60 p-4 text-sm text-white">{item.project}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-zinc-400 text-center">{item.low}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-teal-300 font-medium text-center">{item.mid}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-zinc-400 text-center">{item.high}</div>
              </div>
            ))}
          </div>
        </div>

        <h3>Pricing Models for Copywriters</h3>

        <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="font-semibold text-white mb-3">Avoid Per-Word Pricing</p>
            <ul className="text-sm text-zinc-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 mt-1">•</span>
                Incentivizes wordiness over impact
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 mt-1">•</span>
                Doesn&apos;t account for research time
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 mt-1">•</span>
                Devalues editing and refinement
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 mt-1">•</span>
                Only works for content mills
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
            <p className="font-semibold text-white mb-3">Use Value-Based Pricing</p>
            <ul className="text-sm text-zinc-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                Base price on potential ROI
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                Factor in client&apos;s budget and stakes
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                Charge more for high-traffic pages
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                Consider royalties or rev-share
              </li>
            </ul>
          </div>
        </div>

        {/* Client Types */}
        <h2 id="by-client">Rates by Client Type</h2>

        <p>
          Who you work with matters as much as what you write. Different clients have different budgets:
        </p>

        <div className="not-prose my-8 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Direct Response / Info Products</span>
              </div>
              <span className="text-teal-300 font-bold">$150-350/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Highest paying niche. Copy directly drives revenue, so ROI is measurable. Often includes royalty structures.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">B2B SaaS / Tech</span>
              </div>
              <span className="text-teal-300 font-bold">$100-200/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Well-funded startups and enterprises. Good budgets, ongoing work, value clear communication.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">E-commerce / DTC Brands</span>
              </div>
              <span className="text-teal-300 font-bold">$75-150/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Product descriptions, email campaigns, ads. Volume work available but rates vary widely.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Agencies</span>
              </div>
              <span className="text-teal-300 font-bold">$60-120/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Steady work, clear briefs, but lower rates (they markup to clients). Good for consistent income.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Small Businesses / Local</span>
              </div>
              <span className="text-teal-300 font-bold">$40-80/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Smaller budgets but often loyal clients. Good for building portfolio. Set clear scope limits.
            </p>
          </div>
        </div>

        {/* How to Increase Rates */}
        <h2 id="increase-rates">How to Increase Your Copywriting Rates</h2>

        <p>Ready to raise your rates? Here&apos;s what actually moves the needle:</p>

        <div className="not-prose my-8 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Document Your Results</p>
                <p className="text-sm text-zinc-400">
                  &quot;Wrote email sequence that generated $150K in 3 days&quot; is worth more than &quot;10 years experience.&quot;
                  Track opens, clicks, conversions, and revenue for every project you can.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Specialize in High-Value Niches</p>
                <p className="text-sm text-zinc-400">
                  Finance, health, B2B SaaS, and direct response pay significantly more than general content.
                  Pick one niche and become the go-to expert.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Target Direct Clients Over Agencies</p>
                <p className="text-sm text-zinc-400">
                  Going direct means you capture the full budget, not just the agency&apos;s cut. Focus on
                  building relationships with marketing directors and founders.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Add Strategy to Your Offering</p>
                <p className="text-sm text-zinc-400">
                  Don&apos;t just write what clients ask for. Audit their funnel, recommend improvements,
                  and position yourself as a conversion strategist, not just a writer.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Takeaways */}
        <h2 id="key-takeaways">Key Takeaways</h2>

        <ul>
          <li><strong>Mid-level copywriters</strong> charge $60-100/hour; senior copywriters charge $100-175+/hour</li>
          <li><strong>Direct response and sales copy</strong> commands premium rates ($150-350/hr) due to measurable ROI</li>
          <li><strong>Avoid per-word pricing</strong>—use project-based or value-based pricing instead</li>
          <li><strong>Client type matters:</strong> Direct response and B2B SaaS pay 2-3x what small businesses pay</li>
          <li><strong>Document your results</strong>—conversion data is worth more than years of experience</li>
          <li><strong>To increase rates:</strong> specialize, target direct clients, and add strategic value</li>
        </ul>

        {/* CTA */}
        <div className="not-prose my-10 rounded-xl border border-teal-500/30 bg-teal-500/5 p-6 text-center">
          <Calculator className="h-8 w-8 text-teal-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-3">
            Calculate Your Copywriter Rate
          </h3>
          <p className="text-zinc-300 mb-4">
            Use our free calculator to find your minimum, standard, and premium hourly rates based on your income goals and expenses.
          </p>
          <Link
            href="/tools/freelance-rate-calculator"
            className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-sm transition-colors"
          >
            Try the Calculator Free
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="mt-16 pt-10 border-t border-zinc-800">
        <h2 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqSchema.mainEntity.map((faq, index) => (
            <details
              key={index}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between p-5 text-white font-medium hover:bg-zinc-900/60 transition-colors">
                {faq.name}
                <span className="ml-4 text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-zinc-400 text-sm leading-relaxed">
                {faq.acceptedAnswer.text}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Related Content */}
      <section className="mt-12 pt-10 border-t border-zinc-800">
        <h2 className="text-xl font-semibold text-white mb-6">Related Resources</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/tools/freelance-rate-calculator"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-4 w-4 text-teal-400" />
              <span className="text-xs text-teal-400 font-medium">Free Tool</span>
            </div>
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Freelance Rate Calculator
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Calculate your personalized hourly rate.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              Try calculator <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/blog/how-to-calculate-freelance-rate"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              How to Calculate Freelance Rates
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              The complete formula for setting your rates.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              Read guide <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/blog/ux-designer-hourly-rate"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              UX Designer Hourly Rates (2026)
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Compare rates for UX and product designers.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              View rates <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/blog/graphic-designer-hourly-rate"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Graphic Designer Hourly Rates (2026)
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Rates for brand, motion, and print design.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              View rates <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/blog/video-editor-hourly-rate"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Video Editor Hourly Rates (2026)
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Rates for YouTube, commercial, and motion graphics.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              View rates <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/blog/web-developer-hourly-rate"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Web Developer Hourly Rates (2026)
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Compare rates by tech stack and specialization.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              View rates <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </section>
    </article>
  );
}
