"use client";

import React, { useState } from "react";
import { Calendar, Brain, ArrowRight, Play, CheckCircle2, Info } from "lucide-react";
import Link from "next/link";

interface StudyCalendarProps {
  cards: Array<{
    id: string;
    dueDate: string;
    deck: {
      id: string;
      title: string;
      topic: {
        title: string;
        course: {
          title: string;
          color: string;
        };
      };
    };
  }>;
}

export default function StudyCalendar({ cards }: StudyCalendarProps) {
  const [selectedDayOffset, setSelectedDayOffset] = useState(0);

  // Generate next 14 days forecast data
  const forecastDays = Array.from({ length: 14 }).map((_, offset) => {
    const targetDate = new Date();
    targetDate.setHours(0, 0, 0, 0);
    targetDate.setDate(targetDate.getDate() + offset);

    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // Filter cards due on this specific day
    const dueCards = cards.filter((card) => {
      const cardDate = new Date(card.dueDate);
      return cardDate >= targetDate && cardDate < nextDate;
    });

    // Group due cards by deck
    const deckGroups: Record<string, { id: string; title: string; courseTitle: string; color: string; count: number }> = {};
    dueCards.forEach((card) => {
      const deckId = card.deck.id;
      if (!deckGroups[deckId]) {
        deckGroups[deckId] = {
          id: deckId,
          title: card.deck.title,
          courseTitle: card.deck.topic.course.title,
          color: card.deck.topic.course.color,
          count: 0,
        };
      }
      deckGroups[deckId].count++;
    });

    const dayName = targetDate.toLocaleDateString("en-US", { weekday: "short" });
    const dayLabel = targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    return {
      offset,
      date: targetDate,
      dayName,
      dayLabel,
      totalDue: dueCards.length,
      decks: Object.values(deckGroups),
    };
  });

  const selectedDay = forecastDays[selectedDayOffset];

  return (
    <div className="rounded-3xl border border-indigo-500/10 bg-gradient-to-br from-indigo-500/5 via-card/50 to-purple-500/5 p-6 backdrop-blur-xl space-y-6 shadow-xl">
      {/* Header & Legend */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-500 border border-indigo-500/20">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-1.5">
              14-Day Study Forecast
              <span className="relative group/tooltip inline-flex items-center cursor-help">
                <Info className="h-4 w-4 text-muted-foreground hover:text-indigo-500 transition-colors duration-200" />
                
                {/* Tooltip Content */}
                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 rounded-2xl border border-border bg-card p-4 text-[11px] font-normal leading-relaxed text-muted-foreground shadow-2xl backdrop-blur-xl opacity-0 scale-95 origin-bottom transition-all duration-200 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 z-50">
                  <strong className="text-foreground block mb-1">💡 How it works:</strong>
                  As you review flashcards and rate your memory confidence, Synapse automatically schedules the next study date for each card. The calendar below shows your upcoming review workload. Click any day to view details and start studying cards due on that date.
                  {/* Tooltip Arrow */}
                  <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-card" />
                  <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-border -z-10 translate-y-[1px]" />
                </span>
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              See when your flashcards are due for review so you can plan ahead.
            </p>
          </div>
        </div>

        {/* Color Code Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-muted-foreground bg-muted/40 px-3.5 py-1.5 rounded-xl border border-border/60">
          <span className="uppercase tracking-widest text-[9px] opacity-75">Review Load:</span>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Light (1-5)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Medium (6-15)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>Heavy (16+)</span>
          </div>
        </div>
      </div>

      {/* 14-Day Forecast Grid */}
      <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-7 gap-3">
        {forecastDays.map((day) => {
          const isSelected = day.offset === selectedDayOffset;
          const cardCount = day.totalDue;
          
          // Color coding based on load weight
          const borderStyle = isSelected
            ? "border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/20"
            : cardCount > 15
            ? "border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50"
            : cardCount > 5
            ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50"
            : cardCount > 0
            ? "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50"
            : "border-border bg-card/40 hover:border-muted-foreground/30";

          const countBadgeStyle = cardCount > 15
            ? "bg-rose-500/20 text-rose-500"
            : cardCount > 5
            ? "bg-amber-500/20 text-amber-500"
            : cardCount > 0
            ? "bg-emerald-500/20 text-emerald-500"
            : "bg-muted text-muted-foreground opacity-60";

          return (
            <button
              key={day.offset}
              type="button"
              onClick={() => setSelectedDayOffset(day.offset)}
              className={`flex flex-col items-center justify-between rounded-2xl border p-3.5 text-center transition cursor-pointer active:scale-95 select-none ${borderStyle}`}
            >
              <span className={`text-[9px] font-extrabold uppercase tracking-wider ${isSelected ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-muted-foreground'}`}>
                {day.offset === 0 ? "Today" : day.offset === 1 ? "Tomorrow" : day.dayName}
              </span>
              <span className="text-xs font-black text-foreground mt-1">
                {day.dayLabel.split(" ")[1]}
              </span>
              <span className={`mt-2.5 rounded-lg px-2 py-0.5 text-[10px] font-bold ${countBadgeStyle}`}>
                {cardCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Details Panel */}
      <div className="rounded-2xl border border-border bg-muted/15 p-5 space-y-4">
        <div className="flex items-center justify-between text-xs font-bold border-b border-border/40 pb-3">
          <span className="text-foreground flex items-center gap-1.5">
            <Brain className="h-4 w-4 text-indigo-500 shrink-0" />
            {selectedDayOffset === 0 ? (
              <span>Reviews Due Today</span>
            ) : selectedDayOffset === 1 ? (
              <span>Reviews Due Tomorrow</span>
            ) : (
              <span>Reviews Due in {selectedDayOffset} Days</span>
            )}
            <span className="text-[10px] text-muted-foreground font-medium">
              ({selectedDay.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })})
            </span>
          </span>
          <span className="text-indigo-500 font-extrabold">
            {selectedDay.totalDue} {selectedDay.totalDue === 1 ? "card" : "cards"} due
          </span>
        </div>

        {selectedDay.decks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <CheckCircle2 className="h-8 w-8 text-emerald-500/80 mb-2" />
            <p className="text-xs font-semibold text-foreground">Perfect Memory Stability!</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              No spaced repetition card reviews are scheduled for this date.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {selectedDay.decks.map((deck) => (
              <div
                key={deck.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5 shadow-sm transition hover:border-indigo-500/20"
              >
                <div className="space-y-1 pr-4 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: deck.color }}
                    />
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground truncate">
                      {deck.courseTitle}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground truncate leading-tight">
                    {deck.title}
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    {deck.count} {deck.count === 1 ? "card" : "cards"} due for review
                  </p>
                </div>

                <Link
                  href={`/dashboard/study/review/${deck.id}`}
                  className="rounded-lg bg-indigo-500/10 p-2 text-indigo-500 hover:bg-indigo-600 hover:text-white transition flex items-center justify-center shrink-0"
                  title="Study Deck"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
