"use client";

import React, { useState } from "react";
import { BarChart3, Clock, Target, CheckCircle2, TrendingUp, Sparkles, Brain, ArrowUpRight } from "lucide-react";

export interface DayAnalytics {
  day: string;
  dateStr: string;
  mins: number;
  cardsReviewed: number;
}

interface AnalyticsChartProps {
  weeklyData: DayAnalytics[];
  dailyGoal: number;
}

export default function AnalyticsChart({ weeklyData, dailyGoal }: AnalyticsChartProps) {
  const [metricMode, setMetricMode] = useState<"mins" | "cards">("mins");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const totalMins = weeklyData.reduce((acc, d) => acc + d.mins, 0);
  const totalCards = weeklyData.reduce((acc, d) => acc + d.cardsReviewed, 0);
  const avgMins = Math.round(totalMins / 7);
  const daysMetGoal = weeklyData.filter((d) => d.mins >= dailyGoal).length;
  const goalCompletionRate = Math.round((daysMetGoal / 7) * 100);

  // Auto scale maximum value
  const maxValue = Math.max(
    ...weeklyData.map((d) => (metricMode === "mins" ? d.mins : d.cardsReviewed)),
    metricMode === "mins" ? dailyGoal : 15,
    10
  );

  // SVG Chart Dimensions
  const width = 700;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;
  const availableWidth = width - paddingX * 2;
  const availableHeight = height - paddingY * 2;

  // Calculate coordinates
  const points = weeklyData.map((d, i) => {
    const val = metricMode === "mins" ? d.mins : d.cardsReviewed;
    const x = paddingX + (i / (weeklyData.length - 1)) * availableWidth;
    const y = height - paddingY - (val / maxValue) * availableHeight;
    return { x, y, val, day: d.day, dateStr: d.dateStr, raw: d };
  });

  // Cubic Bezier Spline Path Generator for Twitter-style silk smooth curves
  function getCubicBezierPath(pts: typeof points) {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp1y = curr.y;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      const cp2y = next.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    return d;
  }

  const pathD = getCubicBezierPath(points);
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  // Daily target reference line Y coordinate
  const goalY =
    metricMode === "mins"
      ? height - paddingY - (dailyGoal / maxValue) * availableHeight
      : null;

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div className="space-y-6">
      {/* Twitter Analytics Header Metrics Bar */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-500">
              <BarChart3 className="h-4 w-4" />
              <span>Activity & Focus Overview</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mt-1">
              Analytics Summary
            </h2>
          </div>

          {/* Metric Selector Pills */}
          <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/40 p-1">
            <button
              onClick={() => setMetricMode("mins")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                metricMode === "mins"
                  ? "bg-background text-foreground shadow-sm font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Focus Time
            </button>
            <button
              onClick={() => setMetricMode("cards")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                metricMode === "cards"
                  ? "bg-background text-foreground shadow-sm font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Card Reviews
            </button>
          </div>
        </div>

        {/* Twitter Analytics 4-Stat Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-5">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-medium">Total Focus Time</span>
            <div className="text-2xl font-bold tracking-tight text-foreground flex items-baseline gap-1">
              {totalMins} <span className="text-xs text-muted-foreground font-normal">mins</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium pt-0.5">
              <TrendingUp className="h-3 w-3" />
              <span>Past 7 days</span>
            </div>
          </div>

          <div className="space-y-1 border-l border-border/40 pl-4 sm:pl-6">
            <span className="text-xs text-muted-foreground font-medium">Daily Average</span>
            <div className="text-2xl font-bold tracking-tight text-foreground flex items-baseline gap-1">
              {avgMins} <span className="text-xs text-muted-foreground font-normal">m / day</span>
            </div>
            <div className="text-[11px] text-muted-foreground pt-0.5">
              Target: {dailyGoal}m / day
            </div>
          </div>

          <div className="space-y-1 border-l border-border/40 pl-4 sm:pl-6">
            <span className="text-xs text-muted-foreground font-medium">Goal Completion</span>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {goalCompletionRate}%
            </div>
            <div className="text-[11px] text-indigo-500 font-medium pt-0.5">
              {daysMetGoal} of 7 days completed
            </div>
          </div>

          <div className="space-y-1 border-l border-border/40 pl-4 sm:pl-6">
            <span className="text-xs text-muted-foreground font-medium">Cards Reviewed</span>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {totalCards}
            </div>
            <div className="text-[11px] text-muted-foreground pt-0.5">
              Spaced repetition reviews
            </div>
          </div>
        </div>
      </div>

      {/* Clean Twitter Analytics SVG Area Chart Box */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm relative space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {metricMode === "mins" ? "Daily Focus Minutes (7 Days)" : "Daily Flashcards Reviewed (7 Days)"}
          </h3>
          {activePoint && (
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 animate-fade-in">
              <span>{activePoint.day} ({activePoint.dateStr}):</span>
              <span className="text-foreground">{activePoint.val} {metricMode === "mins" ? "minutes" : "cards"}</span>
            </div>
          )}
        </div>

        {/* Clean Interactive SVG Area Chart */}
        <div className="relative w-full pt-2">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-52 overflow-visible select-none"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <defs>
              <linearGradient id="twitterAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Minimalist Horizontal Gridlines (Only 3 lines) */}
            {[0, 0.5, 1].map((ratio, idx) => {
              const y = paddingY + ratio * availableHeight;
              const val = Math.round((1 - ratio) * maxValue);
              return (
                <g key={idx}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="currentColor"
                    className="text-border/30"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 10}
                    y={y + 3}
                    textAnchor="end"
                    className="fill-muted-foreground text-[10px] font-medium"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Target Goal Reference Line */}
            {goalY !== null && (
              <g>
                <line
                  x1={paddingX}
                  y1={goalY}
                  x2={width - paddingX}
                  y2={goalY}
                  stroke="#10b981"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  className="opacity-70"
                />
              </g>
            )}

            {/* Area Fill */}
            <path d={areaD} fill="url(#twitterAreaGradient)" />

            {/* Silk Smooth Spline Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Vertical Crosshair Line & Nodes */}
            {points.map((pt, idx) => {
              const isHovered = hoveredIdx === idx;
              return (
                <g
                  key={idx}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  className="cursor-pointer"
                >
                  {/* Invisible hit column for smooth mouse tracking */}
                  <rect
                    x={pt.x - availableWidth / 12}
                    y={0}
                    width={availableWidth / 6}
                    height={height}
                    fill="transparent"
                  />

                  {/* Vertical Crosshair Line */}
                  {isHovered && (
                    <line
                      x1={pt.x}
                      y1={paddingY}
                      x2={pt.x}
                      y2={height - paddingY}
                      stroke="#6366f1"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      className="opacity-60"
                    />
                  )}

                  {/* Data Point Node */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? "5" : "3.5"}
                    className={`${
                      isHovered
                        ? "fill-indigo-600 stroke-background stroke-2 shadow-lg"
                        : "fill-indigo-500/80 hover:fill-indigo-600"
                    } transition-all duration-150`}
                  />

                  {/* X-Axis Day Labels */}
                  <text
                    x={pt.x}
                    y={height - 5}
                    textAnchor="middle"
                    className={`text-[10px] font-medium transition-colors ${
                      isHovered ? "fill-foreground font-bold" : "fill-muted-foreground"
                    }`}
                  >
                    {pt.day}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
