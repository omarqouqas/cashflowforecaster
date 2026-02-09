'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbSchema, type BreadcrumbItem } from './schemas';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const schema = generateBreadcrumbSchema(items);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
        <ol className="flex items-center flex-wrap gap-1">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isFirst = index === 0;

            return (
              <li key={item.url} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600 mx-1.5" aria-hidden="true" />
                )}
                {isLast ? (
                  <span className="text-zinc-400" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url.replace('https://www.cashflowforecaster.io', '')}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1"
                  >
                    {isFirst && <Home className="h-3.5 w-3.5" aria-hidden="true" />}
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
