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
  BarChart3,
  Database,
  LineChart,
  PieChart,
} from 'lucide-react';

const post = getPostBySlug('data-analyst-hourly-rate')!;

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
      name: 'What is the average hourly rate for a freelance data analyst in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The average freelance data analyst hourly rate in 2026 ranges from $75-150/hour for experienced analysts in the US market. Entry-level analysts charge $40-65/hour, while senior data analysts and specialists charge $125-250/hour. Rates vary by industry, tools expertise, and project complexity.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much do data analysts charge for projects?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Data analysts typically charge $2,000-10,000 for dashboard development, $5,000-25,000 for comprehensive data audits, $1,500-5,000 for one-off analyses, and $3,000-15,000/month for ongoing analytics retainers. Project pricing depends on data complexity, tools required, and business impact.',
      },
    },
    {
      '@type': 'Question',
      name: 'What factors affect data analyst hourly rates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Key factors include: technical skills (SQL, Python, R), visualization tools (Tableau, Power BI, Looker), industry expertise (finance, healthcare, e-commerce), years of experience, project complexity, and client type. Analysts with machine learning or advanced statistics skills command premium rates.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do data analyst rates compare to data scientist rates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Data analysts typically charge $75-150/hour while data scientists charge $125-300/hour. The premium reflects data scientists\' advanced skills in machine learning, statistical modeling, and programming. However, many projects need analysis, not ML, making analysts more cost-effective for business intelligence work.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should data analysts charge hourly or project-based rates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Project-based pricing works well for defined deliverables like dashboards, reports, or audits. Hourly rates are better for ongoing support, ad-hoc analysis requests, or exploratory work where scope is unclear. Many analysts use monthly retainers for consistent client relationships.',
      },
    },
  ],
};

const ratesByExperience = [
  { level: 'Junior (0-2 years)', range: '$40-65/hr', project: '$1,000-3,000', notes: 'Basic SQL, Excel, reporting' },
  { level: 'Mid-Level (3-5 years)', range: '$65-100/hr', project: '$3,000-8,000', notes: 'Standard market rate' },
  { level: 'Senior (6-10 years)', range: '$100-150/hr', project: '$8,000-20,000', notes: 'Complex analysis, strategy' },
  { level: 'Principal/Lead (10+ years)', range: '$150-250/hr', project: '$15,000-50,000+', notes: 'Enterprise, specialized' },
];

const ratesBySpecialization = [
  { specialty: 'Business Intelligence / Reporting', range: '$65-120/hr', demand: 'Very High', notes: 'Dashboards, KPIs, executive reporting' },
  { specialty: 'SQL / Database Analysis', range: '$70-130/hr', demand: 'Very High', notes: 'Query optimization, data modeling' },
  { specialty: 'Data Visualization', range: '$75-140/hr', demand: 'High', notes: 'Tableau, Power BI, Looker, D3.js' },
  { specialty: 'Marketing Analytics', range: '$80-150/hr', demand: 'High', notes: 'Attribution, CAC, LTV analysis' },
  { specialty: 'Financial Analysis', range: '$100-175/hr', demand: 'High', notes: 'Forecasting, modeling, due diligence' },
  { specialty: 'Product Analytics', range: '$90-160/hr', demand: 'Very High', notes: 'Funnels, retention, A/B testing' },
  { specialty: 'Healthcare / Clinical Data', range: '$100-180/hr', demand: 'Growing', notes: 'HIPAA, clinical trials, outcomes' },
  { specialty: 'Python/R Analytics', range: '$90-175/hr', demand: 'High', notes: 'Advanced statistics, automation' },
];

const ratesByLocation = [
  { location: 'San Francisco / Silicon Valley', range: '$120-225/hr', multiplier: '1.4x' },
  { location: 'New York City', range: '$100-200/hr', multiplier: '1.3x' },
  { location: 'Seattle / Boston', range: '$90-175/hr', multiplier: '1.15x' },
  { location: 'Austin / Denver / Chicago', range: '$80-150/hr', multiplier: '1.0x' },
  { location: 'Other US Cities', range: '$65-125/hr', multiplier: '0.85x' },
  { location: 'Remote (US clients)', range: '$75-150/hr', multiplier: '1.0x' },
  { location: 'UK / Western Europe', range: '£55-120/hr', multiplier: '0.85x' },
  { location: 'India / Eastern Europe', range: '$25-75/hr', multiplier: '0.4x' },
];

const projectPricing = [
  { project: 'Dashboard Development (Tableau/Power BI)', low: '$2,500', mid: '$6,000', high: '$15,000' },
  { project: 'Data Audit / Quality Assessment', low: '$3,000', mid: '$8,000', high: '$20,000' },
  { project: 'One-off Analysis / Deep Dive', low: '$1,500', mid: '$4,000', high: '$10,000' },
  { project: 'Monthly Analytics Retainer', low: '$3,000/mo', mid: '$7,500/mo', high: '$15,000/mo' },
  { project: 'SQL Database Optimization', low: '$2,000', mid: '$5,000', high: '$12,000' },
  { project: 'Marketing Attribution Model', low: '$5,000', mid: '$12,000', high: '$30,000' },
  { project: 'Financial Model / Forecast', low: '$3,000', mid: '$10,000', high: '$25,000' },
];

export default function DataAnalystHourlyRatePage() {
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
          { name: 'Data Analyst Rates', url: `https://cashcast.money/blog/${post.slug}` },
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
          If you&apos;re a freelance data analyst figuring out what to charge—or a company trying to understand market
          rates—this guide breaks down data analyst hourly rates for 2026. We cover rates by experience level, specialization,
          tools, and location, based on industry data and real freelancer experiences.
        </p>

        <div className="not-prose my-8 rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">Quick Answer</p>
              <p className="text-sm text-zinc-300">
                Freelance data analyst rates in 2026 typically range from <strong className="text-teal-300">$75-150/hour</strong> for
                experienced analysts in the US market. Senior analysts and specialists charge <strong className="text-teal-300">$150-250/hour</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Rates by Experience */}
        <h2 id="by-experience">Data Analyst Rates by Experience Level</h2>

        <p>
          Experience is the primary driver of data analyst rates. Here&apos;s what freelancers at different levels typically charge:
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
                The biggest rate jumps come from combining technical skills with domain expertise.
                A data analyst who knows SQL, Python, AND the healthcare industry commands significantly
                more than a generalist with the same technical skills.
              </p>
            </div>
          </div>
        </div>

        {/* Rates by Specialization */}
        <h2 id="by-specialization">Data Analyst Rates by Specialization</h2>

        <p>
          Specialization dramatically affects rates. Industry-specific knowledge and advanced tools command premiums:
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
            <BarChart3 className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Product Analytics</p>
            <p className="text-sm text-zinc-400">
              Amplitude, Mixpanel, user funnels, retention analysis. High demand from tech companies ($90-160/hr).
            </p>
          </div>
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
            <LineChart className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Marketing Analytics</p>
            <p className="text-sm text-zinc-400">
              Attribution modeling, CAC/LTV analysis, campaign optimization. E-commerce and DTC love this ($80-150/hr).
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <Database className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Financial Analytics</p>
            <p className="text-sm text-zinc-400">
              Forecasting, due diligence, investor reporting. Premium rates for finance expertise ($100-175/hr).
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <PieChart className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Data Visualization</p>
            <p className="text-sm text-zinc-400">
              Tableau, Power BI, Looker expertise. Executive dashboards and storytelling ($75-140/hr).
            </p>
          </div>
        </div>

        {/* Rates by Location */}
        <h2 id="by-location">Data Analyst Rates by Location</h2>

        <p>
          Location still influences rates, though remote work has expanded opportunities. Here&apos;s how rates compare:
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
                Remote data analysts working with US clients can charge US rates regardless of location.
                Data work is highly remote-friendly—what matters is your ability to communicate insights
                clearly and work with stakeholders across time zones.
              </p>
            </div>
          </div>
        </div>

        {/* Project Pricing */}
        <h2 id="project-pricing">Data Analysis Project Pricing</h2>

        <p>
          Many data analysts use project-based or retainer pricing for defined work. Here are typical project rates:
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

        <h3>Pricing Models for Data Analysts</h3>

        <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="font-semibold text-white mb-3">Use Hourly Pricing For:</p>
            <ul className="text-sm text-zinc-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 mt-1">•</span>
                Ad-hoc analysis requests
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 mt-1">•</span>
                Exploratory data work
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 mt-1">•</span>
                Projects with unclear scope
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 mt-1">•</span>
                Ongoing support and maintenance
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
            <p className="font-semibold text-white mb-3">Use Project/Retainer For:</p>
            <ul className="text-sm text-zinc-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                Dashboard development
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                Data audits and assessments
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                Specific analysis deliverables
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                Ongoing analytics partnerships
              </li>
            </ul>
          </div>
        </div>

        {/* Client Types */}
        <h2 id="by-client">Rates by Client Type</h2>

        <p>
          Who you work with significantly affects what you can charge:
        </p>

        <div className="not-prose my-8 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Enterprise / Fortune 500</span>
              </div>
              <span className="text-teal-300 font-bold">$125-225/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Large budgets, complex data environments. Often require experience with their specific tools and long procurement processes.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Funded Startups (Series A+)</span>
              </div>
              <span className="text-teal-300 font-bold">$90-175/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Good budgets, fast-moving, modern data stacks. Value clear communication and quick turnarounds.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">E-commerce / DTC Brands</span>
              </div>
              <span className="text-teal-300 font-bold">$75-140/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Marketing and sales analytics focus. Shopify, GA4, and marketing platform expertise valued.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Consulting Firms / Agencies</span>
              </div>
              <span className="text-teal-300 font-bold">$65-120/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Steady work, clear deliverables, but lower rates (they mark up to clients). Good for consistent income.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Small Businesses</span>
              </div>
              <span className="text-teal-300 font-bold">$50-90/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Smaller budgets, simpler data needs. Good for building portfolio. Excel and Google Sheets often sufficient.
            </p>
          </div>
        </div>

        {/* How to Increase Rates */}
        <h2 id="increase-rates">How to Increase Your Data Analyst Rates</h2>

        <p>Ready to raise your rates? Here&apos;s what actually moves the needle:</p>

        <div className="not-prose my-8 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Develop Industry Expertise</p>
                <p className="text-sm text-zinc-400">
                  &quot;Healthcare data analyst with HIPAA experience&quot; commands more than &quot;data analyst.&quot;
                  Pick an industry (finance, healthcare, e-commerce) and become the domain expert.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Learn Premium Tools</p>
                <p className="text-sm text-zinc-400">
                  Tableau and Looker certifications open enterprise doors. Python and R skills enable
                  advanced analytics. dbt and Snowflake expertise is increasingly valuable.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Quantify Business Impact</p>
                <p className="text-sm text-zinc-400">
                  &quot;Identified $2M in cost savings through inventory analysis&quot; is worth more than
                  &quot;built dashboard.&quot; Track and document the business outcomes of your work.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Add Strategic Value</p>
                <p className="text-sm text-zinc-400">
                  Don&apos;t just answer questions—help clients ask better ones. Proactively identify
                  opportunities and frame analysis in terms of business decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Takeaways */}
        <h2 id="key-takeaways">Key Takeaways</h2>

        <ul>
          <li><strong>Mid-level data analysts</strong> charge $65-100/hour; senior analysts charge $100-150+/hour</li>
          <li><strong>Specialization matters:</strong> Financial, healthcare, and product analytics command premium rates</li>
          <li><strong>Tools expertise is valuable</strong>—Tableau, Power BI, Python, and SQL skills directly affect rates</li>
          <li><strong>Industry knowledge compounds:</strong> Domain expertise + technical skills = highest rates</li>
          <li><strong>Retainers provide stability</strong>—many analysts prefer monthly retainers over hourly work</li>
          <li><strong>To increase rates:</strong> specialize, learn premium tools, and quantify business impact</li>
        </ul>

        {/* CTA */}
        <div className="not-prose my-10 rounded-xl border border-teal-500/30 bg-teal-500/5 p-6 text-center">
          <Calculator className="h-8 w-8 text-teal-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-3">
            Calculate Your Data Analyst Rate
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
            href="/blog/ml-consultant-hourly-rate"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              ML Consultant Hourly Rates (2026)
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Compare rates for AI and ML consulting.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              View rates <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/blog/software-engineer-hourly-rate"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Software Engineer Hourly Rates (2026)
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Compare rates by tech stack and role.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              View rates <ArrowRight className="h-3.5 w-3.5" />
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
              Compare rates for UX research and design.
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
