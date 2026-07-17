"use client";

import { Sparkles, Brain, FileText, GraduationCap, Loader2 } from "lucide-react";

interface AIToolbarProps {
  onSummarize: () => void;
  onExplain: () => void;
  onFlashcards: () => void;
  onQuiz: () => void;
  loading: string | null;
}

export default function AIToolbar({
  onSummarize,
  onExplain,
  onFlashcards,
  onQuiz,
  loading,
}: AIToolbarProps) {
  const actions = [
    {
      id: "summarize",
      title: "Summarize",
      icon: FileText,
      handler: onSummarize,
    },
    {
      id: "flashcards",
      title: "Flashcards",
      icon: Brain,
      handler: onFlashcards,
    },
    {
      id: "quiz",
      title: "Quiz",
      icon: GraduationCap,
      handler: onQuiz,
    },
    {
      id: "explain",
      title: "Explain",
      icon: Sparkles,
      handler: onExplain,
    },
  ];

  return (
    <div className="sticky top-8 rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-indigo-400" />
        <h3 className="font-semibold text-white">AI Study Tools</h3>
      </div>

      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          const isCurrentLoading = loading === action.id;

          return (
            <button
              key={action.id}
              onClick={action.handler}
              disabled={loading !== null}
              className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-indigo-500 hover:bg-indigo-500/10 disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                <Icon className="h-5 w-5 text-indigo-400" />
                <span className="font-medium text-white">{action.title}</span>
              </div>
              {isCurrentLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="mb-4 font-semibold text-white">Topic Progress</h3>

        <div className="space-y-3 text-sm text-slate-300">
          <p>✓ Notes Saved</p>
          <p>📄 Flashcards: Auto-save Enabled</p>
          <p>📝 Quiz: Ready to Test</p>
        </div>
      </div>
    </div>
  );
}