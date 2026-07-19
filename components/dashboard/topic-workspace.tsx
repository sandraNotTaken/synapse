"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Brain, FileText, GraduationCap, Copy, Check, Loader2, X, AlertTriangle } from "lucide-react";
import TopicEditor from "./topic-editor";
import AIToolbar from "./ai-toolbar";
import { logStudySession } from "@/app/dashboard/study/actions";

interface TopicWorkspaceProps {
  topicId: string;
  initialContent: string;
  topicTitle: string;
  courseId: string;
  courseTitle: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function TopicWorkspace({
  topicId,
  initialContent,
  topicTitle,
  courseId,
  courseTitle,
}: TopicWorkspaceProps) {
  const [content, setContent] = useState(initialContent);

  // Log study session duration periodically while active in workspace
  useEffect(() => {
    let activeSeconds = 0;
    const interval = setInterval(async () => {
      if (document.hasFocus()) {
        activeSeconds += 10;
        if (activeSeconds >= 60) {
          try {
            await logStudySession(60);
            activeSeconds = 0; // reset
          } catch (err) {
            console.error("Failed to log workspace heartbeat session:", err);
          }
        }
      }
    }, 10000); // Check every 10 seconds

    return () => {
      clearInterval(interval);
      if (activeSeconds >= 10) {
        logStudySession(activeSeconds).catch((err) =>
          console.error("Failed to log final workspace session:", err)
        );
      }
    };
  }, []);

  // AI tools states
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Summary Modal state
  const [summary, setSummary] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Tutor Explanation panel state
  const [explanation, setExplanation] = useState<string | null>(null);

  // Flashcards generation state
  const [flashcardSuccess, setFlashcardSuccess] = useState<{
    deckId: string;
    message: string;
  } | null>(null);

  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Action: Summarize Notes
  async function triggerSummarize() {
    setLoadingAction("summarize");
    setErrorMessage(null);
    setSummary(null);
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to summarize.");
      setSummary(data.summary);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoadingAction(null);
    }
  }

  // Action: Tutor Explanation
  async function triggerExplain() {
    setLoadingAction("explain");
    setErrorMessage(null);
    setExplanation(null);
    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate explanation.");
      setExplanation(data.explanation);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoadingAction(null);
    }
  }

  // Action: Generate Flashcards
  async function triggerFlashcards(count: number, difficulty: string) {
    setLoadingAction("flashcards");
    setErrorMessage(null);
    setFlashcardSuccess(null);
    try {
      const res = await fetch("/api/ai/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, topicId, count, difficulty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate flashcards.");
      setFlashcardSuccess({
        deckId: data.deckId,
        message: data.message,
      });
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoadingAction(null);
    }
  }

  // Action: Generate Quiz
  async function triggerQuiz(count: number, difficulty: string) {
    setLoadingAction("quiz");
    setErrorMessage(null);
    setQuizQuestions(null);
    setSelectedAnswers({});
    setShowQuizResults(false);
    setActiveQuestionIndex(0);
    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, count, difficulty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate quiz.");
      setQuizQuestions(data.questions);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoadingAction(null);
    }
  }

  // Append Summary to notes
  function appendSummaryToNotes() {
    if (!summary) return;
    
    // Clean string and convert basic Markdown to HTML
    let cleaned = summary
      .replace(/\\n/g, "\n")
      .replace(/\\"/g, '"')
      .replace(/\\/g, "");
      
    const lines = cleaned.split("\n");
    const htmlLines = lines.map((line) => {
      if (line.startsWith("## ")) {
        return `<h3>${line.replace("## ", "")}</h3>`;
      }
      if (line.startsWith("### ")) {
        return `<h4>${line.replace("### ", "")}</h4>`;
      }
      if (line.startsWith("# ")) {
        return `<h2>${line.replace("# ", "")}</h2>`;
      }
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const bulletContent = line.trim().substring(2).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
        return `<li>${bulletContent}</li>`;
      }
      if (line.trim() === "") {
        return "";
      }
      const inlineContent = line.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      return `<p>${inlineContent}</p>`;
    });

    const formattedSummary = `
      <hr />
      <h2>AI Summary</h2>
      ${htmlLines.filter((l) => l !== "").join("")}
    `;
    setContent((prev) => prev + formattedSummary);
    setSummary(null);
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        href={`/dashboard/courses/${courseId}`}
        className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {courseTitle}
      </Link>

      {/* Main layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Notes column */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {topicTitle}
            </h1>
            <p className="mt-2 text-muted-foreground">
              Write notes, organize your ideas, and use AI to study faster.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card/80 p-8 shadow-2xl backdrop-blur-sm">
            <TopicEditor
              topicId={topicId}
              value={content}
              onChange={setContent}
            />
          </div>
        </div>

        {/* Right Sidebar - AI Study tools */}
        <div className="lg:col-span-1 space-y-6">
          <AIToolbar
            onSummarize={triggerSummarize}
            onExplain={triggerExplain}
            onFlashcards={triggerFlashcards}
            onQuiz={triggerQuiz}
            loading={loadingAction}
          />
        </div>
      </div>

      {/* Floating status error banners */}
      {errorMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex max-w-md items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-950/80 p-4 text-rose-200 shadow-2xl backdrop-blur">
          <AlertTriangle className="h-5 w-5 shrink-0 text-rose-400" />
          <p className="text-sm">{errorMessage}</p>
          <button
            onClick={() => setErrorMessage(null)}
            className="ml-auto cursor-pointer rounded-lg p-1 text-rose-400 hover:bg-rose-900/50 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Summary Modal */}
      {summary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                <h3 className="font-semibold text-foreground text-lg">AI Notes Summary</h3>
              </div>
              <button
                onClick={() => setSummary(null)}
                className="cursor-pointer rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-6 text-foreground leading-relaxed space-y-1">
              {formatMarkdown(summary)}
            </div>
            <div className="flex items-center justify-between border-t border-border bg-muted/40 px-6 py-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(summary);
                  setCopiedSummary(true);
                  setTimeout(() => setCopiedSummary(false), 2000);
                }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                {copiedSummary ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                {copiedSummary ? "Copied!" : "Copy Summary"}
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={appendSummaryToNotes}
                  className="cursor-pointer rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  Append to Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explain Tutor Slide-out Panel */}
      {explanation && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="h-full w-full max-w-lg border-l border-border bg-card shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                <h3 className="font-semibold text-foreground text-lg">AI Tutor Explanation</h3>
              </div>
              <button
                onClick={() => setExplanation(null)}
                className="cursor-pointer rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 text-foreground leading-relaxed space-y-1">
              {formatMarkdown(explanation)}
            </div>
            <div className="border-t border-border bg-muted/40 px-6 py-4 flex justify-end">
              <button
                onClick={() => setExplanation(null)}
                className="cursor-pointer rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                Close Tutor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flashcards Success Modal */}
      {flashcardSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Flashcards Ready!</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{flashcardSuccess.message}</p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setFlashcardSuccess(null)}
                className="flex-1 cursor-pointer rounded-xl border border-border bg-card py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Done
              </button>
              <Link
                href={`/dashboard/study/review/${flashcardSuccess.deckId}`}
                className="flex-1 cursor-pointer rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 text-center"
              >
                Review Cards
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {quizQuestions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                <h3 className="font-semibold text-foreground text-lg">Interactive Quiz</h3>
              </div>
              <button
                onClick={() => setQuizQuestions(null)}
                className="cursor-pointer rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quiz content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!showQuizResults ? (
                <>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Question {activeQuestionIndex + 1} of {quizQuestions.length}</span>
                    <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 font-medium text-indigo-600 dark:text-indigo-400">
                      Active
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-foreground leading-relaxed">
                    {quizQuestions[activeQuestionIndex].question}
                  </h4>

                  <div className="space-y-3 pt-2">
                    {quizQuestions[activeQuestionIndex].options.map((option, optIdx) => {
                      const isSelected = selectedAnswers[activeQuestionIndex] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [activeQuestionIndex]: optIdx,
                            }));
                          }}
                          className={`w-full text-left rounded-2xl border p-4 text-sm font-medium transition cursor-pointer ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-white"
                              : "border-border bg-card text-muted-foreground hover:border-indigo-500/30 hover:bg-muted"
                          }`}
                        >
                          <span className="inline-block w-6 text-indigo-600 dark:text-indigo-400 font-bold">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="text-center py-4 space-y-2">
                    <h4 className="text-2xl font-black text-foreground">Quiz Completed!</h4>
                    <p className="text-muted-foreground">
                      You scored{" "}
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                        {
                          quizQuestions.filter(
                            (q, idx) => selectedAnswers[idx] === q.correctIndex
                          ).length
                        }
                      </span>{" "}
                      out of {quizQuestions.length}
                    </p>
                  </div>

                  <div className="space-y-6 border-t border-border pt-6">
                    {quizQuestions.map((q, idx) => {
                      const isCorrect = selectedAnswers[idx] === q.correctIndex;
                      return (
                        <div key={idx} className="space-y-2 rounded-2xl border border-border bg-card/60 p-4">
                          <p className="font-bold text-foreground text-sm">
                            {idx + 1}. {q.question}
                          </p>
                          <div className="text-xs space-y-1">
                            <p className={isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                              Your Answer: {q.options[selectedAnswers[idx] ?? -1] || "None selected"}
                            </p>
                            {!isCorrect && (
                              <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                Correct: {q.options[q.correctIndex]}
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 bg-muted/40 p-3 rounded-xl border border-border italic">
                            {q.explanation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quiz Footer controls */}
            <div className="border-t border-border bg-muted/40 px-6 py-4 flex justify-between">
              {!showQuizResults ? (
                <>
                  <button
                    disabled={activeQuestionIndex === 0}
                    onClick={() => setActiveQuestionIndex((prev) => prev - 1)}
                    className="cursor-pointer rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Previous
                  </button>

                  {activeQuestionIndex < quizQuestions.length - 1 ? (
                    <button
                      disabled={selectedAnswers[activeQuestionIndex] === undefined}
                      onClick={() => setActiveQuestionIndex((prev) => prev + 1)}
                      className="cursor-pointer rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                      onClick={() => setShowQuizResults(true)}
                      className="cursor-pointer rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50"
                    >
                      Submit Quiz
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setQuizQuestions(null)}
                  className="w-full cursor-pointer rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 text-center"
                >
                  Done Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function formatMarkdown(text: string) {
  if (!text) return "";
  
  // 1. Remove redundant backslashes, escape quotes, or LaTeX style math syntax if they make it unreadable
  let cleaned = text
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .replace(/\\/g, ""); // strip all other stray backslashes
    
  // 2. Parse basic markdown tags to styled JSX elements
  const lines = cleaned.split("\n");
  return lines.map((line, idx) => {
    // Header 2
    if (line.startsWith("## ")) {
      return (
        <h3 key={idx} className="mt-4 mb-2 text-lg font-bold text-foreground">
          {line.replace("## ", "")}
        </h3>
      );
    }
    // Header 3
    if (line.startsWith("### ")) {
      return (
        <h4 key={idx} className="mt-3 mb-1.5 text-base font-bold text-foreground/90">
          {line.replace("### ", "")}
        </h4>
      );
    }
    // Header 1
    if (line.startsWith("# ")) {
      return (
        <h2 key={idx} className="mt-5 mb-3 text-xl font-bold text-foreground border-b border-border pb-1">
          {line.replace("# ", "")}
        </h2>
      );
    }
    // Bullet point
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      const bulletContent = line.trim().substring(2);
      return (
        <div key={idx} className="ml-4 my-1 flex items-start gap-2 text-foreground/80">
          <span className="text-indigo-500 dark:text-indigo-400 mt-1.5 shrink-0 select-none">●</span>
          <span>{parseInlineMarkdown(bulletContent)}</span>
        </div>
      );
    }
    // Normal paragraph
    if (line.trim() === "") {
      return <div key={idx} className="h-2" />;
    }
    return (
      <p key={idx} className="my-1.5 text-foreground/80">
        {parseInlineMarkdown(line)}
      </p>
    );
  });
}

function parseInlineMarkdown(text: string) {
  // Replace bold **text** with JSX structure
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-bold text-foreground">{part}</strong>;
    }
    // Replace inline code or formulas `text`
    const subParts = part.split(/`([^`]+)`/g);
    return subParts.map((subPart, j) => {
      if (j % 2 === 1) {
        return <code key={j} className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-indigo-600 dark:text-indigo-300">{subPart}</code>;
      }
      return subPart;
    });
  });
}
