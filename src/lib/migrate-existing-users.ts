import { supabase } from './supabase'

export class UserMigration {
  // Get all users who don't have profiles
  static async getUsersWithoutProfiles() {
    try {
      // Get all users from auth
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
      
      if (usersError) {
        console.error('Error fetching users:', usersError)
        return []
      }

      // Get existing professor IDs
      const { data: professors } = await supabase
        .from('professors')
        .select('id')

      // Get existing student IDs  
      const { data: students } = await supabase
        .from('students')
        .select('id')

      const existingProfessorIds = new Set(professors?.map(p => p.id) || [])
      const existingStudentIds = new Set(students?.map(s => s.id) || [])

      // Filter users who don't have profiles
      const usersWithoutProfiles = users.filter(user => {
        const hasProfessorProfile = existingProfessorIds.has(user.id)
        const hasStudentProfile = existingStudentIds.has(user.id)
        return !hasProfessorProfile && !hasStudentProfile
      })

      return usersWithoutProfiles
    } catch (error) {
      console.error('Error getting users without profiles:', error)
      return []
    }
  }

  // Migrate a user to professor profile
  static async migrateToProfessor(userId: string, fullName: string, department: string = 'General') {
    try {
      const { data, error } = await supabase
        .from('professors')
        .insert({
          id: userId,
          full_name: fullName,
          department: department,
          courses: [],
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
      console.error('Error migrating to professor:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Migrate a user to student profile
  static async migrateToStudent(userId: string, fullName: string, major: string = 'General', graduationYear: number = 2025) {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert({
          id: userId,
          full_name: fullName,
          major: major,
          graduation_year: graduationYear,
          courses: [],
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
      console.error('Error migrating to student:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Auto-migrate based on user metadata
  static async autoMigrateUsers() {
    try {
      const usersWithoutProfiles = await this.getUsersWithoutProfiles()
      
      console.log(`Found ${usersWithoutProfiles.length} users without profiles`)

      for (const user of usersWithoutProfiles) {
        const role = user.user_metadata?.role || 'student'
        const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown User'

        if (role === 'professor') {
          const result = await this.migrateToProfessor(
            user.id, 
            fullName, 
            user.user_metadata?.department || 'General'
          )
          console.log(`Migrated professor ${fullName}:`, result.success ? 'Success' : result.error)
        } else {
          const result = await this.migrateToStudent(
            user.id, 
            fullName, 
            user.user_metadata?.major || 'General',
            user.user_metadata?.graduation_year || 2025
          )
          console.log(`Migrated student ${fullName}:`, result.success ? 'Success' : result.error)
        }
      }

      return { success: true, migrated: usersWithoutProfiles.length }
    } catch (error) {
      console.error('Error auto-migrating users:', error)
      return { success: false, error: 'Migration failed' }
    }
  }
}
