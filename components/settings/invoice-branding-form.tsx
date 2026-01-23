'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileImage, Trash2, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';
import {
  updateInvoiceBranding,
  uploadLogo,
  removeLogo,
} from '@/lib/actions/update-invoice-branding';
import Image from 'next/image';

const brandingSchema = z.object({
  businessName: z
    .string()
    .max(100, 'Business name must be 100 characters or less')
    .optional()
    .transform((val) => val?.trim() || null),
});

type BrandingFormData = z.infer<typeof brandingSchema>;

interface InvoiceBrandingFormProps {
  initialBusinessName: string | null;
  initialLogoUrl: string | null;
  userEmail: string;
}

export function InvoiceBrandingForm({
  initialBusinessName,
  initialLogoUrl,
  userEmail,
}: InvoiceBrandingFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl);
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      businessName: initialBusinessName || '',
    },
  });

  const businessName = watch('businessName') || '';

  const onSubmit = async (data: BrandingFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const result = await updateInvoiceBranding({
      businessName: data.businessName || null,
      logoUrl: logoUrl,
    });

    if (!result.success) {
      setError(result.error || 'Failed to save settings');
    } else {
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    }

    setIsSubmitting(false);
  };

  const processFile = async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, or WebP image.');
      return;
    }

    // Validate file size (512KB)
    if (file.size > 512 * 1024) {
      setError('File too large. Maximum size is 512KB.');
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('logo', file);

    const result = await uploadLogo(formData);

    if (!result.success) {
      setError(result.error || 'Failed to upload logo');
    } else if (result.logoUrl) {
      setLogoUrl(result.logoUrl);
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    }

    setIsUploading(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveLogo = async () => {
    setIsRemoving(true);
    setError(null);

    const result = await removeLogo();

    if (!result.success) {
      setError(result.error || 'Failed to remove logo');
    } else {
      setLogoUrl(null);
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    }

    setIsRemoving(false);
  };

  // Display name for preview
  const displayName = businessName.trim() || null;

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
          <FileImage className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-100">Invoice Branding</h3>
          <p className="text-sm text-zinc-400">
            Customize how your invoices look to clients
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Logo Upload - Drop Zone */}
        <div>
          <Label className="text-zinc-300 mb-2 block">Business Logo</Label>
          <div className="flex items-start gap-4">
            {/* Clickable Drop Zone */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              id="logo-upload"
            />
            <div
              onClick={() => !isUploading && fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                w-28 h-28 rounded-lg flex flex-col items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer transition-all
                ${logoUrl
                  ? 'bg-zinc-950 border border-zinc-800 hover:border-zinc-700'
                  : `border-2 border-dashed ${isDragging ? 'border-teal-400 bg-teal-400/5' : 'border-zinc-700 hover:border-zinc-600 bg-zinc-950/50'}`
                }
                ${isUploading ? 'opacity-50 cursor-wait' : ''}
              `}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <svg
                    className="animate-spin h-6 w-6 text-teal-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="text-xs text-zinc-500">Uploading...</span>
                </div>
              ) : logoUrl ? (
                <Image
                  src={logoUrl}
                  alt="Business logo"
                  width={112}
                  height={112}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-1.5 p-2">
                  <ImagePlus className="w-7 h-7 text-zinc-500" />
                  <span className="text-xs text-zinc-500 text-center">
                    Click or drag to upload
                  </span>
                </div>
              )}
            </div>

            {/* Upload Info & Remove */}
            <div className="flex-1 space-y-2 pt-1">
              <p className="text-xs text-zinc-500">
                JPG, PNG, or WebP. Max 512KB.
                <br />
                Recommended: 200×200px or larger.
              </p>
              {logoUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isRemoving}
                  onClick={handleRemoveLogo}
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 -ml-2"
                >
                  {isRemoving ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Removing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      Remove logo
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Business Name with Character Count */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="businessName" className="text-zinc-300">
              Business Name
            </Label>
            <span className={`text-xs ${businessName.length > 100 ? 'text-rose-400' : 'text-zinc-500'}`}>
              {businessName.length}/100
            </span>
          </div>
          <Input
            id="businessName"
            type="text"
            placeholder="Your business name (optional)"
            maxLength={100}
            className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-teal-500"
            {...register('businessName')}
          />
          <FormError message={errors.businessName?.message} />
          <p className="text-sm text-zinc-500 mt-1.5">
            Displayed on invoices instead of your email address
          </p>
        </div>

        {/* Invoice Preview */}
        <div>
          <Label className="text-zinc-300 mb-2 block">Preview</Label>
          <div className="bg-white rounded-lg p-4 text-gray-900">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {logoUrl && (
                  <Image
                    src={logoUrl}
                    alt="Logo preview"
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                )}
                <span className="font-bold text-sm tracking-wide">INVOICE</span>
              </div>
              <span className="text-xs text-gray-500">INV-001</span>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex-1 border border-gray-200 rounded p-2">
                <p className="text-gray-400 uppercase text-[10px] mb-0.5">From</p>
                {displayName && (
                  <p className="font-medium text-gray-900">{displayName}</p>
                )}
                <p className="text-gray-600 truncate">{userEmail}</p>
              </div>
              <div className="flex-1 border border-gray-200 rounded p-2">
                <p className="text-gray-400 uppercase text-[10px] mb-0.5">To</p>
                <p className="font-medium text-gray-900">Client Name</p>
                <p className="text-gray-600">client@example.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-sm text-emerald-400">
            Settings saved successfully
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-sm text-rose-400">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
