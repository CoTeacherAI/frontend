"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function ClassParkAppIndex() {
  const router = useRouter();
  const { user, userRole, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/auth/signin");
    } else if (userRole === "professor") {
      router.replace("/products/classpark/professor");
    } else {
      // Students can view recordings/notes but not create them
      router.replace("/products/classpark/professor");
    }
  }, [user, userRole, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
        <p className="text-stone-700 font-medium">Loading ClassPark...</p>
        <p className="text-sm text-stone-600 mt-2">Redirecting you to your workspace</p>
      </div>
    </div>
  );
}

