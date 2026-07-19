"use client";

import { useEffect, useState, useTransition } from "react";
import { updateTopicContent } from "@/app/actions/topic";
import RichTextEditor from "./rich-text-editor";
import { useOffline } from "@/components/providers/offline-provider";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

interface TopicEditorProps {
  topicId: string;
  value: string;
  onChange: (value: string) => void;
}

export default function TopicEditor({
  topicId,
  value,
  onChange,
}: TopicEditorProps) {
  const { isOffline, queueNoteContent } = useOffline();
  const [content, setContent] = useState(value);
  const [saved, setSaved] = useState(true);
  const [isPending, startTransition] = useTransition();

  useKeyboardShortcuts(
    {
      "ctrl+s": () => {
        startTransition(async () => {
          if (isOffline) {
            queueNoteContent(topicId, content);
          } else {
            try {
              await updateTopicContent(topicId, content);
            } catch (err) {
              console.error("Manual save failed, saving locally:", err);
              queueNoteContent(topicId, content);
            }
          }
          setSaved(true);
        });
      },
    },
    [content, topicId, isOffline]
  );

  // Sync internal state when parent value updates (e.g. AI summary appends) or check local storage drafts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const draft = localStorage.getItem(`synapse_offline_note_${topicId}`);
      if (draft) {
        setContent(draft);
        onChange(draft);
        setSaved(false);
        return;
      }
    }
    setContent(value);
  }, [value, topicId, onChange]);

  // Debounced auto-save to server
  useEffect(() => {
    // If local state matches parent state, it's already in sync
    if (content === value) {
      return;
    }

    setSaved(false);

    const timer = setTimeout(() => {
      startTransition(async () => {
        if (isOffline) {
          queueNoteContent(topicId, content);
        } else {
          try {
            await updateTopicContent(topicId, content);
          } catch (err) {
            console.error("Auto-save failed, saving locally:", err);
            queueNoteContent(topicId, content);
          }
        }
        setSaved(true);
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [content, topicId, value, isOffline, queueNoteContent]);

  return (
    <div className="space-y-3">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Notes</h2>
        <span className="text-sm text-muted-foreground">Auto-save enabled</span>
      </div>

      <RichTextEditor
        content={content}
        onChange={(newValue) => {
          setContent(newValue);
          setSaved(false);
          onChange(newValue);
        }}
      />

      <div className="flex justify-between items-center mt-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium border ${
            isPending
              ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-300 border-yellow-500/20"
              : saved
              ? "bg-green-500/10 text-green-600 dark:text-green-300 border-green-500/20"
              : "bg-red-500/10 text-red-600 dark:text-red-300 border-red-500/20"
          }`}
        >
          {isPending ? "Saving..." : saved ? (isOffline ? "✓ Saved Locally" : "✓ Saved") : "Unsaved Changes"}
        </span>

        <button
          onClick={() =>
            startTransition(async () => {
              if (isOffline) {
                queueNoteContent(topicId, content);
              } else {
                try {
                  await updateTopicContent(topicId, content);
                } catch (err) {
                  console.error("Save failed, saving locally:", err);
                  queueNoteContent(topicId, content);
                }
              }
              setSaved(true);
            })
          }
          className="rounded-xl cursor-pointer bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          Save Notes
        </button>
      </div>
    </div>
  );
}