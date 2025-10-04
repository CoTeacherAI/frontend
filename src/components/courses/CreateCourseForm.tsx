"use client";

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen, Calendar, Hash, FileText, Building, Award } from 'lucide-react'

import { createCourseSchema, CreateCourseData } from '@/lib/course-schemas'
import { CourseAPI } from '@/lib/course-api'
import { useAuth } from '@/contexts/AuthContext'

interface CreateCourseFormProps {
  isOpen: boolean
  onClose: () => void
  onCourseCreated: () => void
}

export function CreateCourseForm({ isOpen, onClose, onCourseCreated }: CreateCourseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateCourseData>({
    resolver: zodResolver(createCourseSchema)
  })

  const onSubmit = async (data: CreateCourseData) => {
    if (!user) {
      setError('User not found. Please sign in again.')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      console.log('Creating course with data:', data)
      console.log('User ID:', user.id)

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 30000)
      )

      const coursePromise = CourseAPI.createCourse(user.id, data)
      
      const result = await Promise.race([coursePromise, timeoutPromise]) as any

      console.log('Course creation result:', result)

      if (result.success) {
        reset()
        onCourseCreated()
        onClose()
      } else {
        setError(result.error || 'Failed to create course')
      }
    } catch (err) {
      console.error('Course creation error:', err)
      if (err instanceof Error && err.message === 'Request timeout') {
        setError('Request timed out. Please try again.')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-cyan-300" />
                <h2 className="text-xl font-bold text-white">Create New Course</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Course Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-200 mb-2">
                    Course Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BookOpen className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="name"
                      {...register('name')}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 transition"
                      placeholder="e.g., Introduction to Computer Science"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-300">{errors.name.message}</p>
                  )}
                </div>

                {/* Course Code */}
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-slate-200 mb-2">
                    Course Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="code"
                      {...register('code')}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 transition"
                      placeholder="e.g., CS101"
                    />
                  </div>
                  {errors.code && (
                    <p className="mt-1 text-sm text-red-300">{errors.code.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-200 mb-2">
                  Description
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText className="h-4 w-4 text-slate-400" />
                  </div>
                  <textarea
                    id="description"
                    {...register('description')}
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 transition resize-none"
                    placeholder="Brief description of the course content and objectives..."
                  />
                </div>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-300">{errors.description.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Department */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-slate-200 mb-2">
                    Department
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="department"
                      {...register('department')}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 transition"
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-300">{errors.department.message}</p>
                  )}
                </div>

                {/* Credits */}
                <div>
                  <label htmlFor="credits" className="block text-sm font-medium text-slate-200 mb-2">
                    Credits
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Award className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="credits"
                      type="number"
                      {...register('credits', { valueAsNumber: true })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 transition"
                      placeholder="3"
                    />
                  </div>
                  {errors.credits && (
                    <p className="mt-1 text-sm text-red-300">{errors.credits.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Semester */}
                <div>
                  <label htmlFor="semester" className="block text-sm font-medium text-slate-200 mb-2">
                    Semester
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-slate-400" />
                    </div>
                    <select
                      id="semester"
                      {...register('semester')}
                      className="w-full pl-10 pr-12 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-xl text-white focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 transition appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-slate-800 text-white">Select semester</option>
                      <option value="Fall" className="bg-slate-800 text-white">Fall</option>
                      <option value="Spring" className="bg-slate-800 text-white">Spring</option>
                      <option value="Summer" className="bg-slate-800 text-white">Summer</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.semester && (
                    <p className="mt-1 text-sm text-red-300">{errors.semester.message}</p>
                  )}
                </div>

                {/* Year */}
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-slate-200 mb-2">
                    Year
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="year"
                      type="number"
                      {...register('year', { valueAsNumber: true })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 transition"
                      placeholder="2024"
                    />
                  </div>
                  {errors.year && (
                    <p className="mt-1 text-sm text-red-300">{errors.year.message}</p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 border border-white/20 text-slate-200 rounded-lg hover:border-white/40 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isSubmitting ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
