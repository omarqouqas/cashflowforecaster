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
  AlertTriangle,
  Calendar,
  DollarSign,
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

// Filter dropdown options
const statusOptions: FilterDropdownOption[] = [
  { value: 'draft', label: 'Draft', icon: <FileEdit className="w-3.5 h-3.5" /> },
  { value: 'sent', label: 'Sent', icon: <Send className="w-3.5 h-3.5" /> },
  { value: 'viewed', label: 'Viewed', icon: <Eye className="w-3.5 h-3.5" /> },
  { value: 'paid', label: 'Paid', icon: <CheckCircle className="w-3.5 h-3.5" /> },
];

const overdueOptions: FilterDropdownOption[] = [
  { value: 'overdue', label: 'Overdue Only', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
];

// Filters that can be added via "+ Add filter" menu
const additionalFilters: AddFilterOption[] = [
  { key: 'overdue', label: 'Overdue', icon: <AlertTriangle className="w-4 h-4" /> },
  { key: 'dueDate', label: 'Due Date', icon: <Calendar className="w-4 h-4" /> },
  { key: 'amount', label: 'Amount', icon: <DollarSign className="w-4 h-4" /> },
];

// Default visible filters (always shown)
const defaultVisibleFilters = ['status'];

interface InvoicesFilterBarProps {
  filters: InvoicesFilters;
  onChange: (filters: InvoicesFilters) => void;
  resultCount: number;
  visibleFilters: string[];
  onVisibleFiltersChange: (filters: string[]) => void;
}

/**
 * InvoicesFilterBar - Linear-style filter bar for the Invoices page
 */
export function InvoicesFilterBar({
  filters,
  onChange,
  resultCount,
  visibleFilters,
  onVisibleFiltersChange,
}: InvoicesFilterBarProps) {
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

    // Overdue filter
    if (filters.overdue) {
      pills.push({ key: 'overdue', label: 'Overdue', value: 'Yes' });
    }

    // Due date filter
    if (filters.dueDateStart || filters.dueDateEnd) {
      let dateLabel = '';
      if (filters.dueDateStart && filters.dueDateEnd) {
        dateLabel = `${format(filters.dueDateStart, 'MMM d')} - ${format(filters.dueDateEnd, 'MMM d')}`;
      } else if (filters.dueDateStart) {
        dateLabel = `From ${format(filters.dueDateStart, 'MMM d')}`;
      } else if (filters.dueDateEnd) {
        dateLabel = `Until ${format(filters.dueDateEnd, 'MMM d')}`;
      }
      pills.push({ key: 'dueDate', label: 'Due Date', value: dateLabel });
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
        const statusValue = statusOptions.find((o) => o.label === value)?.value as InvoiceStatus;
        if (statusValue) {
          const newStatuses = filters.statuses.filter((s) => s !== statusValue);
          onChange({
            ...filters,
            statuses: newStatuses.length > 0 ? newStatuses : allStatuses,
          });
        }
        break;
      }
      case 'overdue':
        onChange({ ...filters, overdue: false });
        break;
      case 'dueDate':
        onChange({ ...filters, dueDateStart: null, dueDateEnd: null });
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
    onChange(defaultInvoicesFilters);
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
          placeholder="Search invoices..."
        />

        <FilterDropdown
          label="Status"
          options={statusOptions}
          value={filters.statuses}
          onChange={(value) =>
            onChange({ ...filters, statuses: value as InvoiceStatus[] })
          }
          allowEmpty={false}
        />

        {visibleFilters.includes('overdue') && (
          <FilterDropdown
            label="Overdue"
            options={overdueOptions}
            value={filters.overdue ? ['overdue'] : []}
            onChange={(value) =>
              onChange({ ...filters, overdue: value.includes('overdue') })
            }
            allowEmpty={true}
          />
        )}

        {visibleFilters.includes('dueDate') && (
          <FilterDateRangeDropdown
            label="Due Date"
            value={{ start: filters.dueDateStart, end: filters.dueDateEnd }}
            onChange={({ start, end }) =>
              onChange({ ...filters, dueDateStart: start, dueDateEnd: end })
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
 * Hook to manage invoices filter state with URL persistence
 */
export function useInvoicesFilters(initialFilters?: Partial<InvoicesFilters>) {
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

  React.useEffect(() => {
    setVisibleFiltersState(visibleFiltersFromUrl);
  }, [visibleFiltersFromUrl]);

  // Update URL when filters change
  const updateUrl = React.useCallback(
    (newFilters: InvoicesFilters, newVisibleFilters: string[]) => {
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
    (newFilters: InvoicesFilters) => {
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
    setFiltersState(defaultInvoicesFilters);
    setVisibleFiltersState(defaultVisibleFilters);
    updateUrl(defaultInvoicesFilters, defaultVisibleFilters);
  }, [updateUrl]);

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
    visibleFilters,
    setVisibleFilters,
    resetFilters,
    isFiltered,
  };
}
