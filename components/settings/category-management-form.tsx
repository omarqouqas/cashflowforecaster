'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Tag, Plus, Pencil, Trash2, Check,
  Home, Zap, Repeat, Shield, Car, Heart, Plane,
  Utensils, ShoppingBag, Briefcase, Gift, Music, Film,
  Gamepad2, Book, GraduationCap, Dumbbell, Pill, Baby,
  Dog, TreeDeciduous, Sun, Umbrella, CreditCard, Phone, Wifi,
  Tv, Laptop, Wrench, Scissors, Shirt
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  seedDefaultCategories,
} from '@/lib/actions/manage-categories';
import {
  type UserCategory,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
} from '@/lib/categories/constants';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

// Map icon names to components
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'home': Home,
  'zap': Zap,
  'repeat': Repeat,
  'shield': Shield,
  'tag': Tag,
  'car': Car,
  'heart': Heart,
  'plane': Plane,
  'utensils': Utensils,
  'shopping-bag': ShoppingBag,
  'briefcase': Briefcase,
  'gift': Gift,
  'music': Music,
  'film': Film,
  'gamepad-2': Gamepad2,
  'book': Book,
  'graduation-cap': GraduationCap,
  'dumbbell': Dumbbell,
  'pill': Pill,
  'baby': Baby,
  'dog': Dog,
  'tree': TreeDeciduous,
  'sun': Sun,
  'umbrella': Umbrella,
  'credit-card': CreditCard,
  'phone': Phone,
  'wifi': Wifi,
  'tv': Tv,
  'laptop': Laptop,
  'wrench': Wrench,
  'scissors': Scissors,
  'shirt': Shirt,
};

// Color classes mapping
const COLOR_CLASSES: Record<string, { bg: string; text: string; border: string }> = {
  'rose': { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500' },
  'amber': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500' },
  'yellow': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500' },
  'lime': { bg: 'bg-lime-500/20', text: 'text-lime-400', border: 'border-lime-500' },
  'emerald': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500' },
  'teal': { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500' },
  'cyan': { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500' },
  'blue': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500' },
  'indigo': { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500' },
  'violet': { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500' },
  'purple': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500' },
  'pink': { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500' },
  'zinc': { bg: 'bg-zinc-500/20', text: 'text-zinc-400', border: 'border-zinc-500' },
};

function CategoryIcon({ icon, color, size = 'md' }: { icon: string; color: string; size?: 'sm' | 'md' }) {
  const IconComponent = ICON_MAP[icon] || Tag;
  const colorClasses = COLOR_CLASSES[color] ?? COLOR_CLASSES.zinc;
  const sizeClasses = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className={cn(sizeClasses, 'rounded-lg flex items-center justify-center', colorClasses?.bg)}>
      <IconComponent className={cn(iconSize, colorClasses?.text)} />
    </div>
  );
}

type EditingCategory = {
  id: string | null; // null = new category
  name: string;
  color: string;
  icon: string;
};

type Props = {
  initialCategories: UserCategory[];
};

export function CategoryManagementForm({ initialCategories }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState(initialCategories);
  const [editing, setEditing] = useState<EditingCategory | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Seed default categories if user has none
  useEffect(() => {
    async function seedIfEmpty() {
      if (initialCategories.length === 0) {
        await seedDefaultCategories();
        router.refresh();
      }
    }
    seedIfEmpty();
  }, [initialCategories.length, router]);

  const startNewCategory = () => {
    setEditing({
      id: null,
      name: '',
      color: 'teal',
      icon: 'tag',
    });
    setShowColorPicker(false);
    setShowIconPicker(false);
  };

  const startEditCategory = (category: UserCategory) => {
    setEditing({
      id: category.id,
      name: category.name,
      color: category.color,
      icon: category.icon,
    });
    setShowColorPicker(false);
    setShowIconPicker(false);
  };

  const cancelEditing = () => {
    setEditing(null);
    setShowColorPicker(false);
    setShowIconPicker(false);
  };

  const handleSave = async () => {
    if (!editing) return;

    const trimmedName = editing.name.trim();
    if (!trimmedName) {
      toast.error('Category name is required');
      return;
    }

    startTransition(async () => {
      if (editing.id === null) {
        // Create new category
        const result = await createCategory({
          name: trimmedName,
          color: editing.color,
          icon: editing.icon,
        });

        if (result.success && result.category) {
          setCategories([...categories, result.category]);
          setEditing(null);
          toast.success('Category created');
          router.refresh();
        } else {
          toast.error(result.error || 'Failed to create category');
        }
      } else {
        // Update existing category
        const result = await updateCategory(editing.id, {
          name: trimmedName,
          color: editing.color,
          icon: editing.icon,
        });

        if (result.success) {
          setCategories(
            categories.map((c) =>
              c.id === editing.id
                ? { ...c, name: trimmedName, color: editing.color, icon: editing.icon }
                : c
            )
          );
          setEditing(null);
          toast.success('Category updated');
          router.refresh();
        } else {
          toast.error(result.error || 'Failed to update category');
        }
      }
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const result = await deleteCategory(id);

      if (result.success) {
        setCategories(categories.filter((c) => c.id !== id));
        setDeletingId(null);
        toast.success('Category deleted');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete category');
        setDeletingId(null);
      }
    });
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
            <Tag className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-100">Bill Categories</h3>
            <p className="text-sm text-zinc-400">Organize your bills with custom categories</p>
          </div>
        </div>
        {!editing && (
          <Button
            variant="secondary"
            size="sm"
            onClick={startNewCategory}
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        )}
      </div>

      {/* Category List */}
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id}>
            {editing?.id === category.id ? (
              // Edit form
              <CategoryEditForm
                editing={editing}
                setEditing={setEditing}
                showColorPicker={showColorPicker}
                setShowColorPicker={setShowColorPicker}
                showIconPicker={showIconPicker}
                setShowIconPicker={setShowIconPicker}
                onSave={handleSave}
                onCancel={cancelEditing}
                isPending={isPending}
              />
            ) : deletingId === category.id ? (
              // Delete confirmation
              <div className="flex items-center justify-between p-3 bg-rose-500/10 rounded-lg border border-rose-500/30">
                <p className="text-sm text-rose-300">Delete &ldquo;{category.name}&rdquo;?</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDeletingId(null)}
                    className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-300"
                    disabled={isPending}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(category.id)}
                    className="px-3 py-1.5 text-sm bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50"
                    disabled={isPending}
                  >
                    {isPending ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ) : (
              // Display row
              <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors group">
                <div className="flex items-center gap-3">
                  <CategoryIcon icon={category.icon} color={category.color} />
                  <span className="text-zinc-100">{category.name}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => startEditCategory(category)}
                    className="p-2 text-zinc-400 hover:text-teal-400 transition-colors"
                    title="Edit category"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingId(category.id)}
                    className="p-2 text-zinc-400 hover:text-rose-400 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* New category form */}
        {editing?.id === null && (
          <CategoryEditForm
            editing={editing}
            setEditing={setEditing}
            showColorPicker={showColorPicker}
            setShowColorPicker={setShowColorPicker}
            showIconPicker={showIconPicker}
            setShowIconPicker={setShowIconPicker}
            onSave={handleSave}
            onCancel={cancelEditing}
            isPending={isPending}
          />
        )}
      </div>

      {categories.length === 0 && !editing && (
        <div className="text-center py-8 text-zinc-500">
          <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No categories yet</p>
          <p className="text-sm">Add your first category to get started</p>
        </div>
      )}
    </div>
  );
}

// Edit form component
function CategoryEditForm({
  editing,
  setEditing,
  showColorPicker,
  setShowColorPicker,
  showIconPicker,
  setShowIconPicker,
  onSave,
  onCancel,
  isPending,
}: {
  editing: EditingCategory;
  setEditing: (editing: EditingCategory) => void;
  showColorPicker: boolean;
  setShowColorPicker: (show: boolean) => void;
  showIconPicker: boolean;
  setShowIconPicker: (show: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const colorClasses = COLOR_CLASSES[editing.color] ?? COLOR_CLASSES.zinc;

  return (
    <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 space-y-4">
      {/* Name input */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Category Name</label>
        <input
          type="text"
          value={editing.name}
          onChange={(e) => setEditing({ ...editing, name: e.target.value })}
          placeholder="Enter category name"
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          maxLength={50}
          autoFocus
        />
      </div>

      {/* Color & Icon pickers */}
      <div className="flex gap-4">
        {/* Color picker */}
        <div className="relative">
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">Color</label>
          <button
            type="button"
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowIconPicker(false);
            }}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors',
              showColorPicker
                ? 'border-teal-500 bg-zinc-900'
                : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600'
            )}
          >
            <div className={cn('w-4 h-4 rounded', colorClasses?.bg, colorClasses?.border, 'border')} />
            <span className="text-sm text-zinc-300 capitalize">{editing.color}</span>
          </button>

          {showColorPicker && (
            <div className="absolute z-10 mt-2 p-3 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl">
              <div className="grid grid-cols-5 gap-2">
                {CATEGORY_COLORS.map((color) => {
                  const classes = COLOR_CLASSES[color];
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setEditing({ ...editing, color });
                        setShowColorPicker(false);
                      }}
                      className={cn(
                        'w-8 h-8 rounded-lg border-2 transition-all',
                        classes?.bg,
                        editing.color === color
                          ? cn(classes?.border, 'scale-110')
                          : 'border-transparent hover:scale-105'
                      )}
                      title={color}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Icon picker */}
        <div className="relative">
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">Icon</label>
          <button
            type="button"
            onClick={() => {
              setShowIconPicker(!showIconPicker);
              setShowColorPicker(false);
            }}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors',
              showIconPicker
                ? 'border-teal-500 bg-zinc-900'
                : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600'
            )}
          >
            <CategoryIcon icon={editing.icon} color={editing.color} size="sm" />
          </button>

          {showIconPicker && (
            <div className="absolute z-10 mt-2 p-3 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl max-h-48 overflow-y-auto">
              <div className="grid grid-cols-6 gap-2">
                {CATEGORY_ICONS.map((icon) => {
                  const IconComponent = ICON_MAP[icon] || Tag;
                  return (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => {
                        setEditing({ ...editing, icon });
                        setShowIconPicker(false);
                      }}
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                        editing.icon === icon
                          ? 'bg-teal-500/20 text-teal-400 scale-110'
                          : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-300'
                      )}
                      title={icon}
                    >
                      <IconComponent className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-colors"
          disabled={isPending || !editing.name.trim()}
        >
          <Check className="w-3.5 h-3.5" />
          {isPending ? 'Saving...' : editing.id ? 'Save' : 'Create'}
        </button>
      </div>
    </div>
  );
}

// Export the icon map and color classes for use in other components
export { ICON_MAP, COLOR_CLASSES };
