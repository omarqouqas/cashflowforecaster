'use client';

import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  FilterBar,
  FilterBarRow,
} from '@/components/filters/filter-bar';
import { FilterBarSearch } from '@/components/filters/filter-bar-search';
import { FilterDropdown, type FilterDropdownOption } from '@/components/filters/filter-dropdown';
import { FilterAmountPresets } from '@/components/filters/filter-amount-presets';
import { FilterDateRangeDropdown } from '@/components/filters/filter-date-range-dropdown';
import { AddFilterMenu, type AddFilterOption } from '@/components/filters/add-filter-menu';
import { ActiveFilterPills, type ActiveFilter } from '@/components/filters/active-filter-pills';
import { format } from 'date-fns';
import {
  FileEdit,
  Send,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Calendar,
  DollarSign,
} from 'lucide-react';

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';

export interface QuotesFilters {
  statuses: QuoteStatus[];
  expiringSoon: boolean;
  validUntilStart: Date | null;
  validUntilEnd: Date | null;
  amountMin: number | null;
  amountMax: number | null;
  search: string;
}

const allStatuses: QuoteStatus[] = ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'];

export const defaultQuotesFilters: QuotesFilters = {
  statuses: allStatuses,
  expiringSoon: false,
  validUntilStart: null,
  validUntilEnd: null,
  amountMin: null,
  amountMax: null,
  search: '',
};

// Filter dropdown options
const statusOptions: FilterDropdownOption[] = [
  { value: 'draft', label: 'Draft', icon: <FileEdit className="w-3.5 h-3.5" /> },
  { value: 'sent', label: 'Sent', icon: <Send className="w-3.5 h-3.5" /> },
  { value: 'viewed', label: 'Viewed', icon: <Eye className="w-3.5 h-3.5" /> },
  { value: 'accepted', label: 'Accepted', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  { value: 'rejected', label: 'Rejected', icon: <XCircle className="w-3.5 h-3.5" /> },
  { value: 'expired', label: 'Expired', icon: <Clock className="w-3.5 h-3.5" /> },
];

const expiringSoonOptions: FilterDropdownOption[] = [
  { value: 'expiring', label: 'Expiring Soon', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
];

// Filters that can be added via "+ Add filter" menu
const additionalFilters: AddFilterOption[] = [
  { key: 'expiringSoon', label: 'Expiring Soon', icon: <AlertTriangle className="w-4 h-4" /> },
  { key: 'validUntil', label: 'Valid Until', icon: <Calendar className="w-4 h-4" /> },
  { key: 'amount', label: 'Amount', icon: <DollarSign className="w-4 h-4" /> },
];

// Default visible filters (always shown)
const defaultVisibleFilters = ['status'];

interface QuotesFilterBarProps {
  filters: QuotesFilters;
  onChange: (filters: QuotesFilters) => void;
  resultCount: number;
  visibleFilters: string[];
  onVisibleFiltersChange: (filters: string[]) => void;
}

/**
 * QuotesFilterBar - Linear-style filter bar for the Quotes page
 */
export function QuotesFilterBar({
  filters,
  onChange,
  resultCount,
  visibleFilters,
  onVisibleFiltersChange,
}: QuotesFilterBarProps) {
  // Build active filter pills
  const activeFilterPills = React.useMemo((): ActiveFilter[] => {
    const pills: ActiveFilter[] = [];

    // Status filter
    if (filters.statuses.length > 0 && filters.statuses.length < allStatuses.length) {
      filters.statuses.forEach((status) => {
        const option = statusOptions.find((o) => o.value === status);
        if (option) {
          pills.push({ key: 'status', label: 'Status', value: option.label });
        }
      });
    }

    // Expiring soon filter
    if (filters.expiringSoon) {
      pills.push({ key: 'expiringSoon', label: 'Expiring', value: 'Soon' });
    }

    // Valid until filter
    if (filters.validUntilStart || filters.validUntilEnd) {
      let dateLabel = '';
      if (filters.validUntilStart && filters.validUntilEnd) {
        dateLabel = `${format(filters.validUntilStart, 'MMM d')} - ${format(filters.validUntilEnd, 'MMM d')}`;
      } else if (filters.validUntilStart) {
        dateLabel = `From ${format(filters.validUntilStart, 'MMM d')}`;
      } else if (filters.validUntilEnd) {
        dateLabel = `Until ${format(filters.validUntilEnd, 'MMM d')}`;
      }
      pills.push({ key: 'validUntil', label: 'Valid Until', value: dateLabel });
    }

    // Amount filter
    if (filters.amountMin !== null || filters.amountMax !== null) {
      let amountLabel = '';
      if (filters.amountMin !== null && filters.amountMax !== null) {
        amountLabel = `$${filters.amountMin} - $${filters.amountMax}`;
      } else if (filters.amountMin !== null) {
        amountLabel = `$${filters.amountMin}+`;
      } else if (filters.amountMax !== null) {
        amountLabel = `Under $${filters.amountMax}`;
      }
      pills.push({ key: 'amount', label: 'Amount', value: amountLabel });
    }

    // Search filter
    if (filters.search) {
      pills.push({ key: 'search', label: 'Search', value: filters.search });
    }

    return pills;
  }, [filters]);

  // Handle removing a filter pill
  const handleRemoveFilter = (key: string, value: string) => {
    switch (key) {
      case 'status': {
        const statusValue = statusOptions.find((o) => o.label === value)?.value as QuoteStatus;
        if (statusValue) {
          const newStatuses = filters.statuses.filter((s) => s !== statusValue);
          onChange({
            ...filters,
            statuses: newStatuses.length > 0 ? newStatuses : allStatuses,
          });
        }
        break;
      }
      case 'expiringSoon':
        onChange({ ...filters, expiringSoon: false });
        break;
      case 'validUntil':
        onChange({ ...filters, validUntilStart: null, validUntilEnd: null });
        break;
      case 'amount':
        onChange({ ...filters, amountMin: null, amountMax: null });
        break;
      case 'search':
        onChange({ ...filters, search: '' });
        break;
    }
  };

  // Handle clearing all filters
  const handleClearAll = () => {
    onChange(defaultQuotesFilters);
    onVisibleFiltersChange(defaultVisibleFilters);
  };

  // Get available filters for the "Add filter" menu
  const availableFilters = additionalFilters.filter(
    (f) => !visibleFilters.includes(f.key)
  );

  // Handle adding a filter to visible filters
  const handleAddFilter = (filterKey: string) => {
    onVisibleFiltersChange([...visibleFilters, filterKey]);
  };

  return (
    <FilterBar>
      <FilterBarRow>
        <FilterBarSearch
          value={filters.search}
          onChange={(value) => onChange({ ...filters, search: value })}
          placeholder="Search quotes..."
        />

        <FilterDropdown
          label="Status"
          options={statusOptions}
          value={filters.statuses}
          onChange={(value) =>
            onChange({ ...filters, statuses: value as QuoteStatus[] })
          }
          allowEmpty={false}
        />

        {visibleFilters.includes('expiringSoon') && (
          <FilterDropdown
            label="Expiring"
            options={expiringSoonOptions}
            value={filters.expiringSoon ? ['expiring'] : []}
            onChange={(value) =>
              onChange({ ...filters, expiringSoon: value.includes('expiring') })
            }
            allowEmpty={true}
          />
        )}

        {visibleFilters.includes('validUntil') && (
          <FilterDateRangeDropdown
            label="Valid Until"
            value={{ start: filters.validUntilStart, end: filters.validUntilEnd }}
            onChange={({ start, end }) =>
              onChange({ ...filters, validUntilStart: start, validUntilEnd: end })
            }
          />
        )}

        {visibleFilters.includes('amount') && (
          <FilterAmountPresets
            value={{ min: filters.amountMin, max: filters.amountMax }}
            onChange={({ min, max }) =>
              onChange({ ...filters, amountMin: min, amountMax: max })
            }
          />
        )}

        <AddFilterMenu
          availableFilters={availableFilters}
          onAdd={handleAddFilter}
        />
      </FilterBarRow>

      <ActiveFilterPills
        filters={activeFilterPills}
        onRemove={handleRemoveFilter}
        onClearAll={activeFilterPills.length > 0 ? handleClearAll : undefined}
        resultCount={resultCount}
      />
    </FilterBar>
  );
}

/**
 * Hook to manage quotes filter state with URL persistence
 */
export function useQuotesFilters(initialFilters?: Partial<QuotesFilters>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse visible filters from URL
  const visibleFiltersFromUrl = React.useMemo((): string[] => {
    const show = searchParams.get('show');
    if (show) {
      return [...defaultVisibleFilters, ...show.split(',')];
    }
    return defaultVisibleFilters;
  }, [searchParams]);

  const [visibleFilters, setVisibleFiltersState] = React.useState<string[]>(visibleFiltersFromUrl);

  // Parse filters from URL on initial load
  const filtersFromUrl = React.useMemo((): QuotesFilters => {
    const statuses = searchParams.get('status');
    const expiring = searchParams.get('expiring');
    const validStart = searchParams.get('valid_start');
    const validEnd = searchParams.get('valid_end');
    const minAmount = searchParams.get('min');
    const maxAmount = searchParams.get('max');
    const search = searchParams.get('q');

    return {
      statuses: statuses
        ? (statuses.split(',') as QuoteStatus[])
        : defaultQuotesFilters.statuses,
      expiringSoon: expiring === 'true',
      validUntilStart: validStart ? new Date(validStart + 'T00:00:00') : null,
      validUntilEnd: validEnd ? new Date(validEnd + 'T00:00:00') : null,
      amountMin: minAmount ? parseFloat(minAmount) : null,
      amountMax: maxAmount ? parseFloat(maxAmount) : null,
      search: search || '',
    };
  }, [searchParams]);

  const [filters, setFiltersState] = React.useState<QuotesFilters>({
    ...defaultQuotesFilters,
    ...filtersFromUrl,
    ...initialFilters,
  });

  // Sync state with URL changes
  React.useEffect(() => {
    setFiltersState({
      ...defaultQuotesFilters,
      ...filtersFromUrl,
    });
  }, [filtersFromUrl]);

  React.useEffect(() => {
    setVisibleFiltersState(visibleFiltersFromUrl);
  }, [visibleFiltersFromUrl]);

  // Update URL when filters change
  const updateUrl = React.useCallback(
    (newFilters: QuotesFilters, newVisibleFilters: string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      // Statuses
      const isDefaultStatuses = newFilters.statuses.length === allStatuses.length;
      if (isDefaultStatuses) {
        params.delete('status');
      } else {
        params.set('status', newFilters.statuses.join(','));
      }

      // Expiring soon
      if (newFilters.expiringSoon) {
        params.set('expiring', 'true');
      } else {
        params.delete('expiring');
      }

      // Valid until range
      if (newFilters.validUntilStart) {
        params.set('valid_start', newFilters.validUntilStart.toISOString().split('T')[0]!);
      } else {
        params.delete('valid_start');
      }
      if (newFilters.validUntilEnd) {
        params.set('valid_end', newFilters.validUntilEnd.toISOString().split('T')[0]!);
      } else {
        params.delete('valid_end');
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

      // Visible filters
      const additionalVisible = newVisibleFilters.filter(
        (f) => !defaultVisibleFilters.includes(f)
      );
      if (additionalVisible.length > 0) {
        params.set('show', additionalVisible.join(','));
      } else {
        params.delete('show');
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const setFilters = React.useCallback(
    (newFilters: QuotesFilters) => {
      setFiltersState(newFilters);
      updateUrl(newFilters, visibleFilters);
    },
    [updateUrl, visibleFilters]
  );

  const setVisibleFilters = React.useCallback(
    (newVisibleFilters: string[]) => {
      setVisibleFiltersState(newVisibleFilters);
      updateUrl(filters, newVisibleFilters);
    },
    [updateUrl, filters]
  );

  const resetFilters = React.useCallback(() => {
    setFiltersState(defaultQuotesFilters);
    setVisibleFiltersState(defaultVisibleFilters);
    updateUrl(defaultQuotesFilters, defaultVisibleFilters);
  }, [updateUrl]);

  const isFiltered = React.useMemo(() => {
    return (
      filters.statuses.length !== allStatuses.length ||
      filters.expiringSoon ||
      filters.validUntilStart !== null ||
      filters.validUntilEnd !== null ||
      filters.amountMin !== null ||
      filters.amountMax !== null ||
      filters.search !== ''
    );
  }, [filters]);

  return {
    filters,
    setFilters,
    visibleFilters,
    setVisibleFilters,
    resetFilters,
    isFiltered,
  };
}
