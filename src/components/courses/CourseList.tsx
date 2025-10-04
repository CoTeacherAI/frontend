"use client";

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Calendar, Hash, Building, Award, Edit, Trash2, Users } from 'lucide-react'

import { Course } from '@/lib/course-schemas'
import { CourseAPI } from '@/lib/course-api'
import { useAuth } from '@/contexts/AuthContext'

interface CourseListProps {
  onCourseCreated: () => void
}

export function CourseList({ onCourseCreated }: CourseListProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchCourses = async () => {
    if (!user) return

    try {
      setLoading(true)
      const coursesData = await CourseAPI.getProfessorCourses(user.id)
      setCourses(coursesData)
    } catch (err) {
      setError('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [user])

  useEffect(() => {
    if (onCourseCreated) {
      fetchCourses()
    }
  }, [onCourseCreated])

  const handleDeleteCourse = async (courseId: string) => {
    if (!user || !confirm('Are you sure you want to delete this course?')) return

    try {
      const result = await CourseAPI.deleteCourse(user.id, courseId)
      if (result.success) {
        setCourses(courses.filter(course => course.id !== courseId))
      } else {
        setError(result.error || 'Failed to delete course')
      }
    } catch (err) {
      setError('Failed to delete course')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-700/50 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-slate-700/30 rounded w-1/2 mb-4"></div>
              <div className="flex gap-4">
                <div className="h-3 bg-slate-700/30 rounded w-20"></div>
                <div className="h-3 bg-slate-700/30 rounded w-16"></div>
                <div className="h-3 bg-slate-700/30 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] p-6 text-center">
        <p className="text-red-300 mb-4">{error}</p>
        <button
          onClick={fetchCourses}
          className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] p-8 text-center">
        <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No courses yet</h3>
        <p className="text-slate-300 mb-4">Create your first course to get started with CoTeacher AI</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {courses.map((course, index) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] p-6 hover:border-white/25 transition"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-5 w-5 text-cyan-300" />
                <h3 className="text-lg font-semibold text-white">{course.name}</h3>
                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full">
                  {course.code}
                </span>
              </div>
              <p className="text-slate-300 mb-4">{course.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>{course.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{course.semester} {course.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>{course.credits} credits</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>0 students</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => {/* TODO: Implement edit */}}
                className="p-2 hover:bg-white/10 rounded-lg transition text-slate-400 hover:text-white"
                title="Edit course"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteCourse(course.id!)}
                className="p-2 hover:bg-red-500/20 rounded-lg transition text-slate-400 hover:text-red-300"
                title="Delete course"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
