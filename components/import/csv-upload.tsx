'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseCsv, type CsvParseResult } from '@/lib/import/parse-csv';

type Props = {
  onLoaded: (payload: { fileName: string; parsed: CsvParseResult }) => void;
};

export function CsvUpload({ onLoaded }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File | null) => {
    setError(null);
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a .csv file.');
      return;
    }

    // Check file size (max 5MB to prevent browser freezing)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 5MB.`);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
          isDragging
            ? 'border-teal-500 bg-teal-500/10'
            : 'border-zinc-700 hover:border-zinc-600'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-teal-400" />
          </div>
          <p className="text-base font-semibold text-zinc-100 mb-2">Upload your bank CSV</p>
          <p className="text-sm text-zinc-400 mb-4 max-w-md">
            Drag and drop your CSV file here, or click the button below to browse
          </p>
          <Button
            type="button"
            variant="secondary"
            onClick={() => document.getElementById('csv-file-input')?.click()}
            loading={isLoading}
          >
            Choose file
          </Button>
          <p className="text-xs text-zinc-500 mt-3">
            Accepts .csv files only (max 5MB)
          </p>
        </div>
      </div>

      <input
        id="csv-file-input"
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
      />

      {error && (
        <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg">
          <p className="text-sm text-rose-400">{error}</p>
        </div>
      )}
    </div>
  );
}


