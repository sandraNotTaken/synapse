"use client";

import { useState } from "react";
import { Award, CheckCircle, XCircle, Sparkles, HelpCircle, Loader2, RefreshCw } from "lucide-react";
import { generatePracticeExam, submitPracticeExam } from "@/app/dashboard/topics/exam-actions";

interface ExamPanelProps {
  topicId: string;
}

export default function ExamPanel({ topicId }: ExamPanelProps) {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleStartExam = async () => {
    setLoading(true);
    setSubmitted(false);
    setSelectedAnswers({});
    setScore(null);
    try {
      const res = await generatePracticeExam(topicId);
      if (res.success && res.questions) {
        setQuestions(res.questions);
      }
    } catch (err) {
      console.error("Failed to load exam:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qId: number, option: string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleSubmitExam = async () => {
    if (questions.length === 0) return;
    setSubmitting(true);

    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.answer) {
        correctCount += 1;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);

    try {
      await submitPracticeExam(topicId, finalScore, JSON.stringify({ questions, selectedAnswers }));
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit exam:", err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-indigo-500" />
          <h3 className="text-sm font-bold text-foreground">AI Practice Exam</h3>
        </div>
        {questions.length > 0 && (
          <button
            onClick={handleStartExam}
            disabled={loading}
            className="flex items-center gap-1 text-[11px] font-semibold text-indigo-500 hover:text-indigo-400 transition cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            New Exam
          </button>
        )}
      </div>

      {questions.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card/60 p-6 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Test Your Knowledge</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Generate an AI mock exam based on your topic notes to test recall and earn <strong>+50 XP</strong>.
            </p>
          </div>
          <button
            onClick={handleStartExam}
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-bold text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate Practice Exam
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Questions list */}
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
            {questions.map((q, idx) => {
              const isSelected = !!selectedAnswers[q.id];
              const isCorrect = selectedAnswers[q.id] === q.answer;

              return (
                <div
                  key={q.id || idx}
                  className={`rounded-2xl border p-4 space-y-3 transition ${
                    submitted
                      ? isCorrect
                        ? "border-emerald-500/30 bg-emerald-500/[0.03]"
                        : "border-rose-500/30 bg-rose-500/[0.03]"
                      : "border-border bg-card/40"
                  }`}
                >
                  <h4 className="text-xs font-bold text-foreground">
                    {idx + 1}. {q.question}
                  </h4>

                  <div className="space-y-1.5">
                    {q.options.map((opt: string, optIdx: number) => {
                      const selected = selectedAnswers[q.id] === opt;
                      const isTargetCorrect = opt === q.answer;

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={submitted}
                          onClick={() => handleOptionSelect(q.id, opt)}
                          className={`flex w-full items-center justify-between rounded-xl border p-2.5 text-xs text-left transition cursor-pointer ${
                            submitted
                              ? isTargetCorrect
                                ? "border-emerald-500 bg-emerald-500/10 font-bold text-emerald-600 dark:text-emerald-300"
                                : selected
                                ? "border-rose-500 bg-rose-500/10 font-bold text-rose-600 dark:text-rose-300"
                                : "border-border/40 opacity-50"
                              : selected
                              ? "border-indigo-500 bg-indigo-500/10 font-semibold text-indigo-600 dark:text-indigo-300"
                              : "border-border hover:bg-muted/50 text-muted-foreground"
                          }`}
                        >
                          <span>{opt}</span>
                          {submitted && isTargetCorrect && <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />}
                          {submitted && selected && !isTargetCorrect && <XCircle className="h-4 w-4 text-rose-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && q.explanation && (
                    <div className="rounded-xl bg-card p-2.5 border border-border text-[11px] text-muted-foreground">
                      <span className="font-bold text-foreground block">Explanation:</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submission bar */}
          {!submitted ? (
            <button
              onClick={handleSubmitExam}
              disabled={submitting || Object.keys(selectedAnswers).length < questions.length}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-xs font-bold text-white transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />}
              Submit Exam & Grade
            </button>
          ) : (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center space-y-2 animate-fade-in">
              <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Award className="h-5 w-5" />
                <span className="text-base font-black">Score: {score}%</span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                +50 XP Earned! Great effort reviewing concepts.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
