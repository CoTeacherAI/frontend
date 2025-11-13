"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"student" | "professor">("student");
  const [schoolId, setSchoolId] = useState(""); // <-- new
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!schoolId.trim()) {
      setError("Please enter your School ID");
      return;
    }

    try {
      setLoading(true);

      // 1) create auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // 2) create profile row (role, username, school_id)
      const authUser = data.user;
      if (authUser) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: authUser.id,
            email,
            username,
            role,
            school_id: schoolId.trim(), // <-- save here
          },
        ]);

        if (profileError) {
          setError(profileError.message);
          return;
        }
      }

      // 3) go to app root; it will redirect by role
      router.push("/app");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/70 backdrop-blur-xl rounded-xl p-6 border border-stone-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <h1 className="text-2xl font-bold mb-4 text-center text-stone-900">Sign Up</h1>
        {error && (
          <div className="mb-3 text-red-600 text-sm bg-red-100 p-2 rounded border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-white/80 border border-stone-300 focus:border-orange-400 text-stone-900 placeholder:text-stone-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Preferred Username"
            className="w-full px-4 py-2 rounded-lg bg-white/80 border border-stone-300 focus:border-orange-400 text-stone-900 placeholder:text-stone-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <select
            className="w-full px-4 py-2 rounded-lg bg-white/80 border border-stone-300 focus:border-orange-400 text-stone-900"
            value={role}
            onChange={(e) => setRole(e.target.value as "student" | "professor")}
          >
            <option value="student">Student</option>
            <option value="professor">Professor</option>
          </select>

          <input
            type="text"
            placeholder="School ID (required)"
            className="w-full px-4 py-2 rounded-lg bg-white/80 border border-stone-300 focus:border-orange-400 text-stone-900 placeholder:text-stone-500"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-white/80 border border-stone-300 focus:border-orange-400 text-stone-900 placeholder:text-stone-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 rounded-lg bg-white/80 border border-stone-300 focus:border-orange-400 text-stone-900 placeholder:text-stone-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-900 font-semibold rounded-lg hover:from-orange-400 hover:to-amber-400 transition disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-stone-600">
          Already have an account?{" "}
          <a href="/auth/signin" className="text-orange-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}