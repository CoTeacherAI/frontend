"use client";

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = '/auth/signin' }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="animate-spin h-5 w-5 border-2 border-cyan-300 border-t-transparent rounded-full"></div>
            <span className="text-slate-200">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
