'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * Hook to sync filter state with URL search parameters
 *
 * This provides URL persistence for filters, allowing users to share
 * filtered views and maintain filter state across page refreshes.
 */
export function useFilterParams<T extends Record<string, string | string[]>>(
  defaultValues: T
): [T, (newValues: Partial<T>) => void, () => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse current values from URL
  const currentValues = useMemo(() => {
    const values = { ...defaultValues };

    for (const key of Object.keys(defaultValues)) {
      const defaultValue = defaultValues[key];

      if (Array.isArray(defaultValue)) {
        // For array values, parse comma-separated string
        const param = searchParams.get(key);
        if (param) {
          (values as any)[key] = param.split(',').filter(Boolean);
        }
      } else {
        // For string values
        const param = searchParams.get(key);
        if (param) {
          (values as any)[key] = param;
        }
      }
    }

    return values;
  }, [searchParams, defaultValues]);

  // Update URL with new values
  const setValues = useCallback(
    (newValues: Partial<T>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(newValues)) {
        const defaultValue = defaultValues[key as keyof T];

        if (Array.isArray(value)) {
          // For array values
          const defaultArray = defaultValue as string[];
          const isDefault =
            value.length === defaultArray.length &&
            value.every((v) => defaultArray.includes(v));

          if (isDefault || value.length === 0) {
            params.delete(key);
          } else {
            params.set(key, value.join(','));
          }
        } else {
          // For string values
          if (value === defaultValue || !value) {
            params.delete(key);
          } else {
            params.set(key, value as string);
          }
        }
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(newUrl, { scroll: false });
    },
    [router, pathname, searchParams, defaultValues]
  );

  // Reset to defaults
  const resetValues = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  return [currentValues, setValues, resetValues];
}

/**
 * Serialize filter state to URL-safe string
 */
export function serializeFilters<T extends Record<string, any>>(
  filters: T,
  defaults: T
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    const defaultValue = defaults[key as keyof T];

    if (Array.isArray(value)) {
      const defaultArray = defaultValue as string[];
      const isDefault =
        value.length === defaultArray.length &&
        value.every((v: string) => defaultArray.includes(v));

      if (!isDefault && value.length > 0) {
        params.set(key, value.join(','));
      }
    } else if (value !== defaultValue && value) {
      params.set(key, String(value));
    }
  }

  return params.toString();
}

/**
 * Parse filter state from URL search params
 */
export function parseFilters<T extends Record<string, any>>(
  searchParams: URLSearchParams,
  defaults: T
): T {
  const values = { ...defaults };

  for (const key of Object.keys(defaults)) {
    const defaultValue = defaults[key];
    const param = searchParams.get(key);

    if (param) {
      if (Array.isArray(defaultValue)) {
        (values as any)[key] = param.split(',').filter(Boolean);
      } else {
        (values as any)[key] = param;
      }
    }
  }

  return values;
}
