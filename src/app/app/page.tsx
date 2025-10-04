"use client";

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { BookOpen, GraduationCap, Users, Settings, Plus } from 'lucide-react'
import { CreateCourseForm } from '@/components/courses/CreateCourseForm'
import { CourseList } from '@/components/courses/CourseList'

export default function AppPage() {
  const { user, userRole } = useAuth()
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false)
  const [courseCreated, setCourseCreated] = useState(0)

  const handleCourseCreated = () => {
    setCourseCreated(prev => prev + 1)
  }

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            {userRole === 'professor' ? (
              <GraduationCap className="h-8 w-8 text-cyan-300" />
            ) : (
              <BookOpen className="h-8 w-8 text-cyan-300" />
            )}
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {user?.email?.split('@')[0]}!
              </h1>
              <p className="text-slate-300 mt-1">
                {userRole === 'professor' ? 'Professor' : 'Student'} Dashboard
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`grid gap-6 mb-8 ${userRole === 'professor' ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}
        >
          {userRole === 'professor' ? (
            <>
              <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] p-6">
                <Users className="h-5 w-5 text-cyan-300 mb-2" />
                <h3 className="font-semibold mb-2">My Classes</h3>
                <p className="text-slate-300 mb-4">Create and manage courses</p>
                <span className="text-cyan-300 text-sm">Coming soon</span>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] p-6">
                <GraduationCap className="h-5 w-5 text-cyan-300 mb-2" />
                <h3 className="font-semibold mb-2">Upload Content</h3>
                <p className="text-slate-300 mb-4">Add materials for AI tutoring</p>
                <span className="text-cyan-300 text-sm">Coming soon</span>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] p-6">
                <Settings className="h-5 w-5 text-cyan-300 mb-2" />
                <h3 className="font-semibold mb-2">AI Settings</h3>
                <p className="text-slate-300 mb-4">Control tutor behavior</p>
                <span className="text-cyan-300 text-sm">Coming soon</span>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] p-6">
                <BookOpen className="h-5 w-5 text-cyan-300 mb-2" />
                <h3 className="font-semibold mb-2">Analytics</h3>
                <p className="text-slate-300 mb-4">Student progress insights</p>
                <span className="text-cyan-300 text-sm">Coming soon</span>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] p-6">
                <BookOpen className="h-5 w-5 text-cyan-300 mb-2" />
                <h3 className="font-semibold mb-2">My Courses</h3>
                <p className="text-slate-300 mb-4">Access your enrolled courses</p>
                <span className="text-cyan-300 text-sm">Coming soon</span>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] p-6">
                <GraduationCap className="h-5 w-5 text-cyan-300 mb-2" />
                <h3 className="font-semibold mb-2">AI Tutor</h3>
                <p className="text-slate-300 mb-4">Chat with course AI assistant</p>
                <span className="text-cyan-300 text-sm">Coming soon</span>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] p-6">
                <Users className="h-5 w-5 text-cyan-300 mb-2" />
                <h3 className="font-semibold mb-2">Study Groups</h3>
                <p className="text-slate-300 mb-4">Collaborate with classmates</p>
                <span className="text-cyan-300 text-sm">Coming soon</span>
              </div>
            </>
          )}
        </motion.div>

        {userRole === 'professor' ? (
          <>
            {/* Course Management Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">My Courses</h2>
                <button
                  onClick={() => setIsCreateCourseOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-slate-900 font-medium rounded-lg hover:bg-cyan-300 transition"
                >
                  <Plus className="h-4 w-4" />
                  Create Course
                </button>
              </div>
              <CourseList onCourseCreated={handleCourseCreated} />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="flex gap-4">
                <button 
                  disabled
                  className="px-4 py-2 border border-white/20 text-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload Materials
                </button>
                <button 
                  disabled
                  className="px-4 py-2 border border-white/20 text-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Manage Students
                </button>
                <button 
                  disabled
                  className="px-4 py-2 border border-white/20 text-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  AI Settings
                </button>
              </div>
            </motion.div>
          </>
        ) : (
          /* Student Quick Actions */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="flex gap-4">
              <button 
                disabled
                className="px-4 py-2 bg-cyan-500 text-slate-900 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join Course
              </button>
              <button 
                disabled
                className="px-4 py-2 border border-white/20 text-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Chatting
              </button>
              <button 
                disabled
                className="px-4 py-2 border border-white/20 text-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                View Progress
              </button>
            </div>
          </motion.div>
        )}

        {/* Create Course Modal */}
        <CreateCourseForm
          isOpen={isCreateCourseOpen}
          onClose={() => setIsCreateCourseOpen(false)}
          onCourseCreated={handleCourseCreated}
        />
      </div>
    </div>
  )
}
