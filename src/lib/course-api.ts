import { supabase } from './supabase'
import { Course, CreateCourseData, ProfessorProfile } from './course-schemas'

export class CourseAPI {
  // Get professor profile with courses
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

  // Create a new course for a professor
  static async createCourse(userId: string, courseData: CreateCourseData): Promise<{ success: boolean; error?: string; course?: Course }> {
    try {
      console.log('CourseAPI.createCourse called with:', { userId, courseData })
      
      // First, get the current professor profile
      const profile = await this.getProfessorProfile(userId)
      console.log('Professor profile:', profile)
      
      if (!profile) {
        console.error('Professor profile not found for user:', userId)
        
        // Try to create a basic professor profile
        console.log('Attempting to create professor profile...')
        const { ProfileAPI } = await import('./profile-api')
        
        const profileResult = await ProfileAPI.createProfessorProfile(
          userId,
          'Professor', // Default name
          'General' // Default department
        )
        
        if (!profileResult.success) {
          return { success: false, error: 'Could not create professor profile. Please try signing out and back in.' }
        }
        
        // Retry with the new profile
        const newProfile = await this.getProfessorProfile(userId)
        if (!newProfile) {
          return { success: false, error: 'Failed to create professor profile' }
        }
        
        // Use the new profile
        const newCourse: Course = {
          ...courseData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const updatedCourses = [...(newProfile.courses || []), newCourse]

        const { error } = await supabase
          .from('professors')
          .update({ 
            courses: updatedCourses,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)

        if (error) {
          console.error('Supabase error creating course:', error)
          return { success: false, error: error.message }
        }

        console.log('Course created successfully with new profile')
        return { success: true, course: newCourse }
      }

      // Create new course with ID and timestamps
      const newCourse: Course = {
        ...courseData,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('New course object:', newCourse)

      // Add the new course to the existing courses array
      const updatedCourses = [...(profile.courses || []), newCourse]
      console.log('Updated courses array:', updatedCourses)

      // Update the professor's courses in the database
      const { error } = await supabase
        .from('professors')
        .update({ 
          courses: updatedCourses,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('Supabase error creating course:', error)
        return { success: false, error: error.message }
      }

      console.log('Course created successfully')
      return { success: true, course: newCourse }
    } catch (error) {
      console.error('Error creating course:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Update an existing course
  static async updateCourse(userId: string, courseId: string, courseData: Partial<CreateCourseData>): Promise<{ success: boolean; error?: string }> {
    try {
      const profile = await this.getProfessorProfile(userId)
      
      if (!profile) {
        return { success: false, error: 'Professor profile not found' }
      }

      // Find and update the course in the courses array
      const updatedCourses = profile.courses.map(course => 
        course.id === courseId 
          ? { ...course, ...courseData, updated_at: new Date().toISOString() }
          : course
      )

      const { error } = await supabase
        .from('professors')
        .update({ 
          courses: updatedCourses,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('Error updating course:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error updating course:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Delete a course
  static async deleteCourse(userId: string, courseId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const profile = await this.getProfessorProfile(userId)
      
      if (!profile) {
        return { success: false, error: 'Professor profile not found' }
      }

      // Remove the course from the courses array
      const updatedCourses = profile.courses.filter(course => course.id !== courseId)

      const { error } = await supabase
        .from('professors')
        .update({ 
          courses: updatedCourses,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('Error deleting course:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting course:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Get all courses for a professor
  static async getProfessorCourses(userId: string): Promise<Course[]> {
    const profile = await this.getProfessorProfile(userId)
    return profile?.courses || []
  }
}
