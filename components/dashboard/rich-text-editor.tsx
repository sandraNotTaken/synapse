"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import EditorToolbar from "./editor-toolbar";

interface Props {
  content: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({
  content,
  onChange,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 underline font-medium cursor-pointer",
        },
      }),
    ],

    content,

    immediatelyRender: false,

    editorProps: {
        attributes: {
            class:
                "prose dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground max-w-none h-[550px] overflow-y-auto rounded-2xl border border-border bg-card/45 p-10 outline-none",
        },
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="space-y-4">
        <EditorToolbar editor={editor} />

        <EditorContent editor={editor} />
    </div>
  );
}