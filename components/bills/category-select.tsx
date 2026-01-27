'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Check, Settings } from 'lucide-react';
import {
  Home, Zap, Repeat, Shield, Tag, Car, Heart, Plane,
  Utensils, ShoppingBag, Briefcase, Gift, Music, Film,
  Gamepad2, Book, GraduationCap, Dumbbell, Pill, Baby,
  Dog, TreeDeciduous, Sun, Umbrella, CreditCard, Phone, Wifi,
  Tv, Laptop, Wrench, Scissors, Shirt
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { type UserCategory, CATEGORY_COLORS, CATEGORY_ICONS, DEFAULT_CATEGORIES } from '@/lib/categories/constants';
import { showError } from '@/lib/toast';
import Link from 'next/link';

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

// Color classes for Tailwind
const COLOR_CLASSES: Record<string, { bg: string; text: string; ring: string }> = {
  rose: { bg: 'bg-rose-500/20', text: 'text-rose-400', ring: 'ring-rose-500' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', ring: 'ring-amber-500' },
  yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', ring: 'ring-yellow-500' },
  lime: { bg: 'bg-lime-500/20', text: 'text-lime-400', ring: 'ring-lime-500' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', ring: 'ring-emerald-500' },
  teal: { bg: 'bg-teal-500/20', text: 'text-teal-400', ring: 'ring-teal-500' },
  cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', ring: 'ring-cyan-500' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', ring: 'ring-blue-500' },
  indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', ring: 'ring-indigo-500' },
  violet: { bg: 'bg-violet-500/20', text: 'text-violet-400', ring: 'ring-violet-500' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', ring: 'ring-purple-500' },
  pink: { bg: 'bg-pink-500/20', text: 'text-pink-400', ring: 'ring-pink-500' },
  zinc: { bg: 'bg-zinc-500/20', text: 'text-zinc-400', ring: 'ring-zinc-500' },
};

// Pending category that hasn't been saved to DB yet
export interface PendingCategory {
  name: string;
  color: string;
  icon: string;
}

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  categories: UserCategory[];
  /** Called when user creates a new category inline - category is pending until form submission */
  onPendingCategoryChange?: (pending: PendingCategory | null) => void;
  /** The current pending category (if any) */
  pendingCategory?: PendingCategory | null;
  error?: boolean;
  id?: string;
  disabled?: boolean;
}

export function CategorySelect({
  value,
  onChange,
  categories,
  onPendingCategoryChange,
  pendingCategory,
  error,
  id,
  disabled,
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState<string>('zinc');
  const [newCategoryIcon, setNewCategoryIcon] = useState<string>('tag');
  const [isSelecting, setIsSelecting] = useState(false); // Prevent double-clicks
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Always show default categories first, then any additional user-created categories
  const defaultCategoryObjects = DEFAULT_CATEGORIES.map((cat, i) => ({
    id: `default-${i}`,
    user_id: '',
    name: cat.name,
    color: cat.color,
    icon: cat.icon,
    sort_order: cat.sort_order,
    created_at: '',
  }));

  // Get user categories that aren't already in defaults (by name, case-insensitive)
  const defaultNames = new Set(DEFAULT_CATEGORIES.map(c => c.name.toLowerCase()));
  const additionalUserCategories = categories.filter(
    c => !defaultNames.has(c.name.toLowerCase())
  );

  // Merge: defaults first, then additional user categories
  let displayCategories = [...defaultCategoryObjects, ...additionalUserCategories];

  // Look for selected category in display list OR in categories OR pending (case-insensitive)
  const valueLower = value?.toLowerCase();
  let selectedCategory = displayCategories.find(c => c.name.toLowerCase() === valueLower)
    || categories.find(c => c.name.toLowerCase() === valueLower)
    || (pendingCategory && pendingCategory.name.toLowerCase() === valueLower ? {
        id: 'pending',
        user_id: '',
        name: pendingCategory.name,
        color: pendingCategory.color,
        icon: pendingCategory.icon,
        sort_order: 999,
        created_at: '',
      } : null);

  // If the current value doesn't exist in any category list (orphaned category),
  // add it to the display list so the user can see and change it
  if (value && !selectedCategory) {
    const orphanedCategory = {
      id: 'orphaned',
      user_id: '',
      name: value,
      color: 'zinc',
      icon: 'tag',
      sort_order: 1000,
      created_at: '',
    };
    displayCategories = [...displayCategories, orphanedCategory];
    selectedCategory = orphanedCategory;
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowAddForm(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when add form opens
  useEffect(() => {
    if (showAddForm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showAddForm]);

  function handleSelectPendingCategory(e?: React.MouseEvent) {
    // Prevent any event bubbling that could interfere with parent form
    e?.preventDefault();
    e?.stopPropagation();

    // Prevent double-clicks
    if (isSelecting) return;
    setIsSelecting(true);

    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      showError('Please enter a category name');
      setIsSelecting(false);
      return;
    }

    // Check if category already exists (case-insensitive)
    const existingCategory = displayCategories.find(
      c => c.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existingCategory) {
      // Just select the existing category
      onChange(existingCategory.name);
      onPendingCategoryChange?.(null);
    } else {
      // Set as pending category (will be created when form is submitted)
      const pending: PendingCategory = {
        name: trimmedName,
        color: newCategoryColor,
        icon: newCategoryIcon,
      };
      onPendingCategoryChange?.(pending);
      onChange(trimmedName);
    }

    // Reset form and close dropdown
    setNewCategoryName('');
    setNewCategoryColor('zinc');
    setNewCategoryIcon('tag');
    setShowAddForm(false);
    setIsOpen(false);
    setIsSelecting(false);
  }


  function getIconComponent(iconName: string) {
    const Icon = ICON_MAP[iconName] || Tag;
    return Icon;
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Select button */}
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
        aria-label={selectedCategory ? `Category: ${selectedCategory.name}` : 'Select category'}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) setIsOpen(!isOpen);
        }}
        className={cn(
          'w-full bg-zinc-800 border rounded-md px-3 py-2 text-left min-h-[44px]',
          'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
          'flex items-center justify-between gap-2',
          error ? 'border-rose-500' : 'border-zinc-700',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {selectedCategory ? (
          <span className="flex items-center gap-2 text-zinc-100">
            {(() => {
              const Icon = getIconComponent(selectedCategory.icon);
              const colors = COLOR_CLASSES[selectedCategory.color] ?? COLOR_CLASSES.zinc;
              return (
                <>
                  <span className={cn('p-1 rounded', colors?.bg ?? 'bg-zinc-500/20')}>
                    <Icon className={cn('w-3.5 h-3.5', colors?.text ?? 'text-zinc-400')} />
                  </span>
                  {selectedCategory.name}
                </>
              );
            })()}
          </span>
        ) : (
          <span className="text-zinc-500">Select category...</span>
        )}
        <ChevronDown className={cn(
          'w-4 h-4 text-zinc-400 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Category options"
          className="absolute z-50 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg max-h-80 overflow-auto"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Category options */}
          {displayCategories.map((cat) => {
            const Icon = getIconComponent(cat.icon);
            const colors = COLOR_CLASSES[cat.color] ?? COLOR_CLASSES.zinc;
            const isSelected = cat.name.toLowerCase() === valueLower;
            return (
              <button
                key={cat.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange(cat.name);
                  // Clear any pending category when selecting an existing one
                  onPendingCategoryChange?.(null);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-zinc-700/50',
                  isSelected && 'bg-zinc-700/30'
                )}
              >
                <span className={cn('p-1 rounded', colors?.bg ?? 'bg-zinc-500/20')}>
                  <Icon className={cn('w-3.5 h-3.5', colors?.text ?? 'text-zinc-400')} />
                </span>
                <span className="text-zinc-100 flex-1">{cat.name}</span>
                {isSelected && <Check className="w-4 h-4 text-teal-400" />}
              </button>
            );
          })}

          {/* Divider */}
          <div className="border-t border-zinc-700 my-1" />

          {/* Add new category */}
          {!showAddForm ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowAddForm(true);
              }}
              className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-zinc-700/50 text-teal-400"
            >
              <Plus className="w-4 h-4" />
              <span>Add new category</span>
            </button>
          ) : (
            <div className="p-3 space-y-3">
              {/* Name input */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Name</label>
                <input
                  ref={inputRef}
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Transportation"
                  maxLength={50}
                  className="w-full bg-zinc-900 border border-zinc-600 rounded px-2 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelectPendingCategory();
                    }
                    if (e.key === 'Escape') {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowAddForm(false);
                    }
                  }}
                />
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Color</label>
                <div className="flex flex-wrap gap-1">
                  {CATEGORY_COLORS.map((color) => {
                    const colors = COLOR_CLASSES[color];
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setNewCategoryColor(color);
                        }}
                        className={cn(
                          'w-6 h-6 rounded-full transition-all',
                          colors?.bg,
                          newCategoryColor === color && `ring-2 ${colors?.ring} ring-offset-1 ring-offset-zinc-800`
                        )}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Icon picker */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Icon</label>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {CATEGORY_ICONS.map((iconName) => {
                    const Icon = ICON_MAP[iconName] || Tag;
                    const colors = COLOR_CLASSES[newCategoryColor] ?? COLOR_CLASSES.zinc;
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setNewCategoryIcon(iconName);
                        }}
                        className={cn(
                          'p-1.5 rounded transition-all',
                          newCategoryIcon === iconName
                            ? `${colors?.bg ?? 'bg-zinc-500/20'} ring-1 ${colors?.ring ?? 'ring-zinc-500'}`
                            : 'hover:bg-zinc-700'
                        )}
                      >
                        <Icon className={cn(
                          'w-4 h-4',
                          newCategoryIcon === iconName ? (colors?.text ?? 'text-zinc-400') : 'text-zinc-400'
                        )} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowAddForm(false);
                  }}
                  className="flex-1 px-2 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 rounded border border-zinc-600 hover:border-zinc-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSelectPendingCategory(e)}
                  disabled={!newCategoryName.trim() || isSelecting}
                  className="flex-1 px-2 py-1.5 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSelecting ? 'Selecting...' : 'Select'}
                </button>
              </div>
            </div>
          )}

          {/* Manage link */}
          <div className="border-t border-zinc-700 mt-1">
            <Link
              href="/dashboard/settings#bill-categories"
              className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-zinc-700/50 text-zinc-500 text-sm"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Manage all categories</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
