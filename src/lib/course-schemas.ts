import { z } from 'zod'

export const courseSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Course name is required').max(100, 'Course name must be less than 100 characters'),
  code: z.string().min(1, 'Course code is required').max(20, 'Course code must be less than 20 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  semester: z.string().min(1, 'Semester is required'),
  year: z.number().min(2020, 'Year must be 2020 or later').max(2030, 'Year must be 2030 or earlier'),
  department: z.string().min(1, 'Department is required'),
  credits: z.number().min(1, 'Credits must be at least 1').max(10, 'Credits must be 10 or less'),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
})

export const createCourseSchema = courseSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
})

export type Course = z.infer<typeof courseSchema>
export type CreateCourseData = z.infer<typeof createCourseSchema>

export interface ProfessorProfile {
  id: string
  full_name: string
  department: string
  courses: Course[]
  created_at: string
  updated_at: string
}

export interface StudentProfile {
  id: string
  full_name: string
  major: string
  graduation_year: number
  courses: Course[]
  created_at: string
  updated_at: string
}
