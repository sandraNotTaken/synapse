"use client";

import { useEffect, useState } from "react";
import { Keyboard, X, Sparkles, Navigation, Brain, StickyNote } from "lucide-react";

export default function ShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load shortcuts setting
    const saved = localStorage.getItem("synapse_shortcuts_enabled");
    setEnabled(saved !== "false");

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle modal with "?" key
      if (e.key === "?") {
        const target = e.target as HTMLElement;
        const isInput =
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable ||
          target.closest("[contenteditable='true']");

        if (!isInput) {
          e.preventDefault();
          setIsOpen((prev) => !prev);
        }
      }

      // Close modal on Escape
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-2xl md:p-8 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-500 border border-indigo-500/20">
              <Keyboard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Keyboard Shortcuts</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Speed up your workflow inside Synapse</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-xl border border-border bg-muted/40 p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Shortcuts list container */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 max-h-96 overflow-y-auto pr-1 no-scrollbar">
          {/* Global Navigation */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1.5">
              <Navigation className="h-3.5 w-3.5" />
              Global Navigation
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Go to Dashboard</span>
                <span className="flex gap-1">
                  <kbd className="rounded bg-muted px-2 py-0.5 text-xs border border-border font-mono shadow-sm">g</kbd>
                  <kbd className="rounded bg-muted px-2 py-0.5 text-xs border border-border font-mono shadow-sm">d</kbd>
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Go to Study Hub</span>
                <span className="flex gap-1">
                  <kbd className="rounded bg-muted px-2 py-0.5 text-xs border border-border font-mono shadow-sm">g</kbd>
                  <kbd className="rounded bg-muted px-2 py-0.5 text-xs border border-border font-mono shadow-sm">s</kbd>
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Go to Courses</span>
                <span className="flex gap-1">
                  <kbd className="rounded bg-muted px-2 py-0.5 text-xs border border-border font-mono shadow-sm">g</kbd>
                  <kbd className="rounded bg-muted px-2 py-0.5 text-xs border border-border font-mono shadow-sm">c</kbd>
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Go to Decks</span>
                <span className="flex gap-1">
                  <kbd className="rounded bg-muted px-2 py-0.5 text-xs border border-border font-mono shadow-sm">g</kbd>
                  <kbd className="rounded bg-muted px-2 py-0.5 text-xs border border-border font-mono shadow-sm">k</kbd>
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Go to Settings</span>
                <span className="flex gap-1">
                  <kbd className="rounded bg-muted px-2 py-0.5 text-xs border border-border font-mono shadow-sm">g</kbd>
                  <kbd className="rounded bg-muted px-2 py-0.5 text-xs border border-border font-mono shadow-sm">,</kbd>
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Toggle Cheatsheet</span>
                <kbd className="rounded bg-muted px-2 py-0.5 text-xs border border-border font-mono shadow-sm">?</kbd>
              </div>
            </div>
          </div>

          {/* Contextual Actions */}
          <div className="space-y-6">
            {/* Flashcard Reviews */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1.5">
                <Brain className="h-3.5 w-3.5" />
                Flashcard Reviews
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Flip Card</span>
                  <kbd className="rounded bg-muted px-2.5 py-0.5 text-xs border border-border font-mono shadow-sm">Space</kbd>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Rate Card (Again - Easy)</span>
                  <span className="flex gap-1">
                    <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs border border-border font-mono shadow-sm">1</kbd>
                    <span className="text-muted-foreground/40">-</span>
                    <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs border border-border font-mono shadow-sm">4</kbd>
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Previous / Next Card</span>
                  <span className="flex gap-1">
                    <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs border border-border font-mono shadow-sm">←</kbd>
                    <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs border border-border font-mono shadow-sm">→</kbd>
                  </span>
                </div>
              </div>
            </div>

            {/* Note Editor */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1.5">
                <StickyNote className="h-3.5 w-3.5" />
                Note Workspace
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Manual Save Notes</span>
                  <kbd className="rounded bg-muted px-2.5 py-0.5 text-xs border border-border font-mono shadow-sm">Ctrl + S</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info box */}
        <div className="mt-8 flex items-center gap-2 rounded-2xl border border-indigo-500/10 bg-indigo-500/[0.03] p-4 text-xs text-muted-foreground">
          <Sparkles className="h-4 w-4 text-indigo-500 shrink-0" />
          <span>
            Shortcut sequences should be typed consecutively. You can customize, review, or disable shortcuts completely in the **Settings** menu at any time.
          </span>
        </div>
      </div>
    </div>
  );
}
