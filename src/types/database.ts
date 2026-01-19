export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      concerns: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          status: 'todo' | 'in-progress' | 'done';
          priority: 'low' | 'medium' | 'high';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          status?: 'todo' | 'in-progress' | 'done';
          priority?: 'low' | 'medium' | 'high';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          status?: 'todo' | 'in-progress' | 'done';
          priority?: 'low' | 'medium' | 'high';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type ConcernRow = Database['public']['Tables']['concerns']['Row'];
export type ConcernInsert = Database['public']['Tables']['concerns']['Insert'];
export type ConcernUpdate = Database['public']['Tables']['concerns']['Update'];
