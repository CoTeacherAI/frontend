"use client";

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { ProfileAPI } from '@/lib/profile-api'

export type UserRole = 'student' | 'professor'

interface AuthContextType {
  user: User | null
  userRole: UserRole | null
  loading: boolean
  signUp: (email: string, password: string, role: UserRole, fullName: string, additionalData?: any) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      
      // Extract role from user metadata
      if (session?.user) {
        const metadata = session.user.user_metadata
        const role = metadata?.role || 'student'
        setUserRole(role)

        // Set loading to false immediately to prevent UI blocking
        setLoading(false)

        // Check if profile exists, if not create it (non-blocking)
        try {
          const profileExists = await ProfileAPI.profileExists(session.user.id, role as 'professor' | 'student')
          
          if (!profileExists) {
            console.log('Profile not found, creating...')
            const fullName = metadata?.full_name || session.user.email?.split('@')[0] || 'Unknown User'
            
            if (role === 'professor') {
              await ProfileAPI.createProfessorProfile(
                session.user.id,
                fullName,
                metadata?.department || 'General'
              )
            } else {
              await ProfileAPI.createStudentProfile(
                session.user.id,
                fullName,
                metadata?.major || 'General',
                metadata?.graduation_year || 2025
              )
            }
            console.log('Profile created successfully')
          }
        } catch (error) {
          console.error('Error checking/creating profile:', error)
          // Don't block the UI if profile creation fails
        }
      } else {
        setUserRole(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, role: UserRole, fullName: string, additionalData?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          role: role,
          full_name: fullName
        }
      }
    })

    if (error) {
      return { error }
    }

    // Create profile after successful signup
    if (data.user) {
      try {
        if (role === 'professor') {
          await ProfileAPI.createProfessorProfile(
            data.user.id,
            fullName,
            additionalData?.department || ''
          )
        } else if (role === 'student') {
          await ProfileAPI.createStudentProfile(
            data.user.id,
            fullName,
            additionalData?.major || '',
            additionalData?.graduationYear || 0
          )
        }
      } catch (profileError) {
        console.error('Error creating profile:', profileError)
        // Don't fail the signup if profile creation fails
      }
    }

    return { error: null }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    return { error }  
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    userRole,
    loading,
    signUp,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
