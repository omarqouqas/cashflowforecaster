/**
 * Database type definitions for Supabase
 * 
 * NOTE: These are currently manual placeholder types.
 * Once the database schema is created, regenerate with:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
 */

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
          onboarded: boolean
          subscription_tier: 'free' | 'pro' | 'premium'
          subscription_status: 'active' | 'inactive' | 'trialing' | 'past_due'
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
          onboarded?: boolean
          subscription_tier?: 'free' | 'pro' | 'premium'
          subscription_status?: 'active' | 'inactive' | 'trialing' | 'past_due'
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
          onboarded?: boolean
          subscription_tier?: 'free' | 'pro' | 'premium'
          subscription_status?: 'active' | 'inactive' | 'trialing' | 'past_due'
        }
      }
      accounts: {
        Row: {
          id: string
          user_id: string
          name: string
          account_type: 'checking' | 'savings'
          current_balance: number
          currency: string
          is_spendable: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          account_type: 'checking' | 'savings'
          current_balance: number
          currency: string
          is_spendable?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          account_type?: 'checking' | 'savings'
          current_balance?: number
          currency?: string
          is_spendable?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      income: {
        Row: {
          id: string
          user_id: string
          account_id: string | null
          name: string
          amount: number
          frequency: 'one-time' | 'weekly' | 'biweekly' | 'monthly' | 'irregular'
          next_date: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id?: string | null
          name: string
          amount: number
          frequency: 'one-time' | 'weekly' | 'biweekly' | 'monthly' | 'irregular'
          next_date: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string | null
          name?: string
          amount?: number
          frequency?: 'one-time' | 'weekly' | 'biweekly' | 'monthly' | 'irregular'
          next_date?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bills: {
        Row: {
          id: string
          user_id: string
          account_id: string | null
          name: string
          amount: number
          due_date: string
          frequency: 'one-time' | 'monthly' | 'quarterly' | 'annually'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id?: string | null
          name: string
          amount: number
          due_date: string
          frequency: 'one-time' | 'monthly' | 'quarterly' | 'annually'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string | null
          name?: string
          amount?: number
          due_date?: string
          frequency?: 'one-time' | 'monthly' | 'quarterly' | 'annually'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          user_id: string
          daily_burn_rate: number
          safety_buffer: number
          safety_mode: boolean
          timezone: string
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          daily_burn_rate: number
          safety_buffer: number
          safety_mode?: boolean
          timezone: string
          currency: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          daily_burn_rate?: number
          safety_buffer?: number
          safety_mode?: boolean
          timezone?: string
          currency?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      // We don't have views yet
    }
    Functions: {
      // We don't have functions yet
    }
    Enums: {
      // We don't have enums yet
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]

export type Row<T extends keyof Database['public']['Tables']> = 
  Tables<T>['Row']

export type Insert<T extends keyof Database['public']['Tables']> = 
  Tables<T>['Insert']

export type Update<T extends keyof Database['public']['Tables']> = 
  Tables<T>['Update']
