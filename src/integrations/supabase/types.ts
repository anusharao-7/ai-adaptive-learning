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
      leaderboard: {
        Row: {
          correct_answers: number
          device_id: string
          id: string
          nickname: string
          questions_answered: number
          total_score: number
          updated_at: string
        }
        Insert: {
          correct_answers?: number
          device_id: string
          id?: string
          nickname: string
          questions_answered?: number
          total_score?: number
          updated_at?: string
        }
        Update: {
          correct_answers?: number
          device_id?: string
          id?: string
          nickname?: string
          questions_answered?: number
          total_score?: number
          updated_at?: string
        }
        Relationships: []
      }
      pod_members: {
        Row: {
          device_id: string
          id: string
          joined_at: string
          nickname: string
          pod_id: string
          score: number
        }
        Insert: {
          device_id: string
          id?: string
          joined_at?: string
          nickname: string
          pod_id: string
          score?: number
        }
        Update: {
          device_id?: string
          id?: string
          joined_at?: string
          nickname?: string
          pod_id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "pod_members_pod_id_fkey"
            columns: ["pod_id"]
            isOneToOne: false
            referencedRelation: "pods"
            referencedColumns: ["id"]
          },
        ]
      }
      pods: {
        Row: {
          created_at: string
          current_question_id: string | null
          host_device_id: string
          id: string
          is_active: boolean
          room_code: string
          room_name: string
        }
        Insert: {
          created_at?: string
          current_question_id?: string | null
          host_device_id: string
          id?: string
          is_active?: boolean
          room_code: string
          room_name: string
        }
        Update: {
          created_at?: string
          current_question_id?: string | null
          host_device_id?: string
          id?: string
          is_active?: boolean
          room_code?: string
          room_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "pods_current_question_id_fkey"
            columns: ["current_question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_assets: {
        Row: {
          asset_type: string
          asset_url: string | null
          created_at: string
          description: string | null
          id: string
          question_id: string | null
          svg_content: string | null
        }
        Insert: {
          asset_type?: string
          asset_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          question_id?: string | null
          svg_content?: string | null
        }
        Update: {
          asset_type?: string
          asset_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          question_id?: string | null
          svg_content?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_assets_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          correct_answer: string
          created_at: string
          difficulty: number
          explanation: string | null
          id: string
          options: Json
          question_text: string
          question_type: string
          subject: string
          svg_data: string | null
          topic: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          difficulty?: number
          explanation?: string | null
          id?: string
          options?: Json
          question_text: string
          question_type?: string
          subject: string
          svg_data?: string | null
          topic: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          difficulty?: number
          explanation?: string | null
          id?: string
          options?: Json
          question_text?: string
          question_type?: string
          subject?: string
          svg_data?: string | null
          topic?: string
        }
        Relationships: []
      }
      roadmap_days: {
        Row: {
          achieved_score: number | null
          completed_at: string | null
          created_at: string
          day_number: number
          id: string
          is_completed: boolean
          roadmap_id: string
          subject: string
          target_score: number
          topic: string
        }
        Insert: {
          achieved_score?: number | null
          completed_at?: string | null
          created_at?: string
          day_number: number
          id?: string
          is_completed?: boolean
          roadmap_id: string
          subject: string
          target_score?: number
          topic: string
        }
        Update: {
          achieved_score?: number | null
          completed_at?: string | null
          created_at?: string
          day_number?: number
          id?: string
          is_completed?: boolean
          roadmap_id?: string
          subject?: string
          target_score?: number
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_days_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmaps: {
        Row: {
          created_at: string
          daily_minutes: number | null
          device_id: string
          exam_date: string | null
          id: string
          is_active: boolean
          name: string
          start_date: string
          total_days: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          daily_minutes?: number | null
          device_id: string
          exam_date?: string | null
          id?: string
          is_active?: boolean
          name?: string
          start_date?: string
          total_days?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          daily_minutes?: number | null
          device_id?: string
          exam_date?: string | null
          id?: string
          is_active?: boolean
          name?: string
          start_date?: string
          total_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      student_attempts: {
        Row: {
          created_at: string
          device_id: string
          id: string
          is_correct: boolean
          question_id: string
          selected_answer: string
          time_taken_seconds: number | null
        }
        Insert: {
          created_at?: string
          device_id: string
          id?: string
          is_correct: boolean
          question_id: string
          selected_answer: string
          time_taken_seconds?: number | null
        }
        Update: {
          created_at?: string
          device_id?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          selected_answer?: string
          time_taken_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      used_questions: {
        Row: {
          device_id: string
          id: string
          question_id: string
          session_id: string | null
          session_type: string
          used_at: string
        }
        Insert: {
          device_id: string
          id?: string
          question_id: string
          session_id?: string | null
          session_type?: string
          used_at?: string
        }
        Update: {
          device_id?: string
          id?: string
          question_id?: string
          session_id?: string | null
          session_type?: string
          used_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "used_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
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
