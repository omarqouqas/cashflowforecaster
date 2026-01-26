-- Migration: Add Custom Categories
-- Allows users to create, edit, and delete custom bill categories

-- Create user_categories table
CREATE TABLE user_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT 'zinc',
  icon TEXT DEFAULT 'tag',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE user_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own categories"
  ON user_categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON user_categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON user_categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON user_categories FOR DELETE
  USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_user_categories_user_id ON user_categories(user_id);

-- Seed default categories for existing users who have bills
-- Use DISTINCT to only create one set per user
INSERT INTO user_categories (user_id, name, color, icon, sort_order)
SELECT DISTINCT ON (user_id, name)
  user_id,
  category_name,
  category_color,
  category_icon,
  category_order
FROM (
  SELECT
    b.user_id,
    unnest(ARRAY['Rent/Mortgage', 'Utilities', 'Subscriptions', 'Insurance', 'Other']) AS category_name,
    unnest(ARRAY['rose', 'amber', 'violet', 'blue', 'zinc']) AS category_color,
    unnest(ARRAY['home', 'zap', 'repeat', 'shield', 'tag']) AS category_icon,
    unnest(ARRAY[1, 2, 3, 4, 5]) AS category_order
  FROM bills b
  GROUP BY b.user_id
) AS seeded
ON CONFLICT (user_id, name) DO NOTHING;

-- Also seed for users who have accounts but no bills yet
INSERT INTO user_categories (user_id, name, color, icon, sort_order)
SELECT DISTINCT ON (user_id, name)
  user_id,
  category_name,
  category_color,
  category_icon,
  category_order
FROM (
  SELECT
    a.user_id,
    unnest(ARRAY['Rent/Mortgage', 'Utilities', 'Subscriptions', 'Insurance', 'Other']) AS category_name,
    unnest(ARRAY['rose', 'amber', 'violet', 'blue', 'zinc']) AS category_color,
    unnest(ARRAY['home', 'zap', 'repeat', 'shield', 'tag']) AS category_icon,
    unnest(ARRAY[1, 2, 3, 4, 5]) AS category_order
  FROM accounts a
  WHERE NOT EXISTS (SELECT 1 FROM user_categories uc WHERE uc.user_id = a.user_id)
  GROUP BY a.user_id
) AS seeded
ON CONFLICT (user_id, name) DO NOTHING;

-- Update existing bills to use the new category names (normalize from lowercase)
UPDATE bills SET category = 'Rent/Mortgage' WHERE category = 'rent';
UPDATE bills SET category = 'Utilities' WHERE category = 'utilities';
UPDATE bills SET category = 'Subscriptions' WHERE category = 'subscriptions';
UPDATE bills SET category = 'Insurance' WHERE category = 'insurance';
UPDATE bills SET category = 'Other' WHERE category = 'other';

-- Note: bills.category column is TEXT, which can now hold any category name
-- The foreign key relationship is soft (via name match to user_categories.name)
