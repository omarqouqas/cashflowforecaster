export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          account_type: string | null
          apr: number | null
          created_at: string | null
          credit_limit: number | null
          currency: string | null
          current_balance: number
          id: string
          is_spendable: boolean | null
          minimum_payment_percent: number | null
          name: string
          payment_due_day: number | null
          statement_close_day: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_type?: string | null
          apr?: number | null
          created_at?: string | null
          credit_limit?: number | null
          currency?: string | null
          current_balance: number
          id?: string
          is_spendable?: boolean | null
          minimum_payment_percent?: number | null
          name: string
          payment_due_day?: number | null
          statement_close_day?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_type?: string | null
          apr?: number | null
          created_at?: string | null
          credit_limit?: number | null
          currency?: string | null
          current_balance?: number
          id?: string
          is_spendable?: boolean | null
          minimum_payment_percent?: number | null
          name?: string
          payment_due_day?: number | null
          statement_close_day?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bills: {
        Row: {
          account_id: string | null
          amount: number
          auto_pay: boolean | null
          category: string | null
          created_at: string | null
          due_date: string
          frequency: string
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          recurrence_day: number | null
          source_import_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          auto_pay?: boolean | null
          category?: string | null
          created_at?: string | null
          due_date: string
          frequency: string
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          recurrence_day?: number | null
          source_import_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          auto_pay?: boolean | null
          category?: string | null
          created_at?: string | null
          due_date?: string
          frequency?: string
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          recurrence_day?: number | null
          source_import_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bills_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bills_source_import_id_fkey"
            columns: ["source_import_id"]
            isOneToOne: false
            referencedRelation: "imported_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      exports: {
        Row: {
          completed_at: string | null
          config: Json | null
          created_at: string | null
          error_message: string | null
          expires_at: string | null
          file_size_bytes: number | null
          file_url: string | null
          format: string
          id: string
          name: string
          report_type: string
          row_count: number | null
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          config?: Json | null
          created_at?: string | null
          error_message?: string | null
          expires_at?: string | null
          file_size_bytes?: number | null
          file_url?: string | null
          format: string
          id?: string
          name: string
          report_type: string
          row_count?: number | null
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          config?: Json | null
          created_at?: string | null
          error_message?: string | null
          expires_at?: string | null
          file_size_bytes?: number | null
          file_url?: string | null
          format?: string
          id?: string
          name?: string
          report_type?: string
          row_count?: number | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          id: string
          message: string
          page_url: string | null
          status: string
          type: string
          updated_at: string
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          page_url?: string | null
          status?: string
          type: string
          updated_at?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          page_url?: string | null
          status?: string
          type?: string
          updated_at?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      imported_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          invoice_id: string | null
          mapped_columns: Json | null
          posted_at: string
          raw: Json
          source_file_name: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          invoice_id?: string | null
          mapped_columns?: Json | null
          posted_at: string
          raw: Json
          source_file_name?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string | null
          mapped_columns?: Json | null
          posted_at?: string
          raw?: Json
          source_file_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "imported_transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "imported_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      income: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string | null
          frequency: string
          id: string
          invoice_id: string | null
          is_active: boolean | null
          last_date: string | null
          name: string
          next_date: string
          notes: string | null
          recurrence_day: number | null
          recurrence_weekday: number | null
          source_import_id: string | null
          status: string | null
          status_updated_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string | null
          frequency: string
          id?: string
          invoice_id?: string | null
          is_active?: boolean | null
          last_date?: string | null
          name: string
          next_date: string
          notes?: string | null
          recurrence_day?: number | null
          recurrence_weekday?: number | null
          source_import_id?: string | null
          status?: string | null
          status_updated_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string | null
          frequency?: string
          id?: string
          invoice_id?: string | null
          is_active?: boolean | null
          last_date?: string | null
          name?: string
          next_date?: string
          notes?: string | null
          recurrence_day?: number | null
          recurrence_weekday?: number | null
          source_import_id?: string | null
          status?: string | null
          status_updated_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "income_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "income_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "income_source_import_id_fkey"
            columns: ["source_import_id"]
            isOneToOne: false
            referencedRelation: "imported_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "income_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_reminders: {
        Row: {
          created_at: string
          id: string
          invoice_id: string
          reminder_type: string
          sent_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invoice_id: string
          reminder_type: string
          sent_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invoice_id?: string
          reminder_type?: string
          sent_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_reminders_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          client_email: string | null
          client_name: string
          created_at: string | null
          currency: string
          description: string | null
          due_date: string
          id: string
          invoice_number: string
          last_reminder_at: string | null
          paid_at: string | null
          payment_link_url: string | null
          payment_method: string | null
          reminder_count: number
          sent_at: string | null
          status: string | null
          stripe_checkout_session_id: string | null
          updated_at: string | null
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          amount: number
          client_email?: string | null
          client_name: string
          created_at?: string | null
          currency?: string
          description?: string | null
          due_date: string
          id?: string
          invoice_number: string
          last_reminder_at?: string | null
          paid_at?: string | null
          payment_link_url?: string | null
          payment_method?: string | null
          reminder_count?: number
          sent_at?: string | null
          status?: string | null
          stripe_checkout_session_id?: string | null
          updated_at?: string | null
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          amount?: number
          client_email?: string | null
          client_name?: string
          created_at?: string | null
          currency?: string
          description?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          last_reminder_at?: string | null
          paid_at?: string | null
          payment_link_url?: string | null
          payment_method?: string | null
          reminder_count?: number
          sent_at?: string | null
          status?: string | null
          stripe_checkout_session_id?: string | null
          updated_at?: string | null
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          channel: string
          clicked_at: string | null
          id: string
          metadata: Json | null
          opened_at: string | null
          sent_at: string | null
          subject: string | null
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          channel: string
          clicked_at?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          sent_at?: string | null
          subject?: string | null
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          channel?: string
          clicked_at?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          sent_at?: string | null
          subject?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      parsed_emails: {
        Row: {
          amount: number | null
          bill_id: string | null
          confidence_score: number | null
          created_at: string | null
          due_date: string | null
          frequency: string | null
          id: string
          merchant: string | null
          parsing_model: string | null
          parsing_prompt_version: string | null
          raw_email_data: Json | null
          received_at: string | null
          reviewed_at: string | null
          sender: string
          status: string | null
          subject: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          bill_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          due_date?: string | null
          frequency?: string | null
          id?: string
          merchant?: string | null
          parsing_model?: string | null
          parsing_prompt_version?: string | null
          raw_email_data?: Json | null
          received_at?: string | null
          reviewed_at?: string | null
          sender: string
          status?: string | null
          subject?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          bill_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          due_date?: string | null
          frequency?: string | null
          id?: string
          merchant?: string | null
          parsing_model?: string | null
          parsing_prompt_version?: string | null
          raw_email_data?: Json | null
          received_at?: string | null
          reviewed_at?: string | null
          sender?: string
          status?: string | null
          subject?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parsed_emails_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parsed_emails_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          accepted_at: string | null
          amount: number
          client_email: string | null
          client_name: string
          converted_invoice_id: string | null
          created_at: string | null
          currency: string
          description: string | null
          id: string
          quote_number: string
          rejected_at: string | null
          sent_at: string | null
          status: string
          updated_at: string | null
          user_id: string
          valid_until: string
          viewed_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          amount?: number
          client_email?: string | null
          client_name: string
          converted_invoice_id?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          quote_number: string
          rejected_at?: string | null
          sent_at?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
          valid_until: string
          viewed_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          amount?: number
          client_email?: string | null
          client_name?: string
          converted_invoice_id?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          quote_number?: string
          rejected_at?: string | null
          sent_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
          valid_until?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_converted_invoice_id_fkey"
            columns: ["converted_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      scenarios: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          id: string
          name: string
          result: Json | null
          saved: boolean | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          id?: string
          name: string
          result?: Json | null
          saved?: boolean | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          id?: string
          name?: string
          result?: Json | null
          saved?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scenarios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_connect_accounts: {
        Row: {
          account_status: string
          charges_enabled: boolean | null
          created_at: string | null
          details_submitted: boolean | null
          id: string
          onboarding_completed_at: string | null
          payouts_enabled: boolean | null
          stripe_account_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_status?: string
          charges_enabled?: boolean | null
          created_at?: string | null
          details_submitted?: boolean | null
          id?: string
          onboarding_completed_at?: string | null
          payouts_enabled?: boolean | null
          stripe_account_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_status?: string
          charges_enabled?: boolean | null
          created_at?: string | null
          details_submitted?: boolean | null
          id?: string
          onboarding_completed_at?: string | null
          payouts_enabled?: boolean | null
          stripe_account_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stripe_customers: {
        Row: {
          created_at: string
          id: string
          stripe_customer_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          stripe_customer_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          stripe_customer_id?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          interval: string | null
          price_id: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          interval?: string | null
          price_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          interval?: string | null
          price_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_categories: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          sort_order: number | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          sort_order?: number | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          sort_order?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          business_name: string | null
          created_at: string | null
          currency: string | null
          daily_burn_rate: number | null
          date_format: string | null
          default_account_id: string | null
          email_digest_day: number | null
          email_digest_enabled: boolean | null
          email_digest_time: string | null
          emergency_fund_account_id: string | null
          emergency_fund_enabled: boolean | null
          emergency_fund_goal_months: number | null
          estimated_tax_q1_paid: number | null
          estimated_tax_q2_paid: number | null
          estimated_tax_q3_paid: number | null
          estimated_tax_q4_paid: number | null
          last_digest_sent_at: string | null
          last_low_balance_alert_at: string | null
          logo_url: string | null
          low_balance_alert_enabled: boolean | null
          notification_preferences: Json | null
          onboarding_complete: boolean
          safety_buffer: number | null
          safety_mode: boolean | null
          tax_rate: number | null
          tax_tracking_enabled: boolean | null
          tax_year: number | null
          timezone: string | null
          updated_at: string | null
          user_id: string
          welcome_email_sent_at: string | null
        }
        Insert: {
          business_name?: string | null
          created_at?: string | null
          currency?: string | null
          daily_burn_rate?: number | null
          date_format?: string | null
          default_account_id?: string | null
          email_digest_day?: number | null
          email_digest_enabled?: boolean | null
          email_digest_time?: string | null
          emergency_fund_account_id?: string | null
          emergency_fund_enabled?: boolean | null
          emergency_fund_goal_months?: number | null
          estimated_tax_q1_paid?: number | null
          estimated_tax_q2_paid?: number | null
          estimated_tax_q3_paid?: number | null
          estimated_tax_q4_paid?: number | null
          last_digest_sent_at?: string | null
          last_low_balance_alert_at?: string | null
          logo_url?: string | null
          low_balance_alert_enabled?: boolean | null
          notification_preferences?: Json | null
          onboarding_complete?: boolean
          safety_buffer?: number | null
          safety_mode?: boolean | null
          tax_rate?: number | null
          tax_tracking_enabled?: boolean | null
          tax_year?: number | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
          welcome_email_sent_at?: string | null
        }
        Update: {
          business_name?: string | null
          created_at?: string | null
          currency?: string | null
          daily_burn_rate?: number | null
          date_format?: string | null
          default_account_id?: string | null
          email_digest_day?: number | null
          email_digest_enabled?: boolean | null
          email_digest_time?: string | null
          emergency_fund_account_id?: string | null
          emergency_fund_enabled?: boolean | null
          emergency_fund_goal_months?: number | null
          estimated_tax_q1_paid?: number | null
          estimated_tax_q2_paid?: number | null
          estimated_tax_q3_paid?: number | null
          estimated_tax_q4_paid?: number | null
          last_digest_sent_at?: string | null
          last_low_balance_alert_at?: string | null
          logo_url?: string | null
          low_balance_alert_enabled?: boolean | null
          notification_preferences?: Json | null
          onboarding_complete?: boolean
          safety_buffer?: number | null
          safety_mode?: boolean | null
          tax_rate?: number | null
          tax_tracking_enabled?: boolean | null
          tax_year?: number | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
          welcome_email_sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_default_account_id_fkey"
            columns: ["default_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_settings_emergency_fund_account_id_fkey"
            columns: ["emergency_fund_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          onboarded: boolean | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_ends_at: string | null
          subscription_status: string | null
          subscription_tier: string | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          onboarded?: boolean | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_ends_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          onboarded?: boolean | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_ends_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      weekly_checkins: {
        Row: {
          actual_spending: number | null
          created_at: string | null
          current_burn_rate: number | null
          id: string
          new_burn_rate: number | null
          suggested_burn_rate: number | null
          user_id: string
          user_updated: boolean | null
          week_end: string
          week_start: string
        }
        Insert: {
          actual_spending?: number | null
          created_at?: string | null
          current_burn_rate?: number | null
          id?: string
          new_burn_rate?: number | null
          suggested_burn_rate?: number | null
          user_id: string
          user_updated?: boolean | null
          week_end: string
          week_start: string
        }
        Update: {
          actual_spending?: number | null
          created_at?: string | null
          current_burn_rate?: number | null
          id?: string
          new_burn_rate?: number | null
          suggested_burn_rate?: number | null
          user_id?: string
          user_updated?: boolean | null
          week_end?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_checkins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_tier: { Args: { uid: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
