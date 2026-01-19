'use client';

import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  FilterPanel,
  FilterSection,
  FilterToggleGroup,
  FilterAmountRange,
  FilterSearch,
  FilterDateRange,
  type FilterOption,
} from '@/components/filters';
import {
  FileEdit,
  Send,
  Eye,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid';

export interface InvoicesFilters {
  statuses: InvoiceStatus[];
  overdue: boolean;
  dueDateStart: Date | null;
  dueDateEnd: Date | null;
  amountMin: number | null;
  amountMax: number | null;
  search: string;
}

const allStatuses: InvoiceStatus[] = ['draft', 'sent', 'viewed', 'paid'];

export const defaultInvoicesFilters: InvoicesFilters = {
  statuses: allStatuses,
  overdue: false,
  dueDateStart: null,
  dueDateEnd: null,
  amountMin: null,
  amountMax: null,
  search: '',
};

interface InvoicesFiltersProps {
  filters: InvoicesFilters;
  onChange: (filters: InvoicesFilters) => void;
}

const statusOptions: FilterOption[] = [
  {
    value: 'draft',
    label: 'Draft',
    icon: <FileEdit className="w-3.5 h-3.5" />,
    color: 'default',
  },
  {
    value: 'sent',
    label: 'Sent',
    icon: <Send className="w-3.5 h-3.5" />,
    color: 'teal',
  },
  {
    value: 'viewed',
    label: 'Viewed',
    icon: <Eye className="w-3.5 h-3.5" />,
    color: 'yellow',
  },
  {
    value: 'paid',
    label: 'Paid',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    color: 'green',
  },
];

const overdueOptions: FilterOption[] = [
  {
    value: 'overdue',
    label: 'Overdue Only',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    color: 'red',
  },
];

/**
 * InvoicesFiltersPanel - Filter controls for the Invoices page
 *
 * Allows filtering by:
 * - Status (Draft / Sent / Viewed / Paid)
 * - Overdue toggle
 * - Due date range
 * - Amount range (min/max)
 * - Search by client name or invoice number
 */
export function InvoicesFiltersPanel({ filters, onChange }: InvoicesFiltersProps) {
  // Count active filters (filters that differ from defaults)
  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (filters.statuses.length !== allStatuses.length) count++;
    if (filters.overdue) count++;
    if (filters.dueDateStart !== null || filters.dueDateEnd !== null) count++;
    if (filters.amountMin !== null || filters.amountMax !== null) count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  const handleClearAll = () => {
    onChange(defaultInvoicesFilters);
  };

  return (
    <FilterPanel
      activeFilterCount={activeFilterCount}
      onClearAll={handleClearAll}
      collapsible={true}
      defaultCollapsed={activeFilterCount === 0}
    >
      <FilterSection>
        <FilterToggleGroup
          label="Status"
          options={statusOptions}
          value={filters.statuses}
          onChange={(value) =>
            onChange({
              ...filters,
              statuses: value as InvoiceStatus[],
            })
          }
          allowEmpty={false}
        />

        <FilterToggleGroup
          label="Overdue"
          options={overdueOptions}
          value={filters.overdue ? ['overdue'] : []}
          onChange={(value) =>
            onChange({
              ...filters,
              overdue: value.includes('overdue'),
            })
          }
          allowEmpty={true}
        />
      </FilterSection>

      <FilterSection>
        <FilterDateRange
          label="Due Date"
          startDate={filters.dueDateStart}
          endDate={filters.dueDateEnd}
          onChange={(start, end) =>
            onChange({
              ...filters,
              dueDateStart: start,
              dueDateEnd: end,
            })
          }
        />
      </FilterSection>

      <FilterSection>
        <FilterAmountRange
          label="Amount Range"
          minValue={filters.amountMin}
          maxValue={filters.amountMax}
          onChange={(min, max) =>
            onChange({
              ...filters,
              amountMin: min,
              amountMax: max,
            })
          }
        />

        <FilterSearch
          label="Search"
          value={filters.search}
          onChange={(value) =>
            onChange({
              ...filters,
              search: value,
            })
          }
          placeholder="Search by client or invoice #..."
        />
      </FilterSection>
    </FilterPanel>
  );
}

/**
 * Hook to manage invoices filter state with URL persistence
 */
export function useInvoicesFilters(initialFilters?: Partial<InvoicesFilters>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse filters from URL on initial load
  const filtersFromUrl = React.useMemo((): InvoicesFilters => {
    const statuses = searchParams.get('status');
    const overdue = searchParams.get('overdue');
    const dueStart = searchParams.get('due_start');
    const dueEnd = searchParams.get('due_end');
    const minAmount = searchParams.get('min');
    const maxAmount = searchParams.get('max');
    const search = searchParams.get('q');

    return {
      statuses: statuses
        ? (statuses.split(',') as InvoiceStatus[])
        : defaultInvoicesFilters.statuses,
      overdue: overdue === 'true',
      dueDateStart: dueStart ? new Date(dueStart + 'T00:00:00') : null,
      dueDateEnd: dueEnd ? new Date(dueEnd + 'T00:00:00') : null,
      amountMin: minAmount ? parseFloat(minAmount) : null,
      amountMax: maxAmount ? parseFloat(maxAmount) : null,
      search: search || '',
    };
  }, [searchParams]);

  const [filters, setFiltersState] = React.useState<InvoicesFilters>({
    ...defaultInvoicesFilters,
    ...filtersFromUrl,
    ...initialFilters,
  });

  // Sync state with URL changes
  React.useEffect(() => {
    setFiltersState({
      ...defaultInvoicesFilters,
      ...filtersFromUrl,
    });
  }, [filtersFromUrl]);

  // Update URL when filters change
  const setFilters = React.useCallback(
    (newFilters: InvoicesFilters) => {
      setFiltersState(newFilters);

      // Update URL params
      const params = new URLSearchParams(searchParams.toString());

      // Statuses
      const isDefaultStatuses = newFilters.statuses.length === allStatuses.length;
      if (isDefaultStatuses) {
        params.delete('status');
      } else {
        params.set('status', newFilters.statuses.join(','));
      }

      // Overdue
      if (newFilters.overdue) {
        params.set('overdue', 'true');
      } else {
        params.delete('overdue');
      }

      // Due date range
      if (newFilters.dueDateStart) {
        params.set('due_start', newFilters.dueDateStart.toISOString().split('T')[0]!);
      } else {
        params.delete('due_start');
      }

      if (newFilters.dueDateEnd) {
        params.set('due_end', newFilters.dueDateEnd.toISOString().split('T')[0]!);
      } else {
        params.delete('due_end');
      }

      // Amount range
      if (newFilters.amountMin !== null) {
        params.set('min', newFilters.amountMin.toString());
      } else {
        params.delete('min');
      }

      if (newFilters.amountMax !== null) {
        params.set('max', newFilters.amountMax.toString());
      } else {
        params.delete('max');
      }

      // Search
      if (newFilters.search) {
        params.set('q', newFilters.search);
      } else {
        params.delete('q');
      }

      // Update URL without scroll
      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const resetFilters = React.useCallback(() => {
    setFilters(defaultInvoicesFilters);
  }, [setFilters]);

  const isFiltered = React.useMemo(() => {
    return (
      filters.statuses.length !== allStatuses.length ||
      filters.overdue ||
      filters.dueDateStart !== null ||
      filters.dueDateEnd !== null ||
      filters.amountMin !== null ||
      filters.amountMax !== null ||
      filters.search !== ''
    );
  }, [filters]);

  return {
    filters,
    setFilters,
    resetFilters,
    isFiltered,
  };
}
