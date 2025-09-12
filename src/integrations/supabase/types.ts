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
      agent_requests: {
        Row: {
          admin_notes: string | null
          agent_id: string | null
          completed_at: string | null
          created_at: string
          customer_id: string
          description: string
          id: string
          request_type: string
          requirements: Json | null
          status: Database["public"]["Enums"]["request_status"] | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          agent_id?: string | null
          completed_at?: string | null
          created_at?: string
          customer_id: string
          description: string
          id?: string
          request_type: string
          requirements?: Json | null
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          agent_id?: string | null
          completed_at?: string | null
          created_at?: string
          customer_id?: string
          description?: string
          id?: string
          request_type?: string
          requirements?: Json | null
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_requests_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "voice_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_records: {
        Row: {
          billing_period_end: string
          billing_period_start: string
          cost_per_minute: number | null
          created_at: string
          customer_id: string
          id: string
          paid_at: string | null
          payment_method: string | null
          stripe_invoice_id: string | null
          total_amount: number
          total_minutes: number | null
        }
        Insert: {
          billing_period_end: string
          billing_period_start: string
          cost_per_minute?: number | null
          created_at?: string
          customer_id: string
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          stripe_invoice_id?: string | null
          total_amount: number
          total_minutes?: number | null
        }
        Update: {
          billing_period_end?: string
          billing_period_start?: string
          cost_per_minute?: number | null
          created_at?: string
          customer_id?: string
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          stripe_invoice_id?: string | null
          total_amount?: number
          total_minutes?: number | null
        }
        Relationships: []
      }
      call_analytics: {
        Row: {
          agent_id: string | null
          call_duration: number | null
          call_end_time: string | null
          call_id: string | null
          call_start_time: string
          call_status: Database["public"]["Enums"]["call_status"] | null
          caller_phone: string | null
          created_at: string
          customer_id: string
          id: string
          total_cost: number | null
          transcript: string | null
        }
        Insert: {
          agent_id?: string | null
          call_duration?: number | null
          call_end_time?: string | null
          call_id?: string | null
          call_start_time: string
          call_status?: Database["public"]["Enums"]["call_status"] | null
          caller_phone?: string | null
          created_at?: string
          customer_id: string
          id?: string
          total_cost?: number | null
          transcript?: string | null
        }
        Update: {
          agent_id?: string | null
          call_duration?: number | null
          call_end_time?: string | null
          call_id?: string | null
          call_start_time?: string
          call_status?: Database["public"]["Enums"]["call_status"] | null
          caller_phone?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          total_cost?: number | null
          transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_analytics_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "voice_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          agent_id: string | null
          category: string | null
          created_at: string
          customer_id: string
          description: string | null
          id: string
          is_available: boolean | null
          item_name: string
          price: number | null
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          category?: string | null
          created_at?: string
          customer_id: string
          description?: string | null
          id?: string
          is_available?: boolean | null
          item_name: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          category?: string | null
          created_at?: string
          customer_id?: string
          description?: string | null
          id?: string
          is_available?: boolean | null
          item_name?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "voice_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_usage: {
        Row: {
          average_call_duration: number | null
          created_at: string
          customer_id: string
          id: string
          missed_calls: number | null
          month: number
          success_rate: number | null
          successful_calls: number | null
          total_calls: number | null
          total_cost: number | null
          total_minutes: number | null
          updated_at: string
          year: number
        }
        Insert: {
          average_call_duration?: number | null
          created_at?: string
          customer_id: string
          id?: string
          missed_calls?: number | null
          month: number
          success_rate?: number | null
          successful_calls?: number | null
          total_calls?: number | null
          total_cost?: number | null
          total_minutes?: number | null
          updated_at?: string
          year: number
        }
        Update: {
          average_call_duration?: number | null
          created_at?: string
          customer_id?: string
          id?: string
          missed_calls?: number | null
          month?: number
          success_rate?: number | null
          successful_calls?: number | null
          total_calls?: number | null
          total_cost?: number | null
          total_minutes?: number | null
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_name: string | null
          contact_name: string | null
          created_at: string
          id: string
          industry: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          business_name?: string | null
          contact_name?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          business_name?: string | null
          contact_name?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          customer_id: string
          description: string
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"] | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          subject: string
          ticket_number: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          customer_id: string
          description: string
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          subject: string
          ticket_number: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          customer_id?: string
          description?: string
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          subject?: string
          ticket_number?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      voice_agents: {
        Row: {
          agent_name: string
          agent_personality: string | null
          created_at: string
          customer_id: string
          greeting_message: string | null
          id: string
          language: string | null
          status: Database["public"]["Enums"]["agent_status"] | null
          updated_at: string
          vapi_agent_id: string | null
          voice_type: string | null
        }
        Insert: {
          agent_name: string
          agent_personality?: string | null
          created_at?: string
          customer_id: string
          greeting_message?: string | null
          id?: string
          language?: string | null
          status?: Database["public"]["Enums"]["agent_status"] | null
          updated_at?: string
          vapi_agent_id?: string | null
          voice_type?: string | null
        }
        Update: {
          agent_name?: string
          agent_personality?: string | null
          created_at?: string
          customer_id?: string
          greeting_message?: string | null
          id?: string
          language?: string | null
          status?: Database["public"]["Enums"]["agent_status"] | null
          updated_at?: string
          vapi_agent_id?: string | null
          voice_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_monthly_usage_summary: {
        Args: {
          customer_uuid: string
          target_month: number
          target_year: number
        }
        Returns: undefined
      }
      get_user_role: {
        Args: { user_id?: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      is_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
    }
    Enums: {
      agent_status: "active" | "inactive" | "pending" | "training"
      app_role: "customer" | "admin" | "super_admin"
      call_status: "completed" | "missed" | "failed" | "in_progress"
      request_status: "pending" | "in_progress" | "completed" | "rejected"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
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
    Enums: {
      agent_status: ["active", "inactive", "pending", "training"],
      app_role: ["customer", "admin", "super_admin"],
      call_status: ["completed", "missed", "failed", "in_progress"],
      request_status: ["pending", "in_progress", "completed", "rejected"],
      ticket_priority: ["low", "medium", "high", "urgent"],
      ticket_status: ["open", "in_progress", "resolved", "closed"],
    },
  },
} as const
