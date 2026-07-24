"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCw, Award, Calendar, Flame, AlertCircle, ChevronLeft, ChevronRight, WifiOff, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { logStudySession, updateCardConfidence } from "@/app/dashboard/study/actions";
import { useOffline } from "@/components/providers/offline-provider";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

interface Card {
  id: string;
  front: string;
  back: string;
  explanation?: string | null;
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
  const [ratings, setRatings] = useState<Record<string, "again" | "hard" | "good" | "easy" | "skipped">>({});
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const { isOffline, queueCardConfidence, queueStudySession } = useOffline();

  useKeyboardShortcuts(
    {
      space: () => {
        if (!sessionCompleted) {
          setIsFlipped((prev) => !prev);
        }
      },
      enter: () => {
        if (!sessionCompleted) {
          setIsFlipped((prev) => !prev);
        }
      },
      "1": () => {
        if (!sessionCompleted && isFlipped) {
          handleRate("again");
        }
      },
      "2": () => {
        if (!sessionCompleted && isFlipped) {
          handleRate("hard");
        }
      },
      "3": () => {
        if (!sessionCompleted && isFlipped) {
          handleRate("good");
        }
      },
      "4": () => {
        if (!sessionCompleted && isFlipped) {
          handleRate("easy");
        }
      },
      arrowleft: () => {
        if (!sessionCompleted) {
          handlePrev();
        }
      },
      arrowright: () => {
        if (!sessionCompleted) {
          if (isFlipped) {
            handleNext();
          } else {
            setIsFlipped(true);
          }
        }
      },
    },
    [sessionCompleted, isFlipped, currentIndex, cards]
  );

  if (cards.length === 0) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-border bg-card/50 p-8 text-center backdrop-blur-xl space-y-4">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="text-xl font-bold text-foreground">No Cards Found</h3>
        <p className="text-sm text-muted-foreground">
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

  const handleRate = async (rating: "again" | "hard" | "good" | "easy" | "skipped") => {
    if (rating !== "skipped") {
      if (isOffline) {
        queueCardConfidence(currentCard.id, rating);
      } else {
        try {
          await updateCardConfidence(currentCard.id, rating);
        } catch (err) {
          console.error("Failed to update confidence:", err);
        }
      }
    }

    setRatings((prev) => ({ ...prev, [currentCard.id]: rating }));
    setIsFlipped(false);

    // Timeout to let the flip animation finish before loading next card
    setTimeout(async () => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        await completeSession();
      }
    }, 150);
  };

  const completeSession = async () => {
    const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    if (isOffline) {
      queueStudySession(Math.max(1, elapsedSeconds));
    } else {
      try {
        await logStudySession(Math.max(1, elapsedSeconds));
      } catch (err) {
        console.error("Failed to log study session:", err);
      }
    }
    setSessionCompleted(true);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
      }, 150);
    }
  };

  const handleNext = async () => {
    // If moving next without rating, count it as skipped
    if (!ratings[currentCard.id]) {
      setRatings((prev) => ({ ...prev, [currentCard.id]: "skipped" }));
    }

    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 150);
    } else {
      await completeSession();
    }
  };

  // Score aggregations
  const rightCount = cards.filter(
    (c) => ratings[c.id] === "good" || ratings[c.id] === "easy"
  ).length;

  const failedCount = cards.filter(
    (c) => ratings[c.id] === "again" || ratings[c.id] === "hard"
  ).length;

  const skippedCount = cards.filter(
    (c) => ratings[c.id] === "skipped" || !ratings[c.id]
  ).length;

  return (
    <div className="w-full max-w-lg space-y-6">
      {/* Session progress and back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/study"
          className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Hub
        </Link>
        {isOffline && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-500 border border-rose-500/30 animate-pulse">
            <WifiOff className="h-3.5 w-3.5" />
            Offline Mode
          </span>
        )}
      </div>

      {!sessionCompleted ? (
        <>
          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
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
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {courseTitle}
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-bold text-foreground truncate">{deckTitle}</h2>
          </div>

          {/* 3D Flip Card Container */}
          <div
            className="group relative min-h-[440px] w-full cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            style={{ perspective: "1000px" }}
            onClick={() => setIsFlipped(!isFlipped)}
            tabIndex={0}
            role="button"
            aria-label={`Flashcard: ${currentCard.front}. Click or press space to flip and reveal answer.`}
            aria-live="polite"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsFlipped(!isFlipped);
              }
            }}
          >
            {/* The actual Card flipping node */}
            <div
              className="relative min-h-[440px] w-full transition-all duration-500 ease-out"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "none",
              }}
            >
              {/* CARD FRONT FACE */}
              <div
                className="absolute inset-0 flex flex-col justify-between p-8 sm:p-10 rounded-2xl border border-border bg-card/90 shadow-2xl backdrop-blur-xl"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                    Question / Term
                  </span>
                  <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-bold text-indigo-500">
                    Card {currentIndex + 1} of {cards.length}
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center text-center px-4 py-6">
                  <p className="text-xl sm:text-2xl font-bold leading-relaxed text-foreground max-w-2xl">
                    {currentCard.front}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-semibold pt-3 border-t border-border/40">
                  <RotateCw className="h-3.5 w-3.5 animate-pulse text-indigo-500" />
                  <span>Click Card or press <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded">Space</kbd> to reveal answer</span>
                </div>
              </div>

              {/* CARD BACK FACE (Rotated 180 degrees initially) */}
              <div
                className="absolute inset-0 flex flex-col justify-between p-8 sm:p-10 rounded-2xl border border-border bg-card/90 shadow-2xl backdrop-blur-xl"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-500">
                    Answer / Explanation
                  </span>
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-[11px] font-bold text-cyan-500">
                    Card {currentIndex + 1} of {cards.length}
                  </span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center overflow-y-auto no-scrollbar px-4 py-6">
                  <p className="text-lg sm:text-xl font-medium leading-relaxed text-foreground max-w-2xl">
                    {currentCard.back}
                  </p>
                  {currentCard.explanation && (
                    <div className="mt-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-muted-foreground text-left max-w-xl">
                      <span className="font-bold text-indigo-500 block mb-1">AI Explanation:</span>
                      {currentCard.explanation}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-semibold pt-3 border-t border-border/40">
                  <RotateCw className="h-3.5 w-3.5 text-cyan-500" />
                  <span>Rate your recall below to set next review interval</span>
                </div>
              </div>
            </div>
          </div>

          {/* Manual navigation controls */}
          <div className="flex items-center justify-between gap-4 mt-2 mb-4 bg-muted/35 p-2.5 rounded-2xl border border-border">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Card {currentIndex + 1} of {cards.length}
            </span>
            
            <button
              type="button"
              onClick={handleNext}
              className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <span>{currentIndex === cards.length - 1 ? "Finish" : "Next"}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Rating controls - only active when card is flipped */}
          <div className="space-y-3">
            {isFlipped ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <button
                    type="button"
                    onClick={() => handleRate("again")}
                    className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/5 py-3 cursor-pointer transition hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 dark:hover:text-white"
                  >
                    <span className="text-sm font-bold">Again</span>
                    <span className="text-[9px] mt-0.5 opacity-70">&lt;1m</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRate("hard")}
                    className="flex flex-col items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/5 py-3 cursor-pointer transition hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 dark:hover:text-white"
                  >
                    <span className="text-sm font-bold">Hard</span>
                    <span className="text-[9px] mt-0.5 opacity-70">10m</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRate("good")}
                    className="flex flex-col items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/5 py-3 cursor-pointer transition hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 dark:hover:text-white"
                  >
                    <span className="text-sm font-bold">Good</span>
                    <span className="text-[9px] mt-0.5 opacity-70">1d</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRate("easy")}
                    className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/5 py-3 cursor-pointer transition hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 dark:hover:text-white"
                  >
                    <span className="text-sm font-bold">Easy</span>
                    <span className="text-[9px] mt-0.5 opacity-70">3d</span>
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={() => handleRate("skipped")}
                  className="w-full rounded-2xl border border-border bg-card py-3 text-xs font-bold text-muted-foreground transition hover:bg-muted"
                >
                  Skip / Leave Unanswered
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsFlipped(true)}
                  className="flex-1 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white cursor-pointer transition hover:bg-indigo-500 active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <RotateCw className="h-4 w-4" />
                  Flip to Reveal Answer
                </button>
                <button
                  type="button"
                  onClick={() => handleRate("skipped")}
                  className="rounded-2xl border border-border bg-card px-5 py-4 text-sm font-bold text-muted-foreground transition hover:bg-muted"
                >
                  Skip
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Completion Panel with skips included */
        <div className="rounded-2xl border border-border bg-card/60 p-6 text-center backdrop-blur-xl space-y-6 shadow-xl max-h-[85vh] overflow-y-auto no-scrollbar">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 shadow-lg text-white">
            <Award className="h-7 w-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-foreground">Session Completed!</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Review completed for <strong>{deckTitle}</strong>. Here is your scorecard.
            </p>
          </div>

          {/* Twitter Analytics Style Pass/Fail/Skip Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Right</span>
              <h4 className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{rightCount}</h4>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-center">
              <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">Failed</span>
              <h4 className="text-lg font-black text-rose-600 dark:text-rose-400 mt-0.5">{failedCount}</h4>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-center">
              <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Skipped</span>
              <h4 className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">{skippedCount}</h4>
            </div>
          </div>

          {/* Card-by-Card Detailed Result breakdown with explanation for ALL */}
          <div className="space-y-3 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
              Review Breakdown & Explanations
            </h3>

            <div className="space-y-3">
              {cards.map((card, idx) => {
                const rating = ratings[card.id];
                const isRight = rating === "good" || rating === "easy";
                const isFail = rating === "again" || rating === "hard";
                const isSkipped = rating === "skipped" || !rating;

                return (
                  <div
                    key={card.id || idx}
                    className={`rounded-xl border p-4 space-y-2.5 text-xs transition duration-200 ${
                      isRight
                        ? "border-emerald-500/20 bg-emerald-500/[0.02]"
                        : isFail
                        ? "border-rose-500/20 bg-rose-500/[0.02]"
                        : "border-amber-500/20 bg-amber-500/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <span className="font-bold text-foreground">Card #{idx + 1}</span>
                      
                      {isRight && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Right</span>
                        </span>
                      )}
                      
                      {isFail && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          <XCircle className="h-3 w-3" />
                          <span>Failed</span>
                        </span>
                      )}
                      
                      {isSkipped && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Skipped</span>
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="font-bold text-foreground">Question:</p>
                      <p className="text-muted-foreground bg-muted/20 p-2.5 rounded-lg border border-border/40 leading-relaxed font-medium">
                        {card.front}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="font-bold text-indigo-500">Answer:</p>
                      <p className="text-muted-foreground bg-muted/20 p-2.5 rounded-lg border border-border/40 leading-relaxed font-medium">
                        {card.back}
                      </p>
                    </div>

                    {/* Explanation display for all cards */}
                    <div className="space-y-1">
                      <p className="font-bold text-cyan-600 dark:text-cyan-400">Explanation & Rationale:</p>
                      <p className="text-muted-foreground bg-indigo-500/[0.03] p-2.5 rounded-lg border border-indigo-500/10 leading-relaxed font-medium italic">
                        {card.explanation || card.back || "Concept reviewed during study session."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2 border-t border-border/60">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setIsFlipped(false);
                setRatings({});
                setSessionCompleted(false);
              }}
              className="flex-1 cursor-pointer rounded-xl border border-border bg-card py-3 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              Restart Session
            </button>
            <Link
              href="/dashboard/study"
              className="flex-1 cursor-pointer rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white hover:bg-indigo-500 transition text-center"
            >
              Finish
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
