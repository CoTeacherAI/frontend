import { SignInForm } from '@/components/auth/SignInForm'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />
      {/* Subtle glow layers */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(1200px_600px_at_50%_-10%,rgba(56,189,248,0.15),transparent),radial-gradient(800px_400px_at_70%_10%,rgba(168,85,247,0.12),transparent)]" />
      
      <div className="relative z-10 w-full max-w-md px-4">
        <SignInForm />
      </div>
    </div>
  )
}
