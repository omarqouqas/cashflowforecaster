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
  Video,
  Film,
  Tv,
  Youtube,
} from 'lucide-react';

const post = getPostBySlug('video-editor-hourly-rate')!;

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
      name: 'What is the average hourly rate for a freelance video editor in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The average freelance video editor hourly rate in 2026 ranges from $50-125/hour for experienced editors in the US market. Entry-level editors charge $25-45/hour, while senior editors and specialists charge $100-250/hour. Rates vary significantly by video type, complexity, and turnaround time.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much do video editors charge per project?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Video editors typically charge $200-800 for YouTube videos, $500-3,000 for corporate videos, $1,500-10,000 for commercials, and $5,000-50,000+ for documentary or film work. Project pricing depends on video length, complexity, number of revisions, and deliverable formats.',
      },
    },
    {
      '@type': 'Question',
      name: 'What factors affect video editor hourly rates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Key factors include: years of experience, specialization (YouTube, commercials, weddings), software expertise (Premiere Pro, Final Cut, DaVinci Resolve), additional skills (motion graphics, color grading, sound design), turnaround time, and client type. Rush jobs typically add 25-50% to rates.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should video editors charge hourly or per-project rates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most experienced video editors prefer project-based or per-video pricing because editing time varies significantly. Hourly rates work better for ongoing retainers, revision-heavy clients, or projects with unclear scope. Many YouTubers pay per-video rates ($150-500) for consistent content.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do video editor rates compare to motion graphics rates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pure video editing rates ($50-125/hr) are generally lower than motion graphics and animation rates ($75-175/hr). Motion graphics requires additional skills in After Effects, Cinema 4D, or similar tools. Editors who combine both skills can command premium rates ($100-200/hr).',
      },
    },
  ],
};

const ratesByExperience = [
  { level: 'Entry-Level (0-2 years)', range: '$25-45/hr', project: '$150-500', notes: 'YouTube, social media clips' },
  { level: 'Mid-Level (3-5 years)', range: '$45-75/hr', project: '$500-1,500', notes: 'Standard market rate' },
  { level: 'Senior (6-10 years)', range: '$75-125/hr', project: '$1,500-5,000', notes: 'Corporate, commercial work' },
  { level: 'Expert/Specialist (10+ years)', range: '$125-250/hr', project: '$5,000-25,000+', notes: 'Film, broadcast, premium' },
];

const ratesBySpecialization = [
  { specialty: 'YouTube / Social Media', range: '$35-75/hr', demand: 'Very High', notes: 'Short-form, high volume' },
  { specialty: 'Corporate / Marketing Videos', range: '$60-120/hr', demand: 'High', notes: 'Brand videos, product demos' },
  { specialty: 'Wedding / Event Videography', range: '$50-100/hr', demand: 'High', notes: 'Seasonal, premium for highlights' },
  { specialty: 'Commercial / Advertising', range: '$100-200/hr', demand: 'High', notes: 'Broadcast-quality, brand standards' },
  { specialty: 'Documentary / Film', range: '$75-175/hr', demand: 'Medium', notes: 'Long-form storytelling' },
  { specialty: 'Motion Graphics / VFX', range: '$75-175/hr', demand: 'Very High', notes: 'After Effects, animation' },
  { specialty: 'Color Grading', range: '$100-200/hr', demand: 'Medium', notes: 'DaVinci Resolve, cinematic looks' },
  { specialty: 'Podcast / Talking Head', range: '$30-60/hr', demand: 'High', notes: 'Multi-cam, simple edits' },
];

const ratesByLocation = [
  { location: 'Los Angeles', range: '$100-200/hr', multiplier: '1.5x' },
  { location: 'New York City', range: '$90-175/hr', multiplier: '1.35x' },
  { location: 'San Francisco / Seattle', range: '$75-150/hr', multiplier: '1.15x' },
  { location: 'Austin / Atlanta / Chicago', range: '$60-120/hr', multiplier: '1.0x' },
  { location: 'Other US Cities', range: '$45-100/hr', multiplier: '0.8x' },
  { location: 'Remote (US clients)', range: '$50-125/hr', multiplier: '1.0x' },
  { location: 'UK / Western Europe', range: '£40-100/hr', multiplier: '0.85x' },
  { location: 'International (US clients)', range: '$20-60/hr', multiplier: '0.5x' },
];

const projectPricing = [
  { project: 'YouTube Video (10-15 min)', low: '$200', mid: '$450', high: '$800' },
  { project: 'Social Media Content (per video)', low: '$75', mid: '$200', high: '$500' },
  { project: 'Corporate Video (2-5 min)', low: '$750', mid: '$2,000', high: '$5,000' },
  { project: 'Commercial / Ad (30-60 sec)', low: '$1,500', mid: '$4,000', high: '$10,000' },
  { project: 'Wedding Highlight Film', low: '$500', mid: '$1,500', high: '$3,500' },
  { project: 'Music Video', low: '$800', mid: '$2,500', high: '$8,000' },
  { project: 'Documentary (feature length)', low: '$10,000', mid: '$30,000', high: '$75,000+' },
];

export default function VideoEditorHourlyRatePage() {
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
          { name: 'Video Editor Rates', url: `https://cashcast.money/blog/${post.slug}` },
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
          If you&apos;re a freelance video editor figuring out what to charge—or a creator trying to understand market
          rates—this guide breaks down video editor hourly rates for 2026. We cover rates by experience level, video type,
          location, and specialization, based on industry data and real freelancer experiences.
        </p>

        <div className="not-prose my-8 rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">Quick Answer</p>
              <p className="text-sm text-zinc-300">
                Freelance video editor rates in 2026 typically range from <strong className="text-teal-300">$50-125/hour</strong> for
                experienced editors in the US market. Motion graphics and commercial specialists charge <strong className="text-teal-300">$100-250/hour</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Rates by Experience */}
        <h2 id="by-experience">Video Editor Rates by Experience Level</h2>

        <p>
          Experience significantly impacts video editor rates. Here&apos;s what freelancers at different levels typically charge:
        </p>

        <div className="not-prose my-8 overflow-hidden rounded-xl border border-zinc-800">
          <div className="grid grid-cols-4 gap-px bg-zinc-800">
            <div className="bg-zinc-900 p-4 font-semibold text-white">Level</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Hourly</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Per Video</div>
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
                The biggest rate jump comes from adding specialized skills—motion graphics, color grading, or
                sound design. Editors who can deliver a polished final product without outsourcing command
                significantly higher rates.
              </p>
            </div>
          </div>
        </div>

        {/* Rates by Specialization */}
        <h2 id="by-specialization">Video Editor Rates by Specialization</h2>

        <p>
          Video type and specialization dramatically affect what you can charge:
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
            <Youtube className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">YouTube / Creator Content</p>
            <p className="text-sm text-zinc-400">
              High volume, consistent work from creators. Fast turnaround valued. Per-video pricing common ($200-800).
            </p>
          </div>
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
            <Video className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Short-Form / Reels / TikTok</p>
            <p className="text-sm text-zinc-400">
              Massive demand for vertical, snappy edits. High volume, lower per-video rates but steady work.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <Film className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Motion Graphics / VFX</p>
            <p className="text-sm text-zinc-400">
              After Effects, animation, visual effects. Premium rates ($75-175/hr) for technical skills.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <Tv className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Corporate / Brand Video</p>
            <p className="text-sm text-zinc-400">
              Product launches, training, marketing. Higher budgets, more revisions, brand guidelines.
            </p>
          </div>
        </div>

        {/* Rates by Location */}
        <h2 id="by-location">Video Editor Rates by Location</h2>

        <p>
          Location still matters for video editing, especially for on-site work. Here&apos;s how rates compare:
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
              <p className="font-semibold text-white mb-2">Remote Editing Reality</p>
              <p className="text-sm text-zinc-300">
                Video editing is highly remote-friendly. Cloud storage, Frame.io, and fast uploads make
                location less relevant. What matters is communication, reliable turnaround, and the
                quality of your reel. LA rates are possible from anywhere with the right clients.
              </p>
            </div>
          </div>
        </div>

        {/* Project Pricing */}
        <h2 id="project-pricing">Video Editing Project Pricing</h2>

        <p>
          Most video editors price per-project or per-video rather than hourly. Here are typical project rates:
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

        <h3>Pricing Models for Video Editors</h3>

        <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="font-semibold text-white mb-3">Per-Video Pricing Works For:</p>
            <ul className="text-sm text-zinc-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 mt-1">•</span>
                YouTube content creators
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 mt-1">•</span>
                Recurring social media content
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 mt-1">•</span>
                Standardized video formats
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 mt-1">•</span>
                When you can estimate time accurately
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
            <p className="font-semibold text-white mb-3">Hourly/Day Rates Work For:</p>
            <ul className="text-sm text-zinc-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                On-site production work
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                Revision-heavy clients
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                Complex or experimental projects
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                Agency and studio work
              </li>
            </ul>
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
                <span className="font-semibold text-white">Ad Agencies / Production Companies</span>
              </div>
              <span className="text-teal-300 font-bold">$75-200/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Broadcast-quality work, clear briefs, professional workflows. Day rates often $600-1,500. Competitive but premium.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Corporate / Enterprise</span>
              </div>
              <span className="text-teal-300 font-bold">$75-150/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Internal videos, training, product demos. Steady work, many revisions, brand guidelines. Day rates $500-1,200.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">YouTubers / Content Creators</span>
              </div>
              <span className="text-teal-300 font-bold">$200-800/video</span>
            </div>
            <p className="text-sm text-zinc-400">
              High volume, consistent work, fast turnaround. Often prefer per-video pricing. Retainers available with larger creators.
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
              Social media videos, local ads, event coverage. Smaller budgets but often loyal clients. Good for building portfolio.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Wedding / Events</span>
              </div>
              <span className="text-teal-300 font-bold">$500-3,500/project</span>
            </div>
            <p className="text-sm text-zinc-400">
              Seasonal work, emotional clients, deadline pressure. Premium for highlight reels. Full-day coverage rates vary.
            </p>
          </div>
        </div>

        {/* How to Increase Rates */}
        <h2 id="increase-rates">How to Increase Your Video Editor Rates</h2>

        <p>Ready to raise your rates? Here&apos;s what actually moves the needle:</p>

        <div className="not-prose my-8 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Add Motion Graphics Skills</p>
                <p className="text-sm text-zinc-400">
                  After Effects, animation, and motion design can double your rates. Clients pay premium for
                  editors who can add polish without outsourcing. Even basic lower thirds and transitions help.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Learn Color Grading</p>
                <p className="text-sm text-zinc-400">
                  DaVinci Resolve color grading is a distinct skill set. Cinematic color can transform footage
                  and justify premium rates. Colorists often charge $100-200/hr as specialists.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <Film className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Build a Specialty Reel</p>
                <p className="text-sm text-zinc-400">
                  &quot;YouTube editor&quot; pays less than &quot;tech product launch editor.&quot; Curate your portfolio
                  around high-paying niches: SaaS, finance, luxury brands, or specific video types.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Target Direct Clients</p>
                <p className="text-sm text-zinc-400">
                  Agencies take a cut. Go direct to brands, creators, and production companies when possible.
                  LinkedIn and direct outreach to marketing teams can unlock better rates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Takeaways */}
        <h2 id="key-takeaways">Key Takeaways</h2>

        <ul>
          <li><strong>Mid-level video editors</strong> charge $45-75/hour; senior editors charge $75-125+/hour</li>
          <li><strong>Motion graphics and VFX</strong> command premium rates ($75-175/hr)</li>
          <li><strong>YouTube/creator work</strong> is often priced per-video ($200-800) rather than hourly</li>
          <li><strong>Location matters less</strong> for remote work—client budgets drive rates more than geography</li>
          <li><strong>Adding skills pays off:</strong> Motion graphics, color grading, and sound design increase rates 50-100%</li>
          <li><strong>To increase rates:</strong> specialize, add technical skills, and target premium clients</li>
        </ul>

        {/* CTA */}
        <div className="not-prose my-10 rounded-xl border border-teal-500/30 bg-teal-500/5 p-6 text-center">
          <Calculator className="h-8 w-8 text-teal-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-3">
            Calculate Your Video Editor Rate
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
            href="/blog/graphic-designer-hourly-rate"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Graphic Designer Hourly Rates (2026)
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Compare rates for visual design work.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              View rates <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/blog/photographer-hourly-rate"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Photographer Hourly Rates (2026)
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Rates for photography work.
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
        </div>
      </section>
    </article>
  );
}
