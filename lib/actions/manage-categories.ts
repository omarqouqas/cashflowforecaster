'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { captureServerEvent } from '@/lib/posthog/server';
import { DEFAULT_CATEGORIES, type UserCategory } from '@/lib/categories/constants';

// Re-export types for convenience (types are allowed in 'use server' files)
export type { UserCategory } from '@/lib/categories/constants';

/**
 * Fetch all categories for the current user
 */
export async function getUserCategories(): Promise<{
  success: boolean;
  categories?: UserCategory[];
  error?: string
}> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: categories, error } = await supabase
      .from('user_categories')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Failed to fetch categories:', error);
      return { success: false, error: 'Failed to load categories' };
    }

    return { success: true, categories: (categories || []) as UserCategory[] };
  } catch (err) {
    console.error('getUserCategories error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Create a new category
 */
export async function createCategory(data: {
  name: string;
  color: string;
  icon: string;
}): Promise<{ success: boolean; category?: UserCategory; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Validate name
    const trimmedName = data.name.trim();
    if (!trimmedName || trimmedName.length > 50) {
      return { success: false, error: 'Category name must be 1-50 characters' };
    }

    // Get the highest sort_order for the user
    const { data: existingCategories } = await supabase
      .from('user_categories')
      .select('sort_order')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextSortOrder = (existingCategories?.[0]?.sort_order ?? 0) + 1;

    const { data: category, error } = await supabase
      .from('user_categories')
      .insert({
        user_id: user.id,
        name: trimmedName,
        color: data.color,
        icon: data.icon,
        sort_order: nextSortOrder,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        return { success: false, error: 'A category with this name already exists' };
      }
      console.error('Failed to create category:', error);
      return { success: false, error: 'Failed to create category' };
    }

    await captureServerEvent('category_created', {
      distinctId: user.id,
      properties: {
        category_name: trimmedName,
        category_color: data.color,
        category_icon: data.icon,
      },
    });

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/bills');

    return { success: true, category: category as UserCategory };
  } catch (err) {
    console.error('createCategory error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Update an existing category
 */
export async function updateCategory(
  categoryId: string,
  data: {
    name?: string;
    color?: string;
    icon?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get the old category name first (for updating bills)
    const { data: oldCategory, error: fetchError } = await supabase
      .from('user_categories')
      .select('name')
      .eq('id', categoryId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !oldCategory) {
      return { success: false, error: 'Category not found' };
    }

    // Prepare update data
    const updateData: Record<string, string> = {};
    if (data.name !== undefined) {
      const trimmedName = data.name.trim();
      if (!trimmedName || trimmedName.length > 50) {
        return { success: false, error: 'Category name must be 1-50 characters' };
      }
      updateData.name = trimmedName;
    }
    if (data.color !== undefined) updateData.color = data.color;
    if (data.icon !== undefined) updateData.icon = data.icon;

    if (Object.keys(updateData).length === 0) {
      return { success: false, error: 'No changes provided' };
    }

    const { error } = await supabase
      .from('user_categories')
      .update(updateData)
      .eq('id', categoryId)
      .eq('user_id', user.id);

    if (error) {
      if (error.code === '23505') { // Unique violation
        return { success: false, error: 'A category with this name already exists' };
      }
      console.error('Failed to update category:', error);
      return { success: false, error: 'Failed to update category' };
    }

    // If name changed, update all bills with the old category name (case-insensitive)
    if (updateData.name && updateData.name !== oldCategory.name) {
      const { error: billsError } = await supabase
        .from('bills')
        .update({ category: updateData.name })
        .eq('user_id', user.id)
        .ilike('category', oldCategory.name);

      if (billsError) {
        console.error('Failed to update bills with new category name:', billsError);
        // Return warning but don't fail - category was renamed successfully
        // Bills will be updated on next interaction
        return {
          success: true,
          error: 'Category renamed but some bills may still show the old name. Please refresh the page.'
        };
      }
    }

    await captureServerEvent('category_updated', {
      distinctId: user.id,
      properties: {
        category_id: categoryId,
        changes: Object.keys(updateData),
      },
    });

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/bills');

    return { success: true };
  } catch (err) {
    console.error('updateCategory error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(categoryId: string): Promise<{
  success: boolean;
  error?: string;
  billsUsingCategory?: number;
}> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get the category name first
    const { data: category, error: fetchError } = await supabase
      .from('user_categories')
      .select('name')
      .eq('id', categoryId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !category) {
      return { success: false, error: 'Category not found' };
    }

    // Check if any bills are using this category (case-insensitive)
    const { count: billsCount } = await supabase
      .from('bills')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .ilike('category', category.name);

    if (billsCount && billsCount > 0) {
      return {
        success: false,
        error: `This category is used by ${billsCount} bill${billsCount > 1 ? 's' : ''}. Please reassign them first.`,
        billsUsingCategory: billsCount,
      };
    }

    const { error } = await supabase
      .from('user_categories')
      .delete()
      .eq('id', categoryId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to delete category:', error);
      return { success: false, error: 'Failed to delete category' };
    }

    await captureServerEvent('category_deleted', {
      distinctId: user.id,
      properties: {
        category_id: categoryId,
        category_name: category.name,
      },
    });

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/bills');

    return { success: true };
  } catch (err) {
    console.error('deleteCategory error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Reorder categories
 */
export async function reorderCategories(orderedIds: string[]): Promise<{
  success: boolean;
  error?: string
}> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Update each category's sort_order
    const updates = orderedIds.map((id, index) =>
      supabase
        .from('user_categories')
        .update({ sort_order: index + 1 })
        .eq('id', id)
        .eq('user_id', user.id)
    );

    // Use allSettled to handle partial failures gracefully
    const results = await Promise.allSettled(updates);

    // Check for any failures
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      console.error('Some category reorder updates failed:', failures);
      return {
        success: false,
        error: `Failed to update ${failures.length} of ${orderedIds.length} categories. Please try again.`
      };
    }

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/bills');

    return { success: true };
  } catch (err) {
    console.error('reorderCategories error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Seed default categories for a new user
 * Called during signup or when a user has no categories
 */
export async function seedDefaultCategories(): Promise<{
  success: boolean;
  error?: string
}> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if user already has categories
    const { count } = await supabase
      .from('user_categories')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (count && count > 0) {
      // User already has categories, don't seed
      return { success: true };
    }

    // Insert default categories one by one to handle race conditions
    // Using upsert with ON CONFLICT DO NOTHING equivalent
    for (const cat of DEFAULT_CATEGORIES) {
      const { error } = await supabase
        .from('user_categories')
        .upsert(
          {
            user_id: user.id,
            name: cat.name,
            color: cat.color,
            icon: cat.icon,
            sort_order: cat.sort_order,
          },
          {
            onConflict: 'user_id,name',
            ignoreDuplicates: true,
          }
        );

      if (error && error.code !== '23505') {
        // Log non-duplicate errors but continue
        console.error('Failed to seed category:', cat.name, error);
      }
    }

    return { success: true };
  } catch (err) {
    console.error('seedDefaultCategories error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
