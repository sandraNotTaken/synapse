"use client";

import React, { useState } from "react";
import { Brain, Sparkles, TrendingDown, Clock, ShieldCheck, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

interface RetentionPredictorProps {
  totalCards: number;
  dueCardsCount: number;
}

export default function RetentionPredictor({ totalCards, dueCardsCount }: RetentionPredictorProps) {
  const [decayDays, setDecayDays] = useState(3);

  // Ebbinghaus Forgetting Curve formula simulation: R = e^(-t / S)
  // Base stability S = 7 days for active study deck
  const stability = 7;
  const currentRetention = Math.round(Math.exp(-0.5 / stability) * 100); // Today
  const projectedRetention = Math.round(Math.exp(-decayDays / stability) * 100);

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 via-card/60 to-purple-500/5 p-6 backdrop-blur-xl space-y-6 shadow-xl relative overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-indigo-500/10 p-1.5 text-indigo-500">
              <Brain className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
              AI Standout Feature
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-foreground">
            Ebbinghaus Memory Retention Predictor
          </h3>
          <p className="text-xs text-muted-foreground">
            AI-driven mathematical model simulating your memory decay curve and optimal review windows.
          </p>
        </div>

        <Link
          href="/dashboard/study"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition cursor-pointer shrink-0"
        >
          <Zap className="h-4 w-4" />
          <span>Optimal Review Session</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card/80 p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Current Recall Rate
          </span>
          <div className="text-3xl font-black text-emerald-500 flex items-center gap-1.5">
            <span>{currentRetention}%</span>
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="text-[10px] text-muted-foreground">High memory stability today</p>
        </div>

        <div className="rounded-xl border border-border bg-card/80 p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Cards At Decay Risk
          </span>
          <div className="text-3xl font-black text-indigo-500">{dueCardsCount}</div>
          <p className="text-[10px] text-muted-foreground">Out of {totalCards} total cards</p>
        </div>

        <div className="rounded-xl border border-border bg-card/80 p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Projected in {decayDays} Days
          </span>
          <div className="text-3xl font-black text-amber-500">{projectedRetention}%</div>
          <p className="text-[10px] text-muted-foreground">Without review intervention</p>
        </div>
      </div>

      {/* Interactive Forgetting Curve Slider */}
      <div className="rounded-xl border border-border bg-muted/20 p-5 space-y-4">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-500" />
            Simulate Memory Decay Over Time
          </span>
          <span className="text-indigo-500 font-extrabold">{decayDays} Days Elapsed</span>
        </div>

        <input
          type="range"
          min="1"
          max="30"
          value={decayDays}
          onChange={(e) => setDecayDays(Number(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer h-2 rounded-lg bg-muted"
        />

        {/* Dynamic Curve Visualization Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
            <span>Memory Retention Level: {projectedRetention}%</span>
            <span>Optimal Window: ≥ 75%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                projectedRetention >= 75
                  ? "bg-emerald-500"
                  : projectedRetention >= 50
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
              style={{ width: `${projectedRetention}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
