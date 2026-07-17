"use client";

import {
  Sparkles,
  Brain,
  FileText,
  GraduationCap,
} from "lucide-react";

const actions = [
  {
    title: "Summarize",
    icon: FileText,
  },
  {
    title: "Flashcards",
    icon: Brain,
  },
  {
    title: "Quiz",
    icon: GraduationCap,
  },
  {
    title: "Explain",
    icon: Sparkles,
  },
];

export default function AIToolbar() {
  return (
  <div className="sticky top-8 rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
    <div className="mb-4 flex items-center gap-2">
      <Sparkles className="h-5 w-5 text-indigo-400" />
      <h3 className="font-semibold text-white">
        AI Study Tools
      </h3>
    </div>

    <div className="space-y-3">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <button
            key={action.title}
            className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-indigo-500 hover:bg-indigo-500/10"
          >
            <Icon className="h-5 w-5 text-indigo-400" />
            <span className="font-medium text-white">
              {action.title}
            </span>
          </button>
        );
      })}
    </div>

    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="mb-4 font-semibold text-white">
        Topic Progress
      </h3>

      <div className="space-y-3 text-sm text-slate-300">
        <p>✓ Notes Saved</p>
        <p>📄 Flashcards: 0</p>
        <p>📝 Quiz: Not Generated</p>
      </div>
    </div>
  </div>
);
}