"use client";

import { useState, useTransition } from "react";
import { updateDailyGoal } from "@/app/dashboard/study/actions";
import { Target, Check, Loader2 } from "lucide-react";

interface GoalSettingsProps {
  currentGoal: number;
}

const GOAL_OPTIONS = [15, 30, 45, 60, 90, 120];

export default function GoalSettings({ currentGoal }: GoalSettingsProps) {
  const [selectedGoal, setSelectedGoal] = useState(currentGoal);
  const [isPending, startTransition] = useTransition();

  const handleSelectGoal = (minutes: number) => {
    setSelectedGoal(minutes);
    startTransition(async () => {
      try {
        await updateDailyGoal(minutes);
      } catch (err) {
        console.error("Failed to update daily goal:", err);
      }
    });
  };

  return (
    <div className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-500" />
          Daily Learning Goal
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Adjust your target daily study limit to stay on track.
        </p>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground block">
          Target Study Time (Minutes)
        </label>
        
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {GOAL_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              disabled={isPending}
              onClick={() => handleSelectGoal(option)}
              className={`flex flex-col items-center justify-center rounded-2xl border py-3.5 px-2 transition-all cursor-pointer ${
                selectedGoal === option
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold"
                  : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              <span className="text-base">{option}</span>
              <span className="text-[10px] mt-0.5 opacity-80">min</span>
            </button>
          ))}
        </div>

        {/* Saving Status */}
        <div className="flex items-center gap-2 text-xs min-h-[16px]">
          {isPending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" />
              <span className="text-muted-foreground">Saving daily goal settings...</span>
            </>
          ) : selectedGoal === currentGoal ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-medium">Daily goal synced successfully</span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
