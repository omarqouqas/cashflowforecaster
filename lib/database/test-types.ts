/**
 * Type Safety Test File
 *
 * This file demonstrates that our generated Supabase types work correctly.
 * It's used for reference/testing only and won't be imported elsewhere.
 *
 * Run `pnpm type-check` to verify all types are correct.
 */

import { Database, Tables, TablesInsert, TablesUpdate } from '@/types/supabase'

/**
 * Helper type aliases for cleaner usage
 * These extract Row, Insert, and Update types from the Database schema
 */
type Row<T extends keyof Database['public']['Tables']> = Tables<T>
type Insert<T extends keyof Database['public']['Tables']> = TablesInsert<T>
type Update<T extends keyof Database['public']['Tables']> = TablesUpdate<T>

// ============================================================================
// Account Types
// ============================================================================

/**
 * Account Row Type
 * Represents a complete account record as it exists in the database
 */
type Account = Row<'accounts'>

/**
 * New Account Insert Type
 * Used when creating a new account - some fields are optional (auto-generated)
 */
type NewAccount = Insert<'accounts'>

/**
 * Account Update Type
 * Used when updating an account - all fields are optional
 */
type AccountUpdate = Update<'accounts'>

// Example: Complete account object showing all required fields
const exampleAccount: Account = {
  id: 'uuid-here',
  user_id: 'user-uuid',
  name: 'Main Checking',
  account_type: 'checking',
  current_balance: 1000.0,
  currency: 'USD',
  is_spendable: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Example: Creating a new account (id, created_at, updated_at are optional)
const newAccount: NewAccount = {
  user_id: 'user-uuid',
  name: 'Savings Account',
  account_type: 'savings',
  current_balance: 5000.0,
  // id, created_at, updated_at are optional (auto-generated)
}

// Example: Updating an account (all fields optional)
const accountUpdate: AccountUpdate = {
  current_balance: 1500.0,
  // Can update just one field, or multiple fields
}

// ============================================================================
// Bill Types
// ============================================================================

/**
 * Bill Row Type
 * Represents a complete bill record as it exists in the database
 */
type Bill = Row<'bills'>

/**
 * New Bill Insert Type
 * Used when creating a new bill
 */
type NewBill = Insert<'bills'>

/**
 * Bill Update Type
 * Used when updating a bill
 */
type BillUpdate = Update<'bills'>

// Example: Complete bill object
const exampleBill: Bill = {
  id: 'bill-uuid',
  user_id: 'user-uuid',
  name: 'Rent',
  amount: 1200.0,
  due_date: '2024-01-15',
  frequency: 'monthly',
  category: 'housing',
  is_paid: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Example: Creating a new bill
const newBill: NewBill = {
  user_id: 'user-uuid',
  name: 'Electric Bill',
  amount: 150.0,
  due_date: '2024-01-20',
  frequency: 'monthly',
  // Other fields may be optional depending on schema
}

// ============================================================================
// Income Types
// ============================================================================

/**
 * Income Row Type
 * Represents a complete income record as it exists in the database
 */
type Income = Row<'income'>

/**
 * New Income Insert Type
 * Used when creating a new income record
 */
type NewIncome = Insert<'income'>

/**
 * Income Update Type
 * Used when updating an income record
 */
type IncomeUpdate = Update<'income'>

// Example: Complete income object
const exampleIncome: Income = {
  id: 'income-uuid',
  user_id: 'user-uuid',
  name: 'Salary',
  amount: 5000.0,
  pay_date: '2024-01-01',
  frequency: 'monthly',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// ============================================================================
// User Settings Types
// ============================================================================

/**
 * User Settings Row Type
 * Represents user settings/preferences as they exist in the database
 */
type UserSettings = Row<'user_settings'>

/**
 * New User Settings Insert Type
 * Used when creating user settings
 */
type NewUserSettings = Insert<'user_settings'>

/**
 * User Settings Update Type
 * Used when updating user settings
 */
type UserSettingsUpdate = Update<'user_settings'>

// Example: Complete user settings object
const exampleUserSettings: UserSettings = {
  id: 'settings-uuid',
  user_id: 'user-uuid',
  // Add actual fields based on your schema
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// ============================================================================
// Type Safety Verification
// ============================================================================

/**
 * This section demonstrates that TypeScript will catch type errors
 * Uncomment the lines below to see type errors (which is good - it means types work!)
 */

// ❌ Type Error: Missing required field
// const invalidAccount: Account = {
//   name: 'Test Account',
//   // Missing required fields like user_id, current_balance
// }

// ❌ Type Error: Wrong type
// const invalidBalance: Account = {
//   ...exampleAccount,
//   current_balance: 'not a number', // Should be number
// }

// ✅ Type Error: Cannot assign Insert to Row (they're different types)
// const typeMismatch: Account = newAccount // This would error

// ✅ Correct: Insert type can be used for creating records
const createAccount = (data: NewAccount) => {
  // This function accepts NewAccount type
  return data
}

// ✅ Correct: Update type can be used for partial updates
const updateAccount = (id: string, data: AccountUpdate) => {
  // This function accepts AccountUpdate type (all fields optional)
  return { id, ...data }
}

// Export nothing - this file is for type checking only
export {}

