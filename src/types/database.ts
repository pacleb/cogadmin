export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ConcernUrgencyDB = 'EMERGENCY' | 'Major Urgent' | 'Urgent' | 'Major' | 'Normal';
export type ConcernStatusDB = 
  | 'New' 
  | 'For Delegating' 
  | 'Preparing' 
  | 'For Update' 
  | 'For Report' 
  | 'For Approval' 
  | 'For Download' 
  | 'Ongoing' 
  | 'Accomplished';

export type Database = {
  public: {
    Tables: {
      concerns: {
        Row: {
          id: string;
          user_id: string;
          group_code: string;
          urgency: ConcernUrgencyDB;
          task: string;
          start_date: string;
          remarks: string | null;
          status: ConcernStatusDB;
          detailed_status: string | null;
          pic: string | null;
          end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          group_code: string;
          urgency?: ConcernUrgencyDB;
          task: string;
          start_date?: string;
          remarks?: string | null;
          status?: ConcernStatusDB;
          detailed_status?: string | null;
          pic?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          group_code?: string;
          urgency?: ConcernUrgencyDB;
          task?: string;
          start_date?: string;
          remarks?: string | null;
          status?: ConcernStatusDB;
          detailed_status?: string | null;
          pic?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      groups: {
        Row: {
          id: string;
          user_id: string;
          code: string;
          name: string;
          weight: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          code: string;
          name: string;
          weight?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          code?: string;
          name?: string;
          weight?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          name: string;
          nickname: string;
          mobile: string;
          role_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          name?: string;
          nickname?: string;
          mobile?: string;
          role_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          name?: string;
          nickname?: string;
          mobile?: string;
          role_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      roles: {
        Row: {
          id: string;
          code: string;
          name: string;
          weight: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          weight?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          weight?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type ConcernRow = Database['public']['Tables']['concerns']['Row'];
export type ConcernInsert = Database['public']['Tables']['concerns']['Insert'];
export type ConcernUpdate = Database['public']['Tables']['concerns']['Update'];

export type GroupRow = Database['public']['Tables']['groups']['Row'];
export type GroupInsert = Database['public']['Tables']['groups']['Insert'];
export type GroupUpdate = Database['public']['Tables']['groups']['Update'];

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type RoleRow = Database['public']['Tables']['roles']['Row'];
export type RoleInsert = Database['public']['Tables']['roles']['Insert'];
export type RoleUpdate = Database['public']['Tables']['roles']['Update'];
