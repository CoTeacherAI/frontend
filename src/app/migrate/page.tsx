"use client";

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, GraduationCap, BookOpen, CheckCircle, AlertCircle } from 'lucide-react'
import { UserMigration } from '@/lib/migrate-existing-users'
import { useAuth } from '@/contexts/AuthContext'

export default function MigratePage() {
  const [isMigrating, setIsMigrating] = useState(false)
  const [migrationResult, setMigrationResult] = useState<{
    success: boolean
    message: string
    migrated?: number
  } | null>(null)
  const { user, userRole } = useAuth()

  const handleMigration = async () => {
    if (!user) return

    try {
      setIsMigrating(true)
      setMigrationResult(null)

      const result = await UserMigration.autoMigrateUsers()
      
      if (result.success) {
        setMigrationResult({
          success: true,
          message: `Successfully migrated ${result.migrated} users`,
          migrated: result.migrated
        })
      } else {
        setMigrationResult({
          success: false,
          message: result.error || 'Migration failed'
        })
      }
    } catch (error) {
      setMigrationResult({
        success: false,
        message: 'An unexpected error occurred during migration'
      })
    } finally {
      setIsMigrating(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(1200px_600px_at_50%_-10%,rgba(56,189,248,0.15),transparent),radial-gradient(800px_400px_at_70%_10%,rgba(168,85,247,0.12),transparent)]" />
        
        <div className="relative z-10 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please sign in first</h1>
          <p className="text-slate-300">You need to be signed in to run the migration.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(1200px_600px_at_50%_-10%,rgba(56,189,248,0.15),transparent),radial-gradient(800px_400px_at_70%_10%,rgba(168,85,247,0.12),transparent)]" />
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.35)] p-8"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              {userRole === 'professor' ? (
                <GraduationCap className="h-8 w-8 text-cyan-300" />
              ) : (
                <BookOpen className="h-8 w-8 text-cyan-300" />
              )}
              <h1 className="text-2xl font-bold text-white">User Migration</h1>
            </div>
            <p className="text-slate-300">
              Migrate existing users to create their profile records in the database.
            </p>
          </div>

          <div className="space-y-6">
            {/* Current User Info */}
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3 mb-2">
                <User className="h-5 w-5 text-slate-400" />
                <h3 className="font-semibold text-white">Current User</h3>
              </div>
              <div className="text-sm text-slate-300 space-y-1">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {userRole || 'Unknown'}</p>
                <p><strong>User ID:</strong> {user.id}</p>
              </div>
            </div>

            {/* Migration Status */}
            {migrationResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-lg p-4 flex items-center gap-3 ${
                  migrationResult.success 
                    ? 'bg-green-500/20 border border-green-500/30 text-green-200'
                    : 'bg-red-500/20 border border-red-500/30 text-red-200'
                }`}
              >
                {migrationResult.success ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <div>
                  <p className="font-semibold">
                    {migrationResult.success ? 'Migration Successful!' : 'Migration Failed'}
                  </p>
                  <p className="text-sm">{migrationResult.message}</p>
                </div>
              </motion.div>
            )}

            {/* Migration Button */}
            <div className="text-center">
              <button
                onClick={handleMigration}
                disabled={isMigrating}
                className="px-6 py-3 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 mx-auto"
              >
                {isMigrating ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-slate-900 border-t-transparent rounded-full"></div>
                    Migrating...
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4" />
                    Run Migration
                  </>
                )}
              </button>
            </div>

            {/* Instructions */}
            <div className="text-sm text-slate-400 space-y-2">
              <p><strong>What this does:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Finds all users without profile records</li>
                <li>Creates professor/student profiles based on their role</li>
                <li>Uses default values for missing profile data</li>
                <li>Updates the database with the new records</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
