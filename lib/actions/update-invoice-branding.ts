'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

type InvoiceBrandingSettings = {
  businessName: string | null;
  logoUrl: string | null;
};

export async function updateInvoiceBranding(data: InvoiceBrandingSettings) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Validate business name length
    if (data.businessName && data.businessName.length > 100) {
      return { success: false, error: 'Business name must be 100 characters or less' };
    }

    const { error: dbError } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: user.id,
          business_name: data.businessName?.trim() || null,
          logo_url: data.logoUrl || null,
        },
        { onConflict: 'user_id' }
      );

    if (dbError) {
      console.error('Failed to update invoice branding:', dbError);
      return { success: false, error: 'Failed to save settings' };
    }

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/invoices');

    return { success: true };
  } catch (err) {
    console.error('updateInvoiceBranding error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getInvoiceBranding() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('user_settings')
      .select('business_name, logo_url')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Failed to fetch invoice branding:', error);
      return null;
    }

    return {
      businessName: data?.business_name || null,
      logoUrl: data?.logo_url || null,
    };
  } catch (err) {
    console.error('getInvoiceBranding error:', err);
    return null;
  }
}

export async function uploadLogo(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const file = formData.get('logo') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Please upload a JPG, PNG, or WebP image.' };
    }

    // Validate file size (max 512KB)
    if (file.size > 512 * 1024) {
      return { success: false, error: 'File too large. Maximum size is 512KB.' };
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    const filename = `${user.id}/logo-${Date.now()}.${ext}`;

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Logo upload error:', uploadError);
      return { success: false, error: 'Failed to upload logo' };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('logos')
      .getPublicUrl(uploadData.path);

    const logoUrl = urlData.publicUrl;

    // Save URL to user settings
    const { error: dbError } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: user.id,
          logo_url: logoUrl,
        },
        { onConflict: 'user_id' }
      );

    if (dbError) {
      console.error('Failed to save logo URL:', dbError);
      return { success: false, error: 'Failed to save logo' };
    }

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/invoices');

    return { success: true, logoUrl };
  } catch (err) {
    console.error('uploadLogo error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function removeLogo() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get current logo URL to delete from storage
    const { data: settings } = await supabase
      .from('user_settings')
      .select('logo_url')
      .eq('user_id', user.id)
      .single();

    if (settings?.logo_url) {
      // Extract path from URL and delete from storage
      const urlParts = settings.logo_url.split('/logos/');
      if (urlParts[1]) {
        await supabase.storage.from('logos').remove([urlParts[1]]);
      }
    }

    // Clear logo URL in settings
    const { error: dbError } = await supabase
      .from('user_settings')
      .update({ logo_url: null })
      .eq('user_id', user.id);

    if (dbError) {
      console.error('Failed to remove logo:', dbError);
      return { success: false, error: 'Failed to remove logo' };
    }

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/invoices');

    return { success: true };
  } catch (err) {
    console.error('removeLogo error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
