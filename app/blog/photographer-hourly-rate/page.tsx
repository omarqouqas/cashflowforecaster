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
  Camera,
  Image,
  Heart,
  Building2,
} from 'lucide-react';

const post = getPostBySlug('photographer-hourly-rate')!;

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
      name: 'What is the average hourly rate for a freelance photographer in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The average freelance photographer hourly rate in 2026 ranges from $100-250/hour for experienced photographers in the US market. Entry-level photographers charge $50-100/hour, while specialized commercial and advertising photographers charge $250-500+ per hour. Rates vary significantly by specialty, location, and licensing terms.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much do photographers charge for a wedding?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Wedding photographers typically charge $2,500-6,000 for standard packages including 6-8 hours of coverage, edited photos, and an online gallery. Premium photographers charge $6,000-15,000+ for full-day coverage with albums, second shooters, and engagement sessions. Prices vary by market and photographer reputation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What factors affect photographer hourly rates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Key factors include: specialty (commercial, wedding, portrait), years of experience, equipment investment, post-processing time, licensing/usage rights, location, and turnaround time. Commercial work requiring extended usage licenses commands significantly higher rates than personal portrait sessions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should photographers charge hourly or per-project rates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most photographers use package or day-rate pricing rather than hourly. Portrait sessions often use package pricing ($300-800 for session + edited images). Commercial work uses day rates ($1,500-5,000/day) plus licensing fees. Hourly rates work better for events and editorial work.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do portrait photographer rates compare to commercial rates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Portrait photographers typically charge $150-350/session while commercial photographers charge $1,500-5,000/day plus licensing. Commercial rates are higher because images generate revenue for clients, require more production value, and include usage rights. The licensing fee alone can exceed the creative fee.',
      },
    },
  ],
};

const ratesByExperience = [
  { level: 'Entry-Level (0-2 years)', range: '$50-100/hr', project: '$200-500', notes: 'Building portfolio, events' },
  { level: 'Mid-Level (3-5 years)', range: '$100-175/hr', project: '$500-1,500', notes: 'Standard market rate' },
  { level: 'Senior (6-10 years)', range: '$175-300/hr', project: '$1,500-4,000', notes: 'Established reputation' },
  { level: 'Expert/Commercial (10+ years)', range: '$300-500+/hr', project: '$3,000-10,000+', notes: 'Advertising, editorial' },
];

const ratesBySpecialization = [
  { specialty: 'Portrait / Headshot', range: '$150-350/session', demand: 'High', notes: 'Corporate, personal branding' },
  { specialty: 'Wedding Photography', range: '$2,500-8,000/event', demand: 'High', notes: 'Seasonal, emotional work' },
  { specialty: 'Event / Corporate', range: '$150-350/hr', demand: 'High', notes: 'Conferences, galas, parties' },
  { specialty: 'Product Photography', range: '$200-500/hr', demand: 'Very High', notes: 'E-commerce, Amazon, catalog' },
  { specialty: 'Food Photography', range: '$300-600/hr', demand: 'High', notes: 'Restaurants, cookbooks, brands' },
  { specialty: 'Real Estate', range: '$150-400/property', demand: 'Very High', notes: 'Volume work, drone adds value' },
  { specialty: 'Commercial / Advertising', range: '$1,500-5,000/day', demand: 'Medium', notes: 'Plus licensing fees' },
  { specialty: 'Editorial / Fashion', range: '$500-2,000/day', demand: 'Medium', notes: 'Magazines, lookbooks' },
];

const ratesByLocation = [
  { location: 'New York City', range: '$200-500/hr', multiplier: '1.5x' },
  { location: 'Los Angeles / San Francisco', range: '$175-400/hr', multiplier: '1.3x' },
  { location: 'Chicago / Miami', range: '$150-350/hr', multiplier: '1.15x' },
  { location: 'Major US Cities', range: '$125-275/hr', multiplier: '1.0x' },
  { location: 'Suburban / Rural', range: '$75-175/hr', multiplier: '0.7x' },
  { location: 'UK / Western Europe', range: '£100-300/hr', multiplier: '0.9x' },
  { location: 'Australia', range: 'AU$150-400/hr', multiplier: '0.95x' },
];

const projectPricing = [
  { project: 'Headshot Session (30-60 min)', low: '$150', mid: '$350', high: '$600' },
  { project: 'Portrait Session (1-2 hrs)', low: '$300', mid: '$600', high: '$1,200' },
  { project: 'Wedding (8 hours)', low: '$2,500', mid: '$5,000', high: '$10,000' },
  { project: 'Corporate Event (4 hours)', low: '$800', mid: '$1,500', high: '$3,000' },
  { project: 'Product Shoot (per product)', low: '$30', mid: '$75', high: '$200' },
  { project: 'Real Estate (per property)', low: '$150', mid: '$300', high: '$600' },
  { project: 'Commercial Day Rate', low: '$1,500', mid: '$3,000', high: '$5,000+' },
];

export default function PhotographerHourlyRatePage() {
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
          { name: 'Photographer Rates', url: `https://cashcast.money/blog/${post.slug}` },
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
          If you&apos;re a freelance photographer figuring out what to charge—or a client trying to understand market
          rates—this guide breaks down photographer hourly rates for 2026. We cover rates by experience level, specialty,
          location, and project type, based on industry data and real photographer experiences.
        </p>

        <div className="not-prose my-8 rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">Quick Answer</p>
              <p className="text-sm text-zinc-300">
                Freelance photographer rates in 2026 typically range from <strong className="text-teal-300">$100-250/hour</strong> for
                experienced photographers in the US market. Commercial and advertising photographers charge <strong className="text-teal-300">$250-500+/hour</strong> or day rates plus licensing.
              </p>
            </div>
          </div>
        </div>

        {/* Rates by Experience */}
        <h2 id="by-experience">Photographer Rates by Experience Level</h2>

        <p>
          Experience and portfolio strength significantly impact photographer rates. Here&apos;s what photographers at different levels typically charge:
        </p>

        <div className="not-prose my-8 overflow-hidden rounded-xl border border-zinc-800">
          <div className="grid grid-cols-4 gap-px bg-zinc-800">
            <div className="bg-zinc-900 p-4 font-semibold text-white">Level</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Hourly</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Session</div>
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
                Photography rates are highly portfolio-dependent. A photographer with 3 years of focused experience
                and a strong portfolio often commands higher rates than someone with 10 years of scattered work.
                Specialization and recognizable style matter more than years alone.
              </p>
            </div>
          </div>
        </div>

        {/* Rates by Specialization */}
        <h2 id="by-specialization">Photographer Rates by Specialization</h2>

        <p>
          Photography specialty is the biggest factor in pricing. Commercial work pays dramatically more than personal work:
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
            <Image className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Product / E-commerce</p>
            <p className="text-sm text-zinc-400">
              Amazon, Shopify, DTC brands need endless product shots. High volume, scalable work ($50-200/product).
            </p>
          </div>
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
            <Building2 className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Real Estate / Architecture</p>
            <p className="text-sm text-zinc-400">
              Consistent demand, drone skills add premium. Quick turnaround valued ($150-400/property).
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <Camera className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Corporate Headshots</p>
            <p className="text-sm text-zinc-400">
              LinkedIn-driven demand for professional headshots. Often volume work for companies ($150-350/person).
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <Heart className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Content Creator Shoots</p>
            <p className="text-sm text-zinc-400">
              Influencers and personal brands need ongoing content. Retainer opportunities ($500-2,000/month).
            </p>
          </div>
        </div>

        {/* Rates by Location */}
        <h2 id="by-location">Photographer Rates by Location</h2>

        <p>
          Location significantly impacts photography rates, more so than many other creative fields due to the in-person nature of most work:
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
              <p className="font-semibold text-white mb-2">Travel and Destination Work</p>
              <p className="text-sm text-zinc-300">
                Photographers often travel for destination weddings, commercial shoots, and brand campaigns.
                Travel fees typically add $500-2,000 to projects. Building a reputation in one specialty can
                bring clients from anywhere willing to pay travel costs.
              </p>
            </div>
          </div>
        </div>

        {/* Project Pricing */}
        <h2 id="project-pricing">Photography Project Pricing</h2>

        <p>
          Most photographers use session, package, or day-rate pricing rather than hourly. Here are typical project rates:
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

        <h3>Understanding Licensing and Usage Rights</h3>

        <div className="not-prose my-8 rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">The Licensing Factor</p>
              <p className="text-sm text-zinc-300 mb-3">
                Commercial photography rates include separate creative fees and licensing fees. The creative fee
                covers your time shooting. The licensing fee covers how the images will be used:
              </p>
              <ul className="text-sm text-zinc-300 space-y-1">
                <li>• <strong>Social media only:</strong> +25-50% of creative fee</li>
                <li>• <strong>Website and marketing:</strong> +50-100% of creative fee</li>
                <li>• <strong>Print advertising:</strong> +100-200% of creative fee</li>
                <li>• <strong>Unlimited/buyout:</strong> +200-500%+ of creative fee</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Client Types */}
        <h2 id="by-client">Rates by Client Type</h2>

        <p>
          Who you work with significantly affects both rates and work volume:
        </p>

        <div className="not-prose my-8 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Advertising Agencies / Brands</span>
              </div>
              <span className="text-teal-300 font-bold">$2,000-5,000+/day</span>
            </div>
            <p className="text-sm text-zinc-400">
              Highest rates plus licensing fees. Larger production budgets, creative direction, and longer sales cycles.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Corporate / Enterprise</span>
              </div>
              <span className="text-teal-300 font-bold">$200-400/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Headshots, events, internal communications. Consistent work, professional expectations. Often half-day or day rates.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Small Businesses / E-commerce</span>
              </div>
              <span className="text-teal-300 font-bold">$150-300/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Product shots, lifestyle content, local marketing. Good volume potential for scalable specialty.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Wedding Clients</span>
              </div>
              <span className="text-teal-300 font-bold">$2,500-10,000/wedding</span>
            </div>
            <p className="text-sm text-zinc-400">
              High emotional stakes, seasonal work. Premium pricing possible with reputation. Referral-driven business.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Individual / Portrait Clients</span>
              </div>
              <span className="text-teal-300 font-bold">$200-600/session</span>
            </div>
            <p className="text-sm text-zinc-400">
              Family portraits, personal branding, headshots. Package pricing common. Good for consistent local income.
            </p>
          </div>
        </div>

        {/* How to Increase Rates */}
        <h2 id="increase-rates">How to Increase Your Photography Rates</h2>

        <p>Ready to raise your rates? Here&apos;s what actually moves the needle:</p>

        <div className="not-prose my-8 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Specialize and Build a Focused Portfolio</p>
                <p className="text-sm text-zinc-400">
                  &quot;Wedding photographer&quot; is good. &quot;Luxury destination wedding photographer&quot; is better.
                  Curate your portfolio around a specific niche and be known for one thing.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Move Toward Commercial Work</p>
                <p className="text-sm text-zinc-400">
                  Commercial and advertising photography pays 3-10x what portrait work pays. Build relationships
                  with agencies, art directors, and marketing teams. Show work that solves business problems.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <Camera className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Add Video Capabilities</p>
                <p className="text-sm text-zinc-400">
                  Clients increasingly want both photos and video. Photographers who can deliver both
                  command premium rates and win more projects. Even basic video skills add value.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Understand and Charge for Licensing</p>
                <p className="text-sm text-zinc-400">
                  Many photographers undercharge because they don&apos;t separate creative and licensing fees.
                  Learn to price based on usage—extended licenses can double or triple project value.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Takeaways */}
        <h2 id="key-takeaways">Key Takeaways</h2>

        <ul>
          <li><strong>Mid-level photographers</strong> charge $100-175/hour; senior photographers charge $175-300+/hour</li>
          <li><strong>Specialty drives pricing:</strong> Commercial pays 3-10x what portrait work pays</li>
          <li><strong>Location matters significantly</strong> for photography since most work is in-person</li>
          <li><strong>Licensing fees are separate</strong> from creative fees and can double commercial project value</li>
          <li><strong>Package and day-rate pricing</strong> is more common than hourly in photography</li>
          <li><strong>To increase rates:</strong> specialize, pursue commercial work, and price licensing properly</li>
        </ul>

        {/* CTA */}
        <div className="not-prose my-10 rounded-xl border border-teal-500/30 bg-teal-500/5 p-6 text-center">
          <Calculator className="h-8 w-8 text-teal-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-3">
            Calculate Your Photography Rate
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
            href="/blog/video-editor-hourly-rate"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Video Editor Hourly Rates (2026)
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Compare rates for video production work.
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
              Rates for visual design work.
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
              Compare rates for UX and product design.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              View rates <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/blog/copywriter-hourly-rate"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Copywriter Hourly Rates (2026)
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Rates for content and marketing copy.
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
