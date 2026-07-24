"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, FileText, Brain, X, Loader2, Command } from "lucide-react";
import { searchAllUserContent } from "@/app/dashboard/search-actions";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ courses: any[]; topics: any[]; decks: any[] }>({
    courses: [],
    topics: [],
    decks: [],
  });

  const router = useRouter();

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Execute search query
  useEffect(() => {
    if (!query.trim()) {
      setResults({ courses: [], topics: [], decks: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchAllUserContent(query);
        setResults(res);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    onClose();
    setQuery("");
    router.push(path);
  };

  const hasResults =
    results.courses.length > 0 || results.topics.length > 0 || results.decks.length > 0;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-background/80 backdrop-blur-md animate-fade-in p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl space-y-0 animate-scale-up"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, topics, flashcards... (Esc to exit)"
            className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition"
                title="Close Search Modal (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 no-scrollbar text-xs">
          {!query.trim() ? (
            <div className="py-8 text-center text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Quick Global Search</p>
              <p className="text-[11px]">Type keywords to jump directly to courses, notes, or flashcard decks.</p>
            </div>
          ) : !hasResults && !loading ? (
            <div className="py-8 text-center text-muted-foreground">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <>
              {/* Courses */}
              {results.courses.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground px-2">Courses</span>
                  {results.courses.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => navigateTo(`/dashboard/courses/${course.id}`)}
                      className="flex w-full items-center justify-between rounded-xl border border-border/40 p-3 hover:bg-muted/50 transition cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: course.color }}
                        />
                        <span className="font-bold text-foreground text-sm">{course.title}</span>
                      </div>
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}

              {/* Topics */}
              {results.topics.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground px-2">Topic Notes</span>
                  {results.topics.map((topic: any) => (
                    <button
                      key={topic.id}
                      onClick={() => navigateTo(`/dashboard/topics/${topic.id}`)}
                      className="flex w-full items-center justify-between rounded-xl border border-border/40 p-3 hover:bg-muted/50 transition cursor-pointer text-left"
                    >
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-foreground">{topic.title}</h4>
                        <span className="text-[10px] text-muted-foreground">Course: {topic.course.title}</span>
                      </div>
                      <FileText className="h-4 w-4 text-indigo-500" />
                    </button>
                  ))}
                </div>
              )}

              {/* Decks */}
              {results.decks.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground px-2">Flashcard Decks</span>
                  {results.decks.map((deck) => (
                    <button
                      key={deck.id}
                      onClick={() => navigateTo(`/dashboard/study/review/${deck.id}`)}
                      className="flex w-full items-center justify-between rounded-xl border border-border/40 p-3 hover:bg-muted/50 transition cursor-pointer text-left"
                    >
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-foreground">{deck.title}</h4>
                        <span className="text-[10px] text-muted-foreground">Topic: {deck.topic.title}</span>
                      </div>
                      <Brain className="h-4 w-4 text-emerald-500" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
