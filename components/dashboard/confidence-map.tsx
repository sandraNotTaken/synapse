"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Layers, CheckCircle2, AlertCircle, Info, Sparkles } from "lucide-react";

export interface TopicConfidence {
  id: string;
  title: string;
  courseTitle: string;
  courseColor: string;
  cardCount: number;
  avgConfidence: number; // 0 to 4
  ratingsBreakdown: {
    again: number;
    hard: number;
    good: number;
    easy: number;
  };
}

interface ConfidenceMapProps {
  topics: TopicConfidence[];
}

export default function ConfidenceMap({ topics }: ConfidenceMapProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [hoveredTopic, setHoveredTopic] = useState<TopicConfidence | null>(null);

  // Extract unique courses for filtering
  const courses = Array.from(new Set(topics.map((t) => t.courseTitle)));

  const filteredTopics = selectedCourse === "all"
    ? topics
    : topics.filter((t) => t.courseTitle === selectedCourse);

  const getConfidenceLevel = (score: number, cardCount: number) => {
    if (cardCount === 0) return { label: "Unreviewed", colorClass: "bg-muted/30 border-border border-dashed text-muted-foreground", textClass: "text-muted-foreground", badge: "border-border" };
    if (score < 1.8) return { label: "Needs Review", colorClass: "bg-rose-500/10 dark:bg-rose-500/5 border-rose-500/30 text-rose-600 dark:text-rose-400 shadow-[inset_0_1px_1px_rgba(244,63,94,0.05)]", textClass: "text-rose-600 dark:text-rose-400", badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" };
    if (score < 2.6) return { label: "Learning", colorClass: "bg-orange-500/10 dark:bg-orange-500/5 border-orange-500/30 text-orange-600 dark:text-orange-400 shadow-[inset_0_1px_1px_rgba(249,115,22,0.05)]", textClass: "text-orange-600 dark:text-orange-400", badge: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" };
    if (score < 3.4) return { label: "Familiar", colorClass: "bg-indigo-500/10 dark:bg-indigo-500/5 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 shadow-[inset_0_1px_1px_rgba(99,102,241,0.05)]", textClass: "text-indigo-600 dark:text-indigo-400", badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" };
    return { label: "Mastered", colorClass: "bg-emerald-500/10 dark:bg-emerald-500/5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-[inset_0_1px_1px_rgba(16,185,129,0.05)]", textClass: "text-emerald-600 dark:text-emerald-400", badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" };
  };

  return (
    <Card className="border-border bg-card/45 backdrop-blur-xl">
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-foreground">Knowledge Confidence Map</h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              A comprehensive visualization of subject mastery across all study paths.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCourse("all")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer border ${
                selectedCourse === "all"
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
                  : "bg-muted/40 border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              All Paths
            </button>
            {courses.map((course) => (
              <button
                key={course}
                onClick={() => setSelectedCourse(course)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer border ${
                  selectedCourse === course
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
                    : "bg-muted/40 border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {course}
              </button>
            ))}
          </div>
        </div>

        {/* Map Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTopics.map((topic) => {
            const level = getConfidenceLevel(topic.avgConfidence, topic.cardCount);
            return (
              <div
                key={topic.id}
                onMouseEnter={() => setHoveredTopic(topic)}
                onMouseLeave={() => setHoveredTopic(null)}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${level.colorClass}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-current bg-background/50"
                      style={{ color: topic.courseColor }}
                    >
                      {topic.courseTitle}
                    </span>
                    {topic.cardCount > 0 && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${level.badge}`}>
                        {level.label}
                      </span>
                    )}
                  </div>

                  <h4 className="mt-3.5 text-sm font-bold text-foreground leading-snug line-clamp-1">
                    {topic.title}
                  </h4>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border/10 pt-3">
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {topic.cardCount} {topic.cardCount === 1 ? "card" : "cards"}
                  </span>
                  {topic.cardCount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-1.5 w-16 overflow-hidden rounded-full bg-muted/40">
                        <div
                          className="h-full rounded-full bg-current"
                          style={{ width: `${(topic.avgConfidence / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-foreground">
                        {topic.avgConfidence.toFixed(1)}/4
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredTopics.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed border-border bg-muted/10">
              <Brain className="h-8 w-8 text-muted-foreground/60 stroke-[1.5]" />
              <h3 className="mt-3 text-sm font-semibold text-foreground">No topics found</h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                Create courses and topics to populate your personal learning confidence map.
              </p>
            </div>
          )}
        </div>

        {/* Legend / Hover Details Drawer */}
        <div className="flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Hover card display */}
          <div className="min-h-[44px] flex-1 flex items-center gap-3">
            {hoveredTopic ? (
              <div className="flex items-center gap-3 bg-muted/20 border border-border px-4 py-2 rounded-2xl w-full max-w-xl animate-fade-in">
                <Sparkles className="h-4 w-4 text-indigo-500 shrink-0" />
                <div className="text-xs leading-relaxed text-foreground flex-1 flex flex-wrap gap-x-4">
                  <span><strong>{hoveredTopic.title}</strong> average: <strong>{hoveredTopic.avgConfidence.toFixed(1)}/4</strong></span>
                  {hoveredTopic.cardCount > 0 && (
                    <div className="flex gap-3 text-muted-foreground">
                      <span>Again: <strong className="text-rose-500">{hoveredTopic.ratingsBreakdown.again}</strong></span>
                      <span>Hard: <strong className="text-orange-500">{hoveredTopic.ratingsBreakdown.hard}</strong></span>
                      <span>Good: <strong className="text-indigo-500">{hoveredTopic.ratingsBreakdown.good}</strong></span>
                      <span>Easy: <strong className="text-emerald-500">{hoveredTopic.ratingsBreakdown.easy}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-4 w-4 text-muted-foreground/60" />
                <span>Hover over any topic card to view rating statistics breakdown.</span>
              </div>
            )}
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-muted-foreground self-start sm:self-center">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Mastered (3.4+)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Familiar (2.6-3.4)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Learning (1.8-2.6)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Needs Review (&lt;1.8)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40 border border-dashed border-muted-foreground/30" />
              Unreviewed
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
