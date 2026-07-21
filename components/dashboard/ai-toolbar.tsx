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
    <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
          <h3 className="font-bold text-sm text-foreground">AI Study Tools</h3>
        </div>
      </div>

      {/* Configuration Settings */}
      <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 space-y-3">
        <div className="flex items-center gap-1.5 border-b border-border/50 pb-2">
          <Settings className="h-3 w-3 text-indigo-500 dark:text-indigo-400" />
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Generation Parameters
          </h4>
        </div>

        {/* Difficulty */}
        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
            Difficulty Level
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full rounded-lg border border-border bg-card p-2 text-xs text-foreground focus:border-indigo-500 focus:outline-none cursor-pointer transition hover:bg-muted"
          >
            <option value="easy">Easy (Definitions & Recall)</option>
            <option value="intermediate">Intermediate (Applications)</option>
            <option value="hard">Hard (Advanced Reasoning)</option>
          </select>
        </div>

        {/* Counts */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              Flashcard Count
            </label>
            <select
              value={flashcardCount}
              onChange={(e) => setFlashcardCount(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-card p-2 text-xs text-foreground focus:border-indigo-500 focus:outline-none cursor-pointer transition hover:bg-muted"
            >
              <option value="5">5 Cards</option>
              <option value="10">10 Cards</option>
              <option value="15">15 Cards</option>
              <option value="20">20 Cards</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              Quiz Questions
            </label>
            <select
              value={quizCount}
              onChange={(e) => setQuizCount(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-card p-2 text-xs text-foreground focus:border-indigo-500 focus:outline-none cursor-pointer transition hover:bg-muted"
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
      <div className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;
          const isCurrentLoading = loading === action.id;

          return (
            <button
              key={action.id}
              onClick={action.handler}
              disabled={loading !== null}
              className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-border/80 bg-card/40 p-3 text-left transition hover:border-indigo-500 hover:bg-indigo-500/10 disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-500/10 p-1.5 text-indigo-500 dark:text-indigo-400">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-bold text-foreground block text-xs">
                    {action.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5 leading-none">
                    {action.description}
                  </span>
                </div>
              </div>
              {isCurrentLoading && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500 dark:text-indigo-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}