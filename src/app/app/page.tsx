"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

export default function AppIndex() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // wait until we know
    if (!user) {
      router.replace("/auth/signin");
    } else if (userRole === "professor") {
      router.replace("/app/professor");
    } else {
      router.replace("/app/student");
    }
  }, [user, userRole, loading, router]);

  return <p className="text-center pt-32 text-stone-700">Loading your dashboard...</p>;
}