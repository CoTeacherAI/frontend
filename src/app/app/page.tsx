"use client";

import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { BookOpen, GraduationCap, Users, Settings } from 'lucide-react'

export default function AppPage() {
  const { user, userRole } = useAuth()

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            {userRole === 'professor' ? (
              <>
                <button 
                  disabled
                  className="px-4 py-2 bg-cyan-500 text-slate-900 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Course
                </button>
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
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
