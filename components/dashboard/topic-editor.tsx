"use client";

import { useEffect, useState, useTransition } from "react";
import { updateTopicContent } from "@/app/actions/topic";
import RichTextEditor from "./rich-text-editor";

interface TopicEditorProps {
  topicId: string;
  initialContent: string;
}

export default function TopicEditor({
  topicId,
  initialContent,
}: TopicEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
  // Don't save immediately when the page first loads
  if (content === initialContent) {
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
}, [content, topicId, initialContent]);

  return (
    <div className="space-y-3 min-h-[700px]">
        <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
                Notes
            </h2>

            <span className="text-sm text-slate-400">
                Auto-save enabled
            </span>
        </div>
        <RichTextEditor
            content={content}
            onChange={(value) => {
                setContent(value);
                setSaved(false);
            }}
        />
      <div className="flex justify-end">
        <div className="mt-4 flex justify-end">
            <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                isPending
                    ? "bg-yellow-500/20 text-yellow-300"
                    : saved
                    ? "bg-green-500/20 text-green-300"
                    : "bg-red-500/20 text-red-300"
                }`}
            >
                {isPending
                ? "Saving..."
                : saved
                ? "✓ Saved"
                : "Unsaved"}
            </span>
        </div>

        <button
          onClick={() =>
            startTransition(async () => {
              await updateTopicContent(topicId, content);
            })
          }
          className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          Save Notes
        </button>
      </div>
    </div>
  );
}