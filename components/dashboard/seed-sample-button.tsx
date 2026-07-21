"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { seedSampleCourse } from "@/app/dashboard/courses/sample-actions";
import { useRouter } from "next/navigation";

export default function SeedSampleButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await seedSampleCourse();
      if (res.success) {
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to seed sample course:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition disabled:opacity-50"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
      <span>Load Sample Course</span>
    </button>
  );
}
