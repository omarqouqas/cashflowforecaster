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
          created_at: string | null
          currency: string | null
          current_balance: number
          id: string
          is_spendable: boolean | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_type?: string | null
          created_at?: string | null
          currency?: string | null
          current_balance: number
          id?: string
          is_spendable?: boolean | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_type?: string | null
          created_at?: string | null
          currency?: string | null
          current_balance?: number
          id?: string
          is_spendable?: boolean | null
          name?: string
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
            foreignKeyName: "bills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bills_source_import_id_fkey"
            columns: ["source_import_id"]
            isOneToOne: false
            referencedRelation: "imported_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          id: string
          user_id: string | null
          user_email: string | null
          type: string
          message: string
          page_url: string | null
          user_agent: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          user_email?: string | null
          type: string
          message: string
          page_url?: string | null
          user_agent?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          user_email?: string | null
          type?: string
          message?: string
          page_url?: string | null
          user_agent?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
            foreignKeyName: "income_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "income_source_import_id_fkey"
            columns: ["source_import_id"]
            isOneToOne: false
            referencedRelation: "imported_transactions"
            referencedColumns: ["id"]
          },
        ]
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
          description: string | null
          due_date: string
          id: string
          invoice_number: string
          last_reminder_at: string | null
          paid_at: string | null
          paid_source_import_id: string | null
          reminder_count: number
          sent_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          amount: number
          client_email?: string | null
          client_name: string
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          invoice_number: string
          last_reminder_at?: string | null
          paid_at?: string | null
          paid_source_import_id?: string | null
          reminder_count?: number
          sent_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          amount?: number
          client_email?: string | null
          client_name?: string
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          last_reminder_at?: string | null
          paid_at?: string | null
          paid_source_import_id?: string | null
          reminder_count?: number
          sent_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_paid_source_import_id_fkey"
            columns: ["paid_source_import_id"]
            isOneToOne: false
            referencedRelation: "imported_transactions"
            referencedColumns: ["id"]
          },
        ]
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
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          interval: string | null
          price_id: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          interval?: string | null
          price_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          interval?: string | null
          price_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string | null
          currency: string | null
          daily_burn_rate: number | null
          date_format: string | null
          default_account_id: string | null
          email_digest_day: number | null
          email_digest_enabled: boolean | null
          email_digest_time: string | null
          last_digest_sent_at: string | null
          notification_preferences: Json | null
          onboarding_complete: boolean
          safety_buffer: number | null
          safety_mode: boolean | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          daily_burn_rate?: number | null
          date_format?: string | null
          default_account_id?: string | null
          email_digest_day?: number | null
          email_digest_enabled?: boolean | null
          email_digest_time?: string | null
          last_digest_sent_at?: string | null
          notification_preferences?: Json | null
          onboarding_complete?: boolean
          safety_buffer?: number | null
          safety_mode?: boolean | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          daily_burn_rate?: number | null
          date_format?: string | null
          default_account_id?: string | null
          email_digest_day?: number | null
          email_digest_enabled?: boolean | null
          email_digest_time?: string | null
          last_digest_sent_at?: string | null
          notification_preferences?: Json | null
          onboarding_complete?: boolean
          safety_buffer?: number | null
          safety_mode?: boolean | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
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
      [_ in never]: never
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
