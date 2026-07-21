"use client";

import { useState } from "react";
import { Calendar, Sparkles, CheckCircle2, Clock, BookOpen, Plus, Loader2 } from "lucide-react";

export default function ExamScheduler() {
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [schedule, setSchedule] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateSchedule = () => {
    if (!examName || !examDate) return;
    setLoading(true);

    const target = new Date(examDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const daysLeft = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Generate AI revision plan items
    setTimeout(() => {
      const plan = [
        {
          day: "Days 1-" + Math.max(1, Math.floor(daysLeft * 0.3)),
          phase: "Foundation Review",
          action: "Review low-confidence cards in core topics and summarize dense notes.",
          status: "Recommended",
        },
        {
          day: "Days " + Math.max(2, Math.floor(daysLeft * 0.3) + 1) + "-" + Math.max(2, Math.floor(daysLeft * 0.7)),
          phase: "Active Recall & Exams",
          action: "Take AI practice exams and complete spaced repetition card reviews.",
          status: "High Priority",
        },
        {
          day: "Days " + Math.max(3, Math.floor(daysLeft * 0.7) + 1) + "-" + daysLeft,
          phase: "Final Consolidation",
          action: "Run Feynman Technique self-tests and review flagged cards.",
          status: "Final Prep",
        },
      ];
      setSchedule(plan);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-5">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-500" />
          <h3 className="text-sm font-bold text-foreground">Exam Countdown & AI Revision Plan</h3>
        </div>
      </div>

      {!schedule ? (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Set your target exam date. Synapse will generate a daily AI revision schedule so you never have to cram.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Exam Title</label>
              <input
                type="text"
                placeholder="e.g. Organic Chemistry Midterm"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Target Date</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateSchedule}
            disabled={loading || !examName || !examDate}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-bold text-white transition disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate Revision Plan
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-foreground">{examName}</h4>
              <p className="text-xs text-muted-foreground">Target: {examDate}</p>
            </div>
            <button
              onClick={() => setSchedule(null)}
              className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 cursor-pointer"
            >
              Reset Date
            </button>
          </div>

          <div className="space-y-2.5">
            {schedule.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border/60 bg-muted/20 p-3.5 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.day}: {item.phase}</span>
                  <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-300">
                    {item.status}
                  </span>
                </div>
                <p className="text-muted-foreground">{item.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
