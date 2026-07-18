"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCw, CheckCircle, Award, Calendar, Flame, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface Card {
  id: string;
  front: string;
  back: string;
}

interface FlashcardReviewSessionProps {
  deckTitle: string;
  courseTitle: string;
  courseColor: string;
  cards: Card[];
}

export default function FlashcardReviewSession({
  deckTitle,
  courseTitle,
  courseColor,
  cards,
}: FlashcardReviewSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const [sessionCompleted, setSessionCompleted] = useState(false);

  if (cards.length === 0) {
    return (
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/50 p-8 text-center backdrop-blur-xl space-y-4">
        <AlertCircle className="mx-auto h-12 w-12 text-slate-500" />
        <h3 className="text-xl font-bold text-white">No Cards Found</h3>
        <p className="text-sm text-slate-400">
          This deck has no cards. Go to a topic workspace to generate some flashcards with AI.
        </p>
        <Link
          href="/dashboard/study"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Study Hub
        </Link>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  const handleRate = (rating: string) => {
    setRatings((prev) => ({ ...prev, [currentCard.id]: rating }));
    setIsFlipped(false);
    
    // Timeout to let the flip animation return before showing the next card content
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setSessionCompleted(true);
      }
    }, 150);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
      }, 150);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 150);
    }
  };

  const getRatingCount = (rating: string) => {
    return Object.values(ratings).filter((r) => r === rating).length;
  };

  return (
    <div className="w-full max-w-lg space-y-6">
      {/* Session progress and back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/study"
          className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Hub
        </Link>
      </div>

      {!sessionCompleted ? (
        <>
          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            />
          </div>

          {/* Header Info */}
          <div>
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: courseColor }}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {courseTitle}
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-bold text-white truncate">{deckTitle}</h2>
          </div>

          {/* 3D Flip Card Container */}
          <div
            className="group relative h-80 w-full cursor-pointer"
            style={{ perspective: "1000px" }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* The actual Card flipping node */}
            <div
              className="relative h-full w-full transition-all duration-500 ease-out"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "none",
              }}
            >
              {/* CARD FRONT FACE */}
              <div
                className="absolute inset-0 flex flex-col justify-between p-8 rounded-3xl border border-white/10 bg-[#0c0f17]/95 shadow-2xl backdrop-blur-xl"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                  Question / Term
                </div>
                <div className="flex-1 flex items-center justify-center text-center">
                  <p className="text-xl md:text-2xl font-bold leading-relaxed text-white">
                    {currentCard.front}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                  <RotateCw className="h-3.5 w-3.5 animate-pulse" />
                  Click Card to Reveal Answer
                </div>
              </div>

              {/* CARD BACK FACE (Rotated 180 degrees initially) */}
              <div
                className="absolute inset-0 flex flex-col justify-between p-8 rounded-3xl border border-white/10 bg-[#0c0f17]/95 shadow-2xl backdrop-blur-xl"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                  Answer / Explanation
                </div>
                <div className="flex-1 flex items-center justify-center text-center overflow-y-auto no-scrollbar py-2">
                  <p className="text-lg md:text-xl font-medium leading-relaxed text-slate-200">
                    {currentCard.back}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                  <RotateCw className="h-3.5 w-3.5" />
                  Click to See Question Again
                </div>
              </div>
            </div>
          </div>

          {/* Manual navigation controls */}
          <div className="flex items-center justify-between gap-4 mt-2 mb-4 bg-slate-900/30 p-2.5 rounded-2xl border border-white/5">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Card {currentIndex + 1} of {cards.length}
            </span>
            
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Rating controls - only fully active when card is flipped */}
          <div className="space-y-3">
            {isFlipped ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <button
                  type="button"
                  onClick={() => handleRate("again")}
                  className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/5 py-3 cursor-pointer transition hover:bg-rose-500/20 text-rose-400 hover:text-white"
                >
                  <span className="text-sm font-bold">Again</span>
                  <span className="text-[9px] mt-0.5 opacity-70">&lt;1m</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRate("hard")}
                  className="flex flex-col items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/5 py-3 cursor-pointer transition hover:bg-orange-500/20 text-orange-400 hover:text-white"
                >
                  <span className="text-sm font-bold">Hard</span>
                  <span className="text-[9px] mt-0.5 opacity-70">10m</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRate("good")}
                  className="flex flex-col items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/5 py-3 cursor-pointer transition hover:bg-indigo-500/20 text-indigo-400 hover:text-white"
                >
                  <span className="text-sm font-bold">Good</span>
                  <span className="text-[9px] mt-0.5 opacity-70">1d</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRate("easy")}
                  className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/5 py-3 cursor-pointer transition hover:bg-emerald-500/20 text-emerald-400 hover:text-white"
                >
                  <span className="text-sm font-bold">Easy</span>
                  <span className="text-[9px] mt-0.5 opacity-70">3d</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsFlipped(true)}
                className="w-full rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white cursor-pointer transition hover:bg-indigo-500 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <RotateCw className="h-4 w-4" />
                Flip to Reveal Answer
              </button>
            )}
          </div>
        </>
      ) : (
        /* Completion Panel */
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center backdrop-blur-xl space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 shadow-lg text-white">
            <Award className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Session Completed!</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Fantastic job. You completed the review session for <strong>{deckTitle}</strong>.
            </p>
          </div>

          {/* Stats recap grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Reviewed</p>
              <h3 className="text-2xl font-black text-white mt-1">{cards.length} Cards</h3>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Spaced Mastery</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-1">
                {Math.round(((getRatingCount("good") + getRatingCount("easy")) / cards.length) * 100)}%
              </h3>
            </div>
          </div>

          {/* Detailed breakdown */}
          <div className="rounded-2xl border border-white/5 bg-slate-950/20 p-4 space-y-2 text-left text-xs">
            <h4 className="font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-white/5">Breakdown</h4>
            <div className="flex justify-between text-rose-400">
              <span>Again (Forgotten / Forgot)</span>
              <span>{getRatingCount("again")}</span>
            </div>
            <div className="flex justify-between text-orange-400">
              <span>Hard (Requires Practice)</span>
              <span>{getRatingCount("hard")}</span>
            </div>
            <div className="flex justify-between text-indigo-400">
              <span>Good (Recalled)</span>
              <span>{getRatingCount("good")}</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span>Easy (Instantly Recalled)</span>
              <span>{getRatingCount("easy")}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setIsFlipped(false);
                setRatings({});
                setSessionCompleted(false);
              }}
              className="flex-1 cursor-pointer rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              Restart
            </button>
            <Link
              href="/dashboard/study"
              className="flex-1 cursor-pointer rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition text-center"
            >
              Finish
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
