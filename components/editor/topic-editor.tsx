"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { updateTopicContent } from "@/app/actions/topic";

interface TopicEditorProps {
  topicId: string;
  initialContent: string;
}

export default function TopicEditor({
  topicId,
  initialContent,
}: TopicEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await updateTopicContent(topicId, content);
    });
  }

  return (
    <div className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing your notes..."
        className="min-h-[450px]"
      />

      <Button
        onClick={handleSave}
        disabled={isPending}
      >
        {isPending ? "Saving..." : "Save Notes"}
      </Button>
    </div>
  );
}