'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { parseCsv, type CsvParseResult } from '@/lib/import/parse-csv';

type Props = {
  onLoaded: (payload: { fileName: string; parsed: CsvParseResult }) => void;
};

export function CsvUpload({ onLoaded }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = async (file: File | null) => {
    setError(null);
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a .csv file.');
      return;
    }

    setIsLoading(true);
    try {
      const text = await file.text();
      const parsed = parseCsv(text);
      if (parsed.headers.length === 0) {
        setError('Could not find a header row. Make sure this is a valid CSV export.');
        return;
      }
      onLoaded({ fileName: file.name, parsed });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to read CSV.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-zinc-200 bg-white rounded-lg p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-base font-semibold text-zinc-900">Upload your bank CSV</p>
          <p className="text-sm text-zinc-500 mt-1">
            Export transactions from your bank and upload the CSV here. You&apos;ll review everything before importing.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => document.getElementById('csv-file-input')?.click()}
          loading={isLoading}
        >
          Choose file
        </Button>
      </div>

      <input
        id="csv-file-input"
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
      />

      {error && <p className="text-sm text-rose-600 mt-4">{error}</p>}
    </div>
  );
}


