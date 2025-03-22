export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bootcamps: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          category: string
          duration_weeks: number
          price: number
          requires_test: boolean
          is_active: boolean
          is_featured: boolean
          topics: string[]
          skills: string[]
          image_url: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          category: string
          duration_weeks: number
          price: number
          requires_test?: boolean
          is_active?: boolean
          is_featured?: boolean
          topics?: string[]
          skills?: string[]
          image_url: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          category?: string
          duration_weeks?: number
          price?: number
          requires_test?: boolean
          is_active?: boolean
          is_featured?: boolean
          topics?: string[]
          skills?: string[]
          image_url?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          created_at: string
          user_id: string
          bootcamp_id: string
          payment_type: 'individual' | 'group'
          payment_status: 'pending' | 'confirmed' | 'rejected'
          payment_proof_url: string | null
          technical_test_status: 'pending' | 'completed' | 'not_required'
          english_test_status: 'pending' | 'completed' | 'not_required'
          status: 'pending' | 'approved' | 'rejected'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          bootcamp_id: string
          payment_type: 'individual' | 'group'
          payment_status?: 'pending' | 'confirmed' | 'rejected'
          payment_proof_url?: string | null
          technical_test_status?: 'pending' | 'completed' | 'not_required'
          english_test_status?: 'pending' | 'completed' | 'not_required'
          status?: 'pending' | 'approved' | 'rejected'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          bootcamp_id?: string
          payment_type?: 'individual' | 'group'
          payment_status?: 'pending' | 'confirmed' | 'rejected'
          payment_proof_url?: string | null
          technical_test_status?: 'pending' | 'completed' | 'not_required'
          english_test_status?: 'pending' | 'completed' | 'not_required'
          status?: 'pending' | 'approved' | 'rejected'
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          first_name: string
          last_name: string
          phone: string
          birth_date: string
          gender: string
          country: string
          education_level: string
          last_degree: string | null
          institution: string | null
          work_experience: string | null
          employment_status: string
          id_document_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          first_name: string
          last_name: string
          phone: string
          birth_date: string
          gender: string
          country: string
          education_level: string
          last_degree?: string | null
          institution?: string | null
          work_experience?: string | null
          employment_status: string
          id_document_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          first_name?: string
          last_name?: string
          phone?: string
          birth_date?: string
          gender?: string
          country?: string
          education_level?: string
          last_degree?: string | null
          institution?: string | null
          work_experience?: string | null
          employment_status?: string
          id_document_url?: string | null
        }
      }
    }
  }
}