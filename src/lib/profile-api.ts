import { supabase } from './supabase'
import { ProfessorProfile, StudentProfile } from './course-schemas'

export class ProfileAPI {
  // Create professor profile
  static async createProfessorProfile(userId: string, fullName: string, department: string): Promise<{ success: boolean; error?: string; profile?: ProfessorProfile }> {
    try {
      const newProfile: Omit<ProfessorProfile, 'id' | 'created_at' | 'updated_at'> = {
        full_name: fullName,
        department: department,
        courses: []
      }

      const { data, error } = await supabase
        .from('professors')
        .insert({
          id: userId,
          ...newProfile,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating professor profile:', error)
        return { success: false, error: error.message }
      }

      return { success: true, profile: data }
    } catch (error) {
      console.error('Error creating professor profile:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Create student profile
  static async createStudentProfile(userId: string, fullName: string, major: string, graduationYear: number): Promise<{ success: boolean; error?: string; profile?: StudentProfile }> {
    try {
      const newProfile: Omit<StudentProfile, 'id' | 'created_at' | 'updated_at'> = {
        full_name: fullName,
        major: major,
        graduation_year: graduationYear,
        courses: []
      }

      const { data, error } = await supabase
        .from('students')
        .insert({
          id: userId,
          ...newProfile,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating student profile:', error)
        return { success: false, error: error.message }
      }

      return { success: true, profile: data }
    } catch (error) {
      console.error('Error creating student profile:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Get professor profile
  static async getProfessorProfile(userId: string): Promise<ProfessorProfile | null> {
    const { data, error } = await supabase
      .from('professors')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching professor profile:', error)
      return null
    }

    return data
  }

  // Get student profile
  static async getStudentProfile(userId: string): Promise<StudentProfile | null> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching student profile:', error)
      return null
    }

    return data
  }

  // Check if profile exists
  static async profileExists(userId: string, role: 'professor' | 'student'): Promise<boolean> {
    try {
      const table = role === 'professor' ? 'professors' : 'students'
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .eq('id', userId)
        .single()

      return !error && !!data
    } catch (error) {
      return false
    }
  }
}
