export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          city: string | null
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          city?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          city?: string | null
          created_at?: string
        }
      }
      listings: {
        Row: {
          id: number
          user_id: string
          title: string
          description: string | null
          price: number
          size: string | null
          designer: string | null
          condition: string | null
          image_url: string | null
          location: string | null
          embedding: string | number[] | null // תיקון: מרשה גם מערך מספרים
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          title: string
          description?: string | null
          price: number
          size?: string | null
          designer?: string | null
          condition?: string | null
          image_url?: string | null
          location?: string | null
          embedding?: string | number[] | null // תיקון: מרשה גם מערך מספרים
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          title?: string
          description?: string | null
          price?: number
          size?: string | null
          designer?: string | null
          condition?: string | null
          image_url?: string | null
          location?: string | null
          embedding?: string | number[] | null // תיקון: מרשה גם מערך מספרים
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    // הוספנו את הגדרת הפונקציה החדשה כאן
    Functions: {
      match_listings: {
        Args: {
          query_embedding: string | number[] // מקבל וקטור
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: number
          title: string
          price: number
          image_url: string
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}