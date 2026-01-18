'use client';

import { type ColumnMapping, detectColumnMapping } from '@/lib/import/parse-csv';
import { useEffect, useMemo } from 'react';
import { Label } from '@/components/ui/label';

type Props = {
  headers: string[];
  mapping: ColumnMapping;
  onChange: (next: ColumnMapping) => void;
};

function Select({
  label,
  value,
  onChange,
  headers,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  headers: string[];
}) {
  return (
    <div>
      <Label className="text-zinc-300 mb-1.5 block">{label}</Label>
      <div className="relative">
        <select
          value={value === null ? '' : String(value)}
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
          className={[
            'w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-zinc-100 min-h-[44px]',
            'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
          ].join(' ')}
        >
          <option value="">Select column…</option>
          {headers.map((h, idx) => (
            <option key={`${h}-${idx}`} value={idx}>
              {h || `(Column ${idx + 1})`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function ColumnMapper({ headers, mapping, onChange }: Props) {
  const detected = useMemo(() => detectColumnMapping(headers), [headers]);

  // Auto-fill once (only if unset)
  useEffect(() => {
    if (mapping.dateIndex !== null || mapping.descriptionIndex !== null || mapping.amountIndex !== null) return;
    onChange(detected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detected]);

  const hasDupes =
    mapping.dateIndex !== null &&
    (mapping.dateIndex === mapping.descriptionIndex || mapping.dateIndex === mapping.amountIndex) ||
    (mapping.descriptionIndex !== null && mapping.descriptionIndex === mapping.amountIndex);

  const isComplete = mapping.dateIndex !== null && mapping.descriptionIndex !== null && mapping.amountIndex !== null && !hasDupes;

  return (
    <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6">
      <p className="text-base font-semibold text-zinc-100">Map your columns</p>
      <p className="text-sm text-zinc-400 mt-1">
        Tell us which columns contain the date, description, and amount.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
        <Select
          label="Date"
          value={mapping.dateIndex}
          headers={headers}
          onChange={(v) => onChange({ ...mapping, dateIndex: v })}
        />
        <Select
          label="Description"
          value={mapping.descriptionIndex}
          headers={headers}
          onChange={(v) => onChange({ ...mapping, descriptionIndex: v })}
        />
        <Select
          label="Amount"
          value={mapping.amountIndex}
          headers={headers}
          onChange={(v) => onChange({ ...mapping, amountIndex: v })}
        />
      </div>

      {!isComplete && (
        <p className="text-sm text-amber-400 mt-4">
          Select three different columns to continue.
        </p>
      )}

      {hasDupes && (
        <p className="text-sm text-rose-400 mt-2">
          Each field must map to a different column.
        </p>
      )}
    </div>
  );
}


