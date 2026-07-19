"use client";

import { useState } from "react";
import { Sparkles, Brain, FileText, GraduationCap, Loader2, Settings } from "lucide-react";

interface AIToolbarProps {
  onSummarize: () => void;
  onExplain: () => void;
  onFlashcards: (count: number, difficulty: string) => void;
  onQuiz: (count: number, difficulty: string) => void;
  loading: string | null;
}

export default function AIToolbar({
  onSummarize,
  onExplain,
  onFlashcards,
  onQuiz,
  loading,
}: AIToolbarProps) {
  const [difficulty, setDifficulty] = useState("intermediate");
  const [flashcardCount, setFlashcardCount] = useState(10);
  const [quizCount, setQuizCount] = useState(5);

  const actions = [
    {
      id: "summarize",
      title: "Summarize Notes",
      icon: FileText,
      handler: onSummarize,
      description: "Get key takeaways",
    },
    {
      id: "explain",
      title: "Explain Concepts",
      icon: Sparkles,
      handler: onExplain,
      description: "Analogy-rich breakdown",
    },
    {
      id: "flashcards",
      title: "Generate Flashcards",
      icon: Brain,
      handler: () => onFlashcards(flashcardCount, difficulty),
      description: `Create ${flashcardCount} cards (${difficulty})`,
    },
    {
      id: "quiz",
      title: "Generate Practice Quiz",
      icon: GraduationCap,
      handler: () => onQuiz(quizCount, difficulty),
      description: `Create ${quizCount} questions (${difficulty})`,
    },
  ];

  return (
    <div className="sticky top-8 rounded-3xl border border-border bg-card/60 p-6 backdrop-blur">
      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
          <h3 className="font-semibold text-foreground">AI Study Tools</h3>
        </div>
      </div>

      {/* Configuration Settings */}
      <div className="mb-6 rounded-2xl border border-border bg-muted/30 p-4 space-y-4 shadow-inner">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <Settings className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Generation Parameters
          </h4>
        </div>

        {/* Difficulty */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide">
            Difficulty Level
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full rounded-xl border border-border bg-card p-2.5 text-xs text-foreground focus:border-indigo-500 focus:outline-none cursor-pointer transition hover:bg-muted"
          >
            <option value="easy">Easy (Definitions & Recall)</option>
            <option value="intermediate">Intermediate (Applications)</option>
            <option value="hard">Hard (Advanced Reasoning)</option>
          </select>
        </div>

        {/* Counts */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="space-y-1.5">
            <label className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide">
              Flashcard Count
            </label>
            <select
              value={flashcardCount}
              onChange={(e) => setFlashcardCount(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-card p-2.5 text-xs text-foreground focus:border-indigo-500 focus:outline-none cursor-pointer transition hover:bg-muted"
            >
              <option value="5">5 Cards</option>
              <option value="10">10 Cards</option>
              <option value="15">15 Cards</option>
              <option value="20">20 Cards</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide">
              Quiz Questions
            </label>
            <select
              value={quizCount}
              onChange={(e) => setQuizCount(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-card p-2.5 text-xs text-foreground focus:border-indigo-500 focus:outline-none cursor-pointer transition hover:bg-muted"
            >
              <option value="5">5 Qs</option>
              <option value="10">10 Qs</option>
              <option value="15">15 Qs</option>
              <option value="20">20 Qs</option>
            </select>
          </div>
        </div>
      </div>

      {/* AI Actions */}
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          const isCurrentLoading = loading === action.id;

          return (
            <button
              key={action.id}
              onClick={action.handler}
              disabled={loading !== null}
              className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-border bg-card/40 p-4 text-left transition hover:border-indigo-500 hover:bg-indigo-500/10 disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-500 dark:text-indigo-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-semibold text-foreground block text-sm">
                    {action.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5 leading-none">
                    {action.description}
                  </span>
                </div>
              </div>
              {isCurrentLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500 dark:text-indigo-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}