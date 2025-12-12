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
      analytics_usage: {
        Row: {
          cost_usd: number
          created_at: string
          id: string
          image_analysis: boolean
          model_used: string
          pdf_uploaded: boolean
          response_time_ms: number | null
          tokens_or_words: number
          user_id: string
        }
        Insert: {
          cost_usd?: number
          created_at?: string
          id?: string
          image_analysis?: boolean
          model_used: string
          pdf_uploaded?: boolean
          response_time_ms?: number | null
          tokens_or_words?: number
          user_id: string
        }
        Update: {
          cost_usd?: number
          created_at?: string
          id?: string
          image_analysis?: boolean
          model_used?: string
          pdf_uploaded?: boolean
          response_time_ms?: number | null
          tokens_or_words?: number
          user_id?: string
        }
        Relationships: []
      }
      billing_records: {
        Row: {
          amount_usd: number
          created_at: string
          due_date: string | null
          id: string
          invoice_sent: boolean
          is_paid: boolean
          period_end: string
          period_start: string
          total_analysis: number
          total_images: number
          total_words: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_usd?: number
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_sent?: boolean
          is_paid?: boolean
          period_end: string
          period_start: string
          total_analysis?: number
          total_images?: number
          total_words?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_usd?: number
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_sent?: boolean
          is_paid?: boolean
          period_end?: string
          period_start?: string
          total_analysis?: number
          total_images?: number
          total_words?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_onboarding_data: {
        Row: {
          age_group: string | null
          ai_comfort_level: string | null
          badge: string | null
          clerk_user_id: string
          communication_tone: string | null
          country: string | null
          created_at: string
          education_level: string | null
          free_image_credits: number | null
          frequent_subjects: string[] | null
          full_name: string | null
          gender: string | null
          id: string
          interests: string[] | null
          memory_enabled: boolean | null
          onboarding_completed: boolean | null
          plan_active: boolean | null
          plan_type: string | null
          preferred_coding_language: string | null
          preferred_language: string | null
          preferred_name: string | null
          profession: string | null
          recurring_tasks: string[] | null
          response_depth: string | null
          speed_boost_until: string | null
          timezone: string | null
          tutorial_completed: boolean | null
          updated_at: string
          usage_intents: string[] | null
        }
        Insert: {
          age_group?: string | null
          ai_comfort_level?: string | null
          badge?: string | null
          clerk_user_id: string
          communication_tone?: string | null
          country?: string | null
          created_at?: string
          education_level?: string | null
          free_image_credits?: number | null
          frequent_subjects?: string[] | null
          full_name?: string | null
          gender?: string | null
          id?: string
          interests?: string[] | null
          memory_enabled?: boolean | null
          onboarding_completed?: boolean | null
          plan_active?: boolean | null
          plan_type?: string | null
          preferred_coding_language?: string | null
          preferred_language?: string | null
          preferred_name?: string | null
          profession?: string | null
          recurring_tasks?: string[] | null
          response_depth?: string | null
          speed_boost_until?: string | null
          timezone?: string | null
          tutorial_completed?: boolean | null
          updated_at?: string
          usage_intents?: string[] | null
        }
        Update: {
          age_group?: string | null
          ai_comfort_level?: string | null
          badge?: string | null
          clerk_user_id?: string
          communication_tone?: string | null
          country?: string | null
          created_at?: string
          education_level?: string | null
          free_image_credits?: number | null
          frequent_subjects?: string[] | null
          full_name?: string | null
          gender?: string | null
          id?: string
          interests?: string[] | null
          memory_enabled?: boolean | null
          onboarding_completed?: boolean | null
          plan_active?: boolean | null
          plan_type?: string | null
          preferred_coding_language?: string | null
          preferred_language?: string | null
          preferred_name?: string | null
          profession?: string | null
          recurring_tasks?: string[] | null
          response_depth?: string | null
          speed_boost_until?: string | null
          timezone?: string | null
          tutorial_completed?: boolean | null
          updated_at?: string
          usage_intents?: string[] | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          age_group: string | null
          ai_level: string | null
          coding_language: string | null
          country: string | null
          created_at: string
          depth: string | null
          education: string | null
          id: string
          language: string | null
          memory_enabled: boolean | null
          name: string | null
          primary_uses: string[] | null
          profession: string | null
          recurring_tasks: number[] | null
          subjects: number[] | null
          timezone: string | null
          tone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age_group?: string | null
          ai_level?: string | null
          coding_language?: string | null
          country?: string | null
          created_at?: string
          depth?: string | null
          education?: string | null
          id?: string
          language?: string | null
          memory_enabled?: boolean | null
          name?: string | null
          primary_uses?: string[] | null
          profession?: string | null
          recurring_tasks?: number[] | null
          subjects?: number[] | null
          timezone?: string | null
          tone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age_group?: string | null
          ai_level?: string | null
          coding_language?: string | null
          country?: string | null
          created_at?: string
          depth?: string | null
          education?: string | null
          id?: string
          language?: string | null
          memory_enabled?: boolean | null
          name?: string | null
          primary_uses?: string[] | null
          profession?: string | null
          recurring_tasks?: number[] | null
          subjects?: number[] | null
          timezone?: string | null
          tone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
