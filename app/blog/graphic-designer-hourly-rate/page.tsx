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
  Palette,
  PenTool,
  Image,
  FileText,
} from 'lucide-react';

const post = getPostBySlug('graphic-designer-hourly-rate')!;

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
      name: 'What is the average hourly rate for a freelance graphic designer in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The average freelance graphic designer hourly rate in 2026 ranges from $50-100/hour for mid-level designers and $100-200/hour for senior designers in the US market. Rates vary by specialization, with brand identity designers and motion graphics artists commanding premium rates of $125-250/hour.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much do freelance graphic designers charge for a logo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Freelance graphic designers typically charge $500-2,000 for a basic logo, $2,000-10,000 for a comprehensive logo with brand guidelines, and $10,000-50,000+ for full brand identity systems. Pricing depends on the number of concepts, revisions, and deliverables included.',
      },
    },
    {
      '@type': 'Question',
      name: 'What factors affect graphic designer hourly rates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Key factors include: years of experience, specialization (brand identity, packaging, motion graphics), location, client type (enterprise vs small business), software expertise, and portfolio quality. Designers with niche expertise in areas like 3D design or animation command 50-100% higher rates.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should graphic designers charge hourly or per project?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Project-based pricing often works better for graphic design since deliverables are tangible (logos, brochures, etc.). Hourly works well for ongoing retainers, production work, or when scope is unclear. Many designers use project pricing but calculate it based on estimated hours plus a buffer.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do graphic designer rates compare to web designer rates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Web designers typically charge 10-30% more than print-focused graphic designers due to technical skills required. However, graphic designers specializing in motion graphics, 3D, or brand strategy can match or exceed web designer rates. The highest-paid designers combine visual design with UX or development skills.',
      },
    },
  ],
};

const ratesByExperience = [
  { level: 'Junior (0-2 years)', range: '$35-60/hr', project: '$500-3,000', notes: 'Portfolio building, smaller clients' },
  { level: 'Mid-Level (3-5 years)', range: '$60-100/hr', project: '$3,000-10,000', notes: 'Standard market rate' },
  { level: 'Senior (6-10 years)', range: '$100-150/hr', project: '$8,000-25,000', notes: 'Strategic projects, art direction' },
  { level: 'Creative Director (10+ years)', range: '$150-300/hr', project: '$20,000-100,000+', notes: 'Brand strategy, enterprise' },
];

const ratesBySpecialization = [
  { specialty: 'Brand Identity Design', range: '$100-200/hr', demand: 'High', notes: 'Logos, brand systems, guidelines' },
  { specialty: 'Print Design', range: '$50-100/hr', demand: 'Medium', notes: 'Brochures, packaging, publications' },
  { specialty: 'Motion Graphics', range: '$100-200/hr', demand: 'Very High', notes: 'Animation, video, social content' },
  { specialty: 'Packaging Design', range: '$85-150/hr', demand: 'High', notes: 'Product packaging, retail' },
  { specialty: 'Social Media Design', range: '$50-100/hr', demand: 'Very High', notes: 'Templates, campaigns, ads' },
  { specialty: 'Illustration', range: '$75-175/hr', demand: 'Medium', notes: 'Custom artwork, editorial' },
  { specialty: '3D Design/Rendering', range: '$100-250/hr', demand: 'Growing', notes: 'Product vis, environments' },
  { specialty: 'Publication Design', range: '$65-120/hr', demand: 'Medium', notes: 'Magazines, books, reports' },
];

const ratesByLocation = [
  { location: 'New York City', range: '$100-200/hr', multiplier: '1.4x' },
  { location: 'Los Angeles / San Francisco', range: '$90-175/hr', multiplier: '1.25x' },
  { location: 'Chicago / Boston / Seattle', range: '$75-140/hr', multiplier: '1.1x' },
  { location: 'Other US Cities', range: '$50-100/hr', multiplier: '0.85x' },
  { location: 'Remote (US clients)', range: '$65-130/hr', multiplier: '1.0x' },
  { location: 'UK / Western Europe', range: '£45-120/hr', multiplier: '0.9x' },
  { location: 'Eastern Europe / Latin America', range: '$30-75/hr', multiplier: '0.5x' },
];

const projectPricing = [
  { project: 'Logo Design (Basic)', low: '$500', mid: '$2,000', high: '$5,000' },
  { project: 'Logo + Brand Guidelines', low: '$2,500', mid: '$7,500', high: '$20,000' },
  { project: 'Full Brand Identity System', low: '$10,000', mid: '$30,000', high: '$100,000' },
  { project: 'Brochure / Catalog Design', low: '$1,000', mid: '$3,500', high: '$10,000' },
  { project: 'Packaging Design (Single)', low: '$2,000', mid: '$5,000', high: '$15,000' },
  { project: 'Social Media Template Set', low: '$500', mid: '$2,000', high: '$5,000' },
  { project: 'Motion Graphics (30-60s)', low: '$1,500', mid: '$5,000', high: '$15,000' },
];

export default function GraphicDesignerHourlyRatePage() {
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
          { name: 'Graphic Designer Rates', url: `https://cashcast.money/blog/${post.slug}` },
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
          Whether you&apos;re a freelance graphic designer setting your rates or a business trying to understand fair pricing,
          this guide covers everything you need to know about graphic designer hourly rates in 2026. We break down rates by
          experience, specialization, location, and project type.
        </p>

        <div className="not-prose my-8 rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">Quick Answer</p>
              <p className="text-sm text-zinc-300">
                Freelance graphic designer rates in 2026 typically range from <strong className="text-teal-300">$60-100/hour</strong> for
                mid-level designers in the US market. Senior designers and specialists charge <strong className="text-teal-300">$100-200/hour</strong>,
                while creative directors can command <strong className="text-teal-300">$150-300/hour</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Rates by Experience */}
        <h2 id="by-experience">Graphic Designer Rates by Experience Level</h2>

        <p>
          Experience is the primary factor in determining graphic design rates. Here&apos;s what designers at each level typically charge:
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
                The jump from mid-level to senior represents more than just years—it&apos;s about art direction capabilities,
                strategic thinking, and the ability to manage client relationships. Senior designers often lead projects
                and work with less supervision.
              </p>
            </div>
          </div>
        </div>

        {/* Rates by Specialization */}
        <h2 id="by-specialization">Graphic Designer Rates by Specialization</h2>

        <p>
          Your specialization significantly impacts earning potential. Some niches command premium rates:
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
            <PenTool className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Motion Graphics</p>
            <p className="text-sm text-zinc-400">
              Video content and animation are everywhere. Social media, ads, and presentations all need motion. Rates: $100-200/hr.
            </p>
          </div>
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
            <Palette className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Brand Identity</p>
            <p className="text-sm text-zinc-400">
              Companies always need branding. Strategic brand designers who understand business command $100-200/hr.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <Image className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">3D Design & Rendering</p>
            <p className="text-sm text-zinc-400">
              Product visualization, AR/VR assets, and 3D illustration are growing fast. Premium rates: $100-250/hr.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <FileText className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Packaging Design</p>
            <p className="text-sm text-zinc-400">
              DTC brands need standout packaging. Technical knowledge of printing adds value. Rates: $85-150/hr.
            </p>
          </div>
        </div>

        {/* Rates by Location */}
        <h2 id="by-location">Graphic Designer Rates by Location</h2>

        <p>
          Location influences rates, though remote work has created more flexibility. Here&apos;s how rates compare:
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
              <p className="font-semibold text-white mb-2">Remote Work Advantage</p>
              <p className="text-sm text-zinc-300">
                Remote designers can work with clients in high-cost markets while living elsewhere. Focus on building
                a strong portfolio and communication skills—many clients care more about quality than location.
              </p>
            </div>
          </div>
        </div>

        {/* Project Pricing */}
        <h2 id="project-pricing">Graphic Design Project Pricing</h2>

        <p>
          Most graphic design work is priced per project rather than hourly. Here are typical project rates:
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

        <h3>Pricing Strategy Tips</h3>

        <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="font-semibold text-white mb-3">Include in Your Quote:</p>
            <ul className="text-sm text-zinc-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 mt-1">•</span>
                Number of initial concepts
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 mt-1">•</span>
                Revision rounds included
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 mt-1">•</span>
                File formats delivered
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 mt-1">•</span>
                Timeline and milestones
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
            <p className="font-semibold text-white mb-3">Charge Extra For:</p>
            <ul className="text-sm text-zinc-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                Rush delivery (50-100% premium)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                Additional revision rounds
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                Extended usage rights
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                Source file delivery
              </li>
            </ul>
          </div>
        </div>

        {/* Client Types */}
        <h2 id="by-client">Rates by Client Type</h2>

        <p>
          Different clients have different budgets. Understanding this helps you price appropriately:
        </p>

        <div className="not-prose my-8 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Enterprise / Large Brands</span>
              </div>
              <span className="text-teal-300 font-bold">$100-250/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Large budgets, formal processes, longer timelines. May require vendor onboarding and insurance.
              Higher rates but more stakeholders and approval layers.
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
              Steady work, clear creative briefs, but lower rates since they mark up to end clients. Good for consistent income.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Startups / Small Businesses</span>
              </div>
              <span className="text-teal-300 font-bold">$50-100/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Smaller budgets but often more creative freedom. Direct client relationships with faster decisions.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Individual / Personal Projects</span>
              </div>
              <span className="text-teal-300 font-bold">$35-75/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Lowest budgets but simplest projects. Good for building portfolio. Be clear about what&apos;s included.
            </p>
          </div>
        </div>

        {/* How to Increase Rates */}
        <h2 id="increase-rates">How to Increase Your Graphic Design Rates</h2>

        <p>Ready to earn more? Here&apos;s what actually moves the needle:</p>

        <div className="not-prose my-8 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Specialize in a Profitable Niche</p>
                <p className="text-sm text-zinc-400">
                  &quot;I design brand identities for SaaS companies&quot; commands higher rates than &quot;I do graphic design.&quot;
                  Pick an industry or design type and become the go-to expert.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Add High-Value Skills</p>
                <p className="text-sm text-zinc-400">
                  Motion graphics, 3D rendering, or animation skills can increase your rates by 50-100%.
                  Even basic After Effects skills open up higher-paying projects.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <Briefcase className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Target Better Clients</p>
                <p className="text-sm text-zinc-400">
                  Enterprise and funded startups pay 2-3x what small businesses pay for similar work.
                  Update your portfolio and outreach to attract higher-budget projects.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Position as Strategic, Not Just Creative</p>
                <p className="text-sm text-zinc-400">
                  Designers who can discuss business goals, target audiences, and measurable outcomes
                  are valued more than &quot;pixel pushers.&quot; Frame your work in terms of client results.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Takeaways */}
        <h2 id="key-takeaways">Key Takeaways</h2>

        <ul>
          <li><strong>Mid-level graphic designers</strong> charge $60-100/hour; senior designers charge $100-150+/hour</li>
          <li><strong>Specialization pays:</strong> Motion graphics, brand identity, and 3D design command premium rates</li>
          <li><strong>Project pricing</strong> is standard for most graphic design work—calculate based on hours plus buffer</li>
          <li><strong>Client type matters:</strong> Enterprise pays 2-3x what small businesses pay</li>
          <li><strong>Location affects rates</strong>, but remote work lets you access higher-paying markets</li>
          <li><strong>To increase rates:</strong> specialize, add motion/3D skills, and target better clients</li>
        </ul>

        {/* CTA */}
        <div className="not-prose my-10 rounded-xl border border-teal-500/30 bg-teal-500/5 p-6 text-center">
          <Calculator className="h-8 w-8 text-teal-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-3">
            Calculate Your Graphic Design Rate
          </h3>
          <p className="text-zinc-300 mb-4">
            Use our free calculator to find your ideal hourly rate based on your income goals, expenses, and billable hours.
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
              Compare rates for UX design work.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              View rates <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/blog/when-to-raise-freelance-rates"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              When to Raise Your Rates
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Signs you&apos;re undercharging and how to increase.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              Read guide <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </section>
    </article>
  );
}
