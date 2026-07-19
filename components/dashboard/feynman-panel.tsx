"use client";

import { useState } from "react";
import { Mic, Brain, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { evaluateFeynmanExplanation } from "@/app/dashboard/topics/exam-actions";

interface FeynmanPanelProps {
  topicTitle: string;
}

export default function FeynmanPanel({ topicTitle }: FeynmanPanelProps) {
  const [explanation, setExplanation] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleEvaluate = async () => {
    if (!explanation.trim()) return;
    setEvaluating(true);
    setResult(null);

    try {
      const res = await evaluateFeynmanExplanation(topicTitle, explanation.trim());
      if (res.success && res.evaluation) {
        setResult(res.evaluation);
      }
    } catch (err) {
      console.error("Feynman evaluation failed:", err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-indigo-500" />
          <h3 className="text-sm font-bold text-foreground">Feynman Technique Tutor</h3>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Explain <strong>{topicTitle}</strong> in your own words as if teaching a beginner. The AI will evaluate logic gaps and missing analogies.
        </p>

        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explain this concept simply..."
          className="w-full h-28 rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:border-indigo-500 focus:outline-none resize-none"
        />

        <button
          onClick={handleEvaluate}
          disabled={evaluating || !explanation.trim()}
          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-bold text-white transition disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
        >
          {evaluating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Evaluate My Explanation
        </button>
      </div>

      {result && (
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 space-y-2 animate-fade-in text-xs">
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-300 font-bold">
            <CheckCircle2 className="h-4 w-4" />
            <span>AI Tutor Feedback</span>
          </div>
          <p className="text-muted-foreground leading-relaxed pt-1">
            {result}
          </p>
        </div>
      )}
    </div>
  );
}
