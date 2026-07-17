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
          class: "text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer",
        },
      }),
    ],

    content,

    immediatelyRender: false,

    editorProps: {
        attributes: {
            class:
                "prose prose-invert prose-headings:text-white prose-p:text-slate-200 prose-strong:text-white max-w-none h-[550px] overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/40 p-10 outline-none",
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