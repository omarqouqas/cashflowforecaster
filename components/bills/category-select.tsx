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
import { createCategory } from '@/lib/actions/manage-categories';
import { type UserCategory, CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/categories/constants';
import { showError, showSuccess } from '@/lib/toast';
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

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  categories: UserCategory[];
  onCategoryCreated?: (category: UserCategory) => void;
  error?: boolean;
  id?: string;
}

export function CategorySelect({
  value,
  onChange,
  categories,
  onCategoryCreated,
  error,
  id,
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState<string>('zinc');
  const [newCategoryIcon, setNewCategoryIcon] = useState<string>('tag');
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCategory = categories.find(c => c.name === value);

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

  async function handleCreateCategory() {
    if (!newCategoryName.trim()) {
      showError('Please enter a category name');
      return;
    }

    setIsCreating(true);
    const result = await createCategory({
      name: newCategoryName.trim(),
      color: newCategoryColor,
      icon: newCategoryIcon,
    });

    if (result.success && result.category) {
      showSuccess('Category created');
      onChange(result.category.name);
      onCategoryCreated?.(result.category);
      setNewCategoryName('');
      setNewCategoryColor('zinc');
      setNewCategoryIcon('tag');
      setShowAddForm(false);
      setIsOpen(false);
    } else {
      showError(result.error || 'Failed to create category');
    }
    setIsCreating(false);
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
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full bg-zinc-800 border rounded-md px-3 py-2 text-left min-h-[44px]',
          'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
          'flex items-center justify-between gap-2',
          error ? 'border-rose-500' : 'border-zinc-700'
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
        <div className="absolute z-50 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg max-h-80 overflow-auto">
          {/* Category options */}
          {categories.map((cat) => {
            const Icon = getIconComponent(cat.icon);
            const colors = COLOR_CLASSES[cat.color] ?? COLOR_CLASSES.zinc;
            const isSelected = cat.name === value;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onChange(cat.name);
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
              onClick={() => setShowAddForm(true)}
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
                      handleCreateCategory();
                    }
                    if (e.key === 'Escape') {
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
                        onClick={() => setNewCategoryColor(color)}
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
                        onClick={() => setNewCategoryIcon(iconName)}
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
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-2 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 rounded border border-zinc-600 hover:border-zinc-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={isCreating || !newCategoryName.trim()}
                  className="flex-1 px-2 py-1.5 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Creating...' : 'Create'}
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
