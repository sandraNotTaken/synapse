"use client";

import { useEffect, useState, useTransition } from "react";
import { updateTopicContent } from "@/app/actions/topic";
import RichTextEditor from "./rich-text-editor";

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
  const [content, setContent] = useState(value);
  const [saved, setSaved] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Sync internal state when parent value updates (e.g. AI summary appends)
  useEffect(() => {
    setContent(value);
  }, [value]);

  // Debounced auto-save to server
  useEffect(() => {
    // If local state matches parent state, it's already in sync
    if (content === value) {
      return;
    }

    setSaved(false);

    const timer = setTimeout(() => {
      startTransition(async () => {
        await updateTopicContent(topicId, content);
        setSaved(true);
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [content, topicId, value]);

  return (
    <div className="space-y-3">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Notes</h2>
        <span className="text-sm text-slate-400">Auto-save enabled</span>
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
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            isPending
              ? "bg-yellow-500/20 text-yellow-300"
              : saved
              ? "bg-green-500/20 text-green-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {isPending ? "Saving..." : saved ? "✓ Saved" : "Unsaved Changes"}
        </span>

        <button
          onClick={() =>
            startTransition(async () => {
              await updateTopicContent(topicId, content);
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