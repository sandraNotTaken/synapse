"use client";

import { useState, useEffect, useRef } from "react";
import { Timer, Play, Pause, RotateCcw, Coffee, Zap, CheckCircle2 } from "lucide-react";
import { logStudySession } from "@/app/dashboard/study/actions";

export default function PomodoroTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [rewardMsg, setRewardMsg] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const handleTimerComplete = async () => {
    setIsRunning(false);
    if (mode === "focus") {
      setCompletedSessions((prev) => prev + 1);
      setRewardMsg(true);
      setTimeout(() => setRewardMsg(false), 5000);
      try {
        await logStudySession(25 * 60);
      } catch (e) {
        console.error("Failed to log pomodoro focus session:", e);
      }
      setMode("break");
      setTimeLeft(5 * 60);
    } else {
      setMode("focus");
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === "focus" ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: "focus" | "break") => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === "focus" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
          isRunning
            ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 animate-pulse"
            : "border-border bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
        title="Pomodoro Focus Timer"
      >
        <Timer className="h-3.5 w-3.5 text-indigo-500" />
        <span>{formatTime(timeLeft)}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 z-50 w-72 rounded-2xl border border-border bg-card p-5 shadow-2xl space-y-4 backdrop-blur-xl animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-muted/50 p-1 text-xs font-semibold">
            <button
              onClick={() => switchMode("focus")}
              className={`flex-1 rounded-lg py-1.5 transition text-center cursor-pointer ${
                mode === "focus"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Focus (25m)
            </button>
            <button
              onClick={() => switchMode("break")}
              className={`flex-1 rounded-lg py-1.5 transition text-center cursor-pointer ${
                mode === "break"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Break (5m)
            </button>
          </div>

          {/* Timer Display */}
          <div className="text-center py-2 space-y-1">
            <h3 className="text-4xl font-black font-mono tracking-tight text-foreground">
              {formatTime(timeLeft)}
            </h3>
            <p className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-1">
              {mode === "focus" ? (
                <>
                  <Zap className="h-3.5 w-3.5 text-indigo-500" />
                  Deep Focus Mode (+30 XP)
                </>
              ) : (
                <>
                  <Coffee className="h-3.5 w-3.5 text-emerald-500" />
                  Short Rest & Recharge
                </>
              )}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTimer}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white transition cursor-pointer ${
                isRunning ? "bg-amber-600 hover:bg-amber-500" : "bg-indigo-600 hover:bg-indigo-500"
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Start Focus
                </>
              )}
            </button>
            <button
              onClick={resetTimer}
              className="rounded-xl border border-border bg-muted/40 p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Completed count & XP Banner */}
          <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Completed Today: <strong>{completedSessions}</strong></span>
            {rewardMsg && (
              <span className="flex items-center gap-1 font-bold text-emerald-500 animate-bounce">
                <CheckCircle2 className="h-3.5 w-3.5" /> +30 XP Earned!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
