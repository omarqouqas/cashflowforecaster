'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Upload, HelpCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseYnabCsv, type YnabParseResult } from '@/lib/import/parse-ynab-csv';

type Props = {
  onLoaded: (payload: { fileName: string; result: YnabParseResult }) => void;
};

export function YnabCsvUpload({ onLoaded }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleFile = async (file: File | null) => {
    setError(null);
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a .csv file.');
      return;
    }

    // Check file size (max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 5MB.`);
      return;
    }

    setIsLoading(true);
    try {
      const text = await file.text();
      const result = parseYnabCsv(text);

      // Check if format was detected
      if (result.format === 'unknown') {
        setError(
          'This doesn\'t look like a YNAB export. Expected columns: Date, Payee, Category, Memo, Outflow, Inflow. Try the generic CSV import instead.'
        );
        return;
      }

      onLoaded({ fileName: file.name, result });
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
          <p className="text-base font-semibold text-zinc-100 mb-2">Upload your YNAB export</p>
          <p className="text-sm text-zinc-400 mb-4 max-w-md">
            Drag and drop your YNAB CSV file here, or click the button below to browse
          </p>
          <Button
            type="button"
            variant="secondary"
            onClick={() => document.getElementById('ynab-csv-file-input')?.click()}
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
        id="ynab-csv-file-input"
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
      />

      {error && (
        <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg">
          <p className="text-sm text-rose-400">{error}</p>
          <Link
            href="/dashboard/import"
            className="inline-flex items-center gap-1 text-sm text-teal-400 hover:text-teal-300 mt-2"
          >
            Try generic CSV import
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>How do I export from YNAB?</span>
          {showHelp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showHelp && (
          <div className="mt-3 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm">
            <p className="text-zinc-300 font-medium mb-3">To export your transactions from YNAB:</p>

            <ol className="list-decimal list-inside text-zinc-400 space-y-2 mb-4">
              <li>Open YNAB and go to your desired <span className="text-zinc-300">Account</span></li>
              <li>Click the <span className="text-zinc-300">Export</span> button (usually in the top-right)</li>
              <li>Select <span className="text-zinc-300">Export as CSV</span></li>
              <li>Save the file and upload it here</li>
            </ol>

            <p className="text-zinc-400 font-medium mb-2">Supported YNAB formats:</p>
            <ul className="list-disc list-inside text-zinc-400 space-y-1 mb-3">
              <li><span className="text-zinc-300">Basic export:</span> Date, Payee, Category, Memo, Outflow, Inflow</li>
              <li><span className="text-zinc-300">Register export:</span> Account, Flag, Date, Payee, Category, Memo, Outflow, Inflow, Cleared</li>
            </ul>

            <div className="mt-3 p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg">
              <p className="text-teal-300 text-xs">
                <strong>Tip:</strong> We&apos;ll automatically combine Outflow and Inflow into a single amount,
                and use your YNAB categories to suggest whether each transaction is income or a bill.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
