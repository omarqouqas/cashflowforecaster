import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog/posts';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Freelancer Finance Blog - Tips, Guides & Tools | Cash Flow Forecaster',
  description: 'Expert guides on managing irregular income, cash flow forecasting, and financial planning for freelancers and gig workers.',
  keywords: [
    'freelancer finances',
    'irregular income tips',
    'cash flow management',
    'freelance budgeting',
    'gig worker money',
    'financial planning freelancers',
  ],
  alternates: {
    canonical: 'https://cashflowforecaster.io/blog',
  },
  openGraph: {
    title: 'Freelancer Finance Blog | Cash Flow Forecaster',
    description: 'Expert guides on managing irregular income and cash flow forecasting for freelancers.',
    url: 'https://cashflowforecaster.io/blog',
    siteName: 'Cash Flow Forecaster',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freelancer Finance Blog | Cash Flow Forecaster',
    description: 'Expert guides on managing irregular income and cash flow forecasting for freelancers.',
  },
};

const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Cash Flow Forecaster Blog',
  description: 'Expert guides on managing irregular income and cash flow forecasting for freelancers.',
  url: 'https://cashflowforecaster.io/blog',
  publisher: {
    '@type': 'Organization',
    name: 'Cash Flow Forecaster',
    url: 'https://cashflowforecaster.io',
  },
};

const categoryColors = {
  guides: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
  tips: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  tools: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
  news: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const featuredPost = posts[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <div className="mx-auto max-w-4xl">
        <Breadcrumbs
          items={[breadcrumbs.home, breadcrumbs.blog]}
          className="mb-8"
        />

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/60 border border-zinc-800 px-4 py-2 text-sm text-zinc-200 mb-6">
            <BookOpen className="h-4 w-4 text-teal-400" />
            <span>Freelancer Finance Blog</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Master Your Money as a Freelancer
          </h1>

          <p className="mt-5 text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Practical guides, tips, and strategies for managing irregular income,
            forecasting cash flow, and building financial stability.
          </p>
        </div>

        {/* Featured post */}
        {featuredPost && (
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="block mb-12 group"
          >
            <article className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs px-3 py-1 rounded-full border ${categoryColors[featuredPost.category]}`}>
                  {featuredPost.category}
                </span>
                <span className="text-xs text-zinc-500">Featured</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-semibold text-white group-hover:text-teal-300 transition-colors">
                {featuredPost.title}
              </h2>

              <p className="mt-3 text-zinc-400 leading-relaxed">
                {featuredPost.description}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {featuredPost.readingTime}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 text-teal-400 group-hover:gap-2 transition-all">
                  Read more <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </article>
          </Link>
        )}

        {/* All posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.slice(1).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <article className="h-full rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs px-3 py-1 rounded-full border ${categoryColors[post.category]}`}>
                    {post.category}
                  </span>
                </div>

                <h2 className="text-lg font-semibold text-white group-hover:text-teal-300 transition-colors line-clamp-2">
                  {post.title}
                </h2>

                <p className="mt-2 text-sm text-zinc-400 line-clamp-2">
                  {post.description}
                </p>

                <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readingTime}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <section className="mt-16">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-10 text-center">
            <h2 className="text-2xl font-semibold text-white">
              Ready to take control of your cash flow?
            </h2>
            <p className="mt-3 text-zinc-400">
              Start forecasting your finances for free. See your bank balance up to 60 days ahead.
            </p>
            <div className="mt-6">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
