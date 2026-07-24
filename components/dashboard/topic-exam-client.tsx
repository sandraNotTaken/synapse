"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Award, CheckCircle2, XCircle, Sparkles, HelpCircle, Loader2, RefreshCw, ChevronLeft, ChevronRight, Timer, AlertCircle } from "lucide-react";
import { generatePracticeExam, submitPracticeExam } from "@/app/dashboard/topics/exam-actions";

interface TopicExamClientProps {
  topicId: string;
  topicTitle: string;
  courseTitle: string;
  courseColor: string;
}

export default function TopicExamClient({
  topicId,
  topicTitle,
  courseTitle,
  courseColor,
}: TopicExamClientProps) {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  // Dynamic question count state (1 to 50)
  const [questionCount, setQuestionCount] = useState(5);

  // Exam timer states
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    if (questions.length > 0 && !submitted) {
      const interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [questions, submitted]);

  const handleStartExam = async () => {
    setLoading(true);
    setSubmitted(false);
    setSelectedAnswers({});
    setScore(null);
    setActiveIdx(0);
    setSecondsElapsed(0);
    try {
      const res = await generatePracticeExam(topicId, questionCount);
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

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      {/* Top Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          href={`/dashboard/topics/${topicId}`}
          className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Workspace
        </Link>

        {questions.length > 0 && !submitted && (
          <div className="flex items-center gap-2 rounded-full bg-indigo-500/10 px-3.5 py-1.5 text-xs font-bold text-indigo-500 border border-indigo-500/20">
            <Timer className="h-4 w-4" />
            <span>Time Elapsed: {formatTime(secondsElapsed)}</span>
          </div>
        )}
      </div>

      {questions.length === 0 ? (
        /* START EXAM LANDING PANEL */
        <div className="rounded-3xl border border-border bg-card/40 p-12 text-center space-y-6 backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-lg">
            <Sparkles className="h-8 w-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: courseColor }}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {courseTitle}
              </span>
            </div>
            <h1 className="text-3xl font-black text-foreground">{topicTitle} Practice Exam</h1>
            <p className="text-sm text-muted-foreground leading-relaxed pt-1">
              Test your mastery of this topic. We will analyze your notes and formulate a customized practice exam designed to challenge your understanding.
            </p>
          </div>

          {/* Interactive Question Count Slider Selector */}
          <div className="max-w-sm mx-auto p-5 rounded-2xl bg-card border border-border space-y-4">
            <div className="space-y-2 text-left">
              <label htmlFor="question-count-slider" className="text-xs font-bold uppercase tracking-wider text-muted-foreground block text-center">
                Configure Questions: <span className="text-indigo-500 font-black text-sm">{questionCount}</span>
              </label>
              <input
                id="question-count-slider"
                type="range"
                min="1"
                max="50"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-bold px-1">
                <span>1 Q</span>
                <span>10 Q</span>
                <span>20 Q</span>
                <span>30 Q</span>
                <span>40 Q</span>
                <span>50 Q</span>
              </div>
            </div>

            <div className="border-t border-border/40 pt-3 text-xs text-left space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-muted-foreground">Exam Format:</span>
                <span className="font-bold text-foreground">Multiple Choice (MCQ)</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-muted-foreground">XP Reward:</span>
                <span className="font-bold text-emerald-500">+50 XP Level Points</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartExam}
            disabled={loading}
            className="w-full max-w-sm rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-4 text-sm font-bold text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 active:scale-[0.99] mx-auto"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            Generate custom AI Exam ({questionCount} Qs)
          </button>
        </div>
      ) : (
        /* LIVE EXAM PANEL & GRADING RESULTS */
        <div className="space-y-6">
          {/* Header titles */}
          <div>
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: courseColor }}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {courseTitle} ➔ {topicTitle}
              </span>
            </div>
            <h1 className="mt-1 text-3xl font-black text-foreground">AI Practice Exam</h1>
          </div>

          {!submitted ? (
            /* ACTIVE EXAM INTERFACE */
            <div className="grid lg:grid-cols-12 gap-6 items-start">
              {/* Question list Navigation Sidebar */}
              <div className="lg:col-span-4 rounded-2xl border border-border bg-card/40 p-4 space-y-4 backdrop-blur-xl max-h-[80vh] overflow-y-auto no-scrollbar shadow-lg">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                  Questions Overview
                </h3>
                <div className="grid grid-cols-4 gap-2 lg:grid-cols-3">
                  {questions.map((q, idx) => {
                    const answered = !!selectedAnswers[q.id];
                    const active = activeIdx === idx;

                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveIdx(idx)}
                        aria-label={`Question ${idx + 1}: ${answered ? "Answered" : "Unanswered"}${active ? ", currently active" : ""}`}
                        className={`py-3.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer ${
                          active
                            ? "border-indigo-500 bg-indigo-500/10 text-indigo-500"
                            : answered
                            ? "border-border bg-card text-foreground"
                            : "border-border bg-muted/20 text-muted-foreground"
                        }`}
                      >
                        <span>Q{idx + 1}</span>
                        <span className="text-[8px] font-medium mt-0.5 opacity-80">
                          {answered ? "Done" : "Empty"}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleSubmitExam}
                  disabled={submitting || Object.keys(selectedAnswers).length < questions.length}
                  className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-xs font-bold text-white transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />}
                  Submit & Grade Exam
                </button>
              </div>

              {/* Active Question Focus Display Area */}
              <div className="lg:col-span-8 space-y-6">
                <div className="rounded-3xl border border-border bg-card/85 p-8 shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                      Active Question
                    </span>
                    <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-bold text-indigo-500">
                      Question {activeIdx + 1} of {questions.length}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-foreground leading-relaxed">
                    {questions[activeIdx].question}
                  </h3>

                  <div className="space-y-3 pt-2">
                    {questions[activeIdx].options.map((opt: string, optIdx: number) => {
                      const isSelected = selectedAnswers[questions[activeIdx].id] === opt;

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleOptionSelect(questions[activeIdx].id, opt)}
                          className={`w-full text-left rounded-2xl border p-4.5 text-sm font-semibold transition cursor-pointer ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-white"
                              : "border-border bg-card text-muted-foreground hover:border-indigo-500/30 hover:bg-muted"
                          }`}
                        >
                          <span className="inline-block w-6 text-indigo-500 font-bold">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Next/Prev Navigation toolbar */}
                <div className="flex items-center justify-between">
                  <button
                    disabled={activeIdx === 0}
                    onClick={() => setActiveIdx((prev) => prev - 1)}
                    className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-muted-foreground transition hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous Question
                  </button>

                  <button
                    disabled={activeIdx === questions.length - 1}
                    onClick={() => setActiveIdx((prev) => prev + 1)}
                    className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-muted-foreground transition hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Next Question
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* COMPLETED EXAM REPORT & BREAKDOWN */
            <div className="space-y-6 animate-fade-in">
              {/* Graded Summary Header */}
              <div className="rounded-3xl border border-border bg-card/60 p-8 text-center space-y-6 backdrop-blur-xl shadow-lg">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 shadow-lg text-white">
                  <Award className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-foreground">Exam Graded!</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You scored <strong className="text-indigo-500 text-lg font-bold">{score}%</strong> on this revision track.
                  </p>
                </div>

                <div className="max-w-md mx-auto p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-center font-semibold text-emerald-600 dark:text-emerald-400">
                  {score && score >= 80
                    ? "🎉 Masterful performance! +50 XP added to your levels account."
                    : "👍 Good revisions! +50 XP rewarded. Check question rationales below to strengthen missed concepts."}
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleStartExam}
                    className="rounded-xl border border-border bg-card px-5 py-3 text-xs font-bold text-muted-foreground hover:bg-muted transition cursor-pointer"
                  >
                    Retake Practice Exam
                  </button>

                  <Link
                    href={`/dashboard/topics/${topicId}`}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-3 text-xs font-bold text-white transition text-center shadow-md shadow-indigo-600/10 cursor-pointer"
                  >
                    Back to Workspace
                  </Link>
                </div>
              </div>

              {/* Complete Question Breakdown List */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                  Question Breakdown & Explanations
                </h3>

                <div className="space-y-4">
                  {questions.map((q, idx) => {
                    const selected = selectedAnswers[q.id];
                    const isCorrect = selected === q.answer;

                    return (
                      <div
                        key={q.id || idx}
                        className={`rounded-2xl border p-6 space-y-4 transition ${
                          isCorrect
                            ? "border-emerald-500/20 bg-emerald-500/[0.02]"
                            : "border-rose-500/20 bg-rose-500/[0.02]"
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-border/40 pb-2">
                          <span className="font-bold text-foreground text-sm">
                            Question {idx + 1}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border ${
                              isCorrect
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                            }`}
                          >
                            {isCorrect ? "Correct" : "Incorrect"}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-foreground leading-relaxed">
                          {q.question}
                        </h4>

                        <div className="grid md:grid-cols-2 gap-2">
                          {q.options.map((opt: string, optIdx: number) => {
                            const wasSelected = selected === opt;
                            const isAnswer = opt === q.answer;

                            return (
                              <div
                                key={optIdx}
                                className={`rounded-xl border p-3 text-xs flex items-center justify-between leading-relaxed ${
                                  isAnswer
                                    ? "border-emerald-500 bg-emerald-500/10 font-bold text-emerald-600 dark:text-emerald-300"
                                    : wasSelected
                                    ? "border-rose-500 bg-rose-500/10 font-bold text-rose-600 dark:text-rose-300"
                                    : "border-border bg-card/30 opacity-70"
                                }`}
                              >
                                <span>{opt}</span>
                                {isAnswer && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
                                {wasSelected && !isAnswer && <XCircle className="h-4 w-4 text-rose-500 shrink-0" />}
                              </div>
                            );
                          })}
                        </div>

                        {q.explanation && (
                          <div className="rounded-xl bg-indigo-500/[0.03] border border-indigo-500/10 p-3.5 text-xs text-muted-foreground italic leading-relaxed">
                            <strong className="text-foreground block not-italic mb-1 font-bold">
                              AI tutor explanation:
                            </strong>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
