"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { deleteCourse, deleteTopic, deleteDeck } from "@/app/dashboard/courses/[courseId]/actions";

interface DeleteButtonProps {
  type: "course" | "topic" | "deck";
  id: string;
  className?: string;
  onSuccess?: () => void;
}

export default function DeleteButton({ type, id, className = "", onSuccess }: DeleteButtonProps) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm) {
      setConfirm(true);
      // Auto-reset confirmation state after 3 seconds
      setTimeout(() => setConfirm(false), 3000);
      return;
    }

    setLoading(true);
    try {
      if (type === "course") {
        await deleteCourse(id);
        if (typeof window !== "undefined" && window.location.pathname.includes(`/courses/${id}`)) {
          router.push("/dashboard/courses");
        }
      } else if (type === "topic") {
        await deleteTopic(id);
        if (typeof window !== "undefined" && window.location.pathname.includes(`/topics/${id}`)) {
          router.push("/dashboard/courses");
        }
      } else if (type === "deck") {
        await deleteDeck(id);
        if (typeof window !== "undefined" && window.location.pathname.includes(`/review/${id}`)) {
          router.push("/dashboard/study");
        }
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(`Failed to delete ${type}:`, err);
      alert(`Failed to delete ${type}. Please try again.`);
    } finally {
      setLoading(false);
      setConfirm(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className={`group/btn relative flex h-8 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold cursor-pointer transition-all duration-200 ${
        confirm
          ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
          : "border-border bg-card text-muted-foreground hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-600 dark:hover:text-red-400"
      } ${className}`}
      title={confirm ? "Click again to confirm delete" : `Delete ${type}`}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5 transition group-hover/btn:scale-105" />
      )}
      {confirm && <span>Confirm Delete</span>}
    </button>
  );
}
