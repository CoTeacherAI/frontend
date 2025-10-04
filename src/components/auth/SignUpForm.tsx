"use client";

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react'

import { signUpSchema, SignUpFormData } from '@/lib/schemas'
import { useAuth, UserRole } from '@/contexts/AuthContext'

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { signUp } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema)
  })

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setError(null)
      const { error } = await signUp(data.email, data.password, data.role as UserRole)
      
      if (error) {
        setError(error.message || 'Failed to create account')
      } else {
        setSuccess(true)
        // Keep user on signup page but show success message
        // Email confirmation is required per Supabase defaults
      }
    } catch (err) {
      setError('An unexpected error occurred')
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-4 text-sm text-slate-300 hover:text-white transition"
          >
            ← Back to home
          </Link>
        </div>

        <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] p-8 text-center">
          <div className="mb-4">
            <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-green-300" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            Check your email
          </h1>
          <p className="text-slate-300 mb-6">
            We've sent you a confirmation link. Once you verify your email, you can sign in.
          </p>
          
          <Link 
            href="/auth/signin"
            className="inline-flex items-center px-6 py-3 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-300 transition"
          >
            Go to sign in
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Back to home link */}
      <div className="mb-6">
        <Link 
          href="/"
          className="inline-flex items-center gap-4 text-sm text-slate-300 hover:text-white transition"
        >
          ← Back to home
        </Link>
      </div>

      {/* Glass container */}
      <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Join CoTeacher AI
          </h1>
          <p className="text-slate-300">
            Create your account to start learning
          </p>
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
          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 transition"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>
            )}
          </div>

          {/* Role selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-200 mb-2">
              I am a...
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GraduationCap className="h-4 w-4 text-slate-400" />
              </div>
              <select
                id="role"
                {...register('role')}
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-xl text-white focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 transition appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-800 text-white">Select your role</option>
                <option value="student" className="bg-slate-800 text-white">Student - Learner & AI tutor user</option>
                <option value="professor" className="bg-slate-800 text-white">Professor - Course creator & instructor</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.role && (
              <p className="mt-2 text-sm text-red-300">{errors.role.message}</p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 transition"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-300">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm password field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 transition"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-300">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Sign up button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>

          {/* Terms */}
          <p className="text-xs text-center text-slate-400">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-cyan-300 hover:text-cyan-200">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-cyan-300 hover:text-cyan-200">
              Privacy Policy
            </Link>
          </p>
        </form>

        {/* Sign in link */}
        <div className="mt-8 text-center text-sm text-slate-300">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-cyan-300 hover:text-cyan-200 font-medium transition">
            Sign in
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
