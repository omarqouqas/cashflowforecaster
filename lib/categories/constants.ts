// Category type definition
export type UserCategory = {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  sort_order: number;
  created_at: string;
};

// Default categories for new users
export const DEFAULT_CATEGORIES = [
  { name: 'Rent/Mortgage', color: 'rose', icon: 'home', sort_order: 1 },
  { name: 'Utilities', color: 'amber', icon: 'zap', sort_order: 2 },
  { name: 'Subscriptions', color: 'violet', icon: 'repeat', sort_order: 3 },
  { name: 'Insurance', color: 'blue', icon: 'shield', sort_order: 4 },
  { name: 'Other', color: 'zinc', icon: 'tag', sort_order: 5 },
] as const;

// Available colors for category customization
export const CATEGORY_COLORS = [
  'rose', 'amber', 'yellow', 'lime', 'emerald', 'teal',
  'cyan', 'blue', 'indigo', 'violet', 'purple', 'pink', 'zinc'
] as const;

// Available icons for category customization (Lucide icon names)
export const CATEGORY_ICONS = [
  'home', 'zap', 'repeat', 'shield', 'tag', 'car', 'heart', 'plane',
  'utensils', 'shopping-bag', 'briefcase', 'gift', 'music', 'film',
  'gamepad-2', 'book', 'graduation-cap', 'dumbbell', 'pill', 'baby',
  'dog', 'tree', 'sun', 'umbrella', 'credit-card', 'phone', 'wifi',
  'tv', 'laptop', 'wrench', 'scissors', 'shirt'
] as const;

export type CategoryColor = typeof CATEGORY_COLORS[number];
export type CategoryIcon = typeof CATEGORY_ICONS[number];
