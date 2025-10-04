"use client";

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

import { signInSchema, SignInFormData } from '@/lib/schemas'
import { useAuth } from '@/contexts/AuthContext'

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { signIn } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema)
  })

  const onSubmit = async (data: SignInFormData) => {
    try {
      setError(null)
      const { error } = await signIn(data.email, data.password)
      
      if (error) {
        setError(error.message || 'Failed to sign in')
      } else {
        router.push('/app')
      }
    } catch {
      setError('An unexpected error occurred')
    }
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
            Welcome back
          </h1>
          <p className="text-slate-300">
            Sign in to continue your learning journey
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
                placeholder="Enter your password"
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

          {/* Sign in button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bgctext-slate-900 font-semibold rounded-lg hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>

          {/* Forgot password */}
          <div className="text-center">
            <Link 
              href="/auth/forgot-password"
              className="text-sm text-slate-300 hover:text-white transition"
            >
              Forgot your password?
            </Link>
          </div>
        </form>

        {/* Sign up link */}
        <div className="mt-8 text-center text-sm text-slate-300">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-cyan-300 hover:text-cyan-200 font-medium transition">
            Sign up
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
