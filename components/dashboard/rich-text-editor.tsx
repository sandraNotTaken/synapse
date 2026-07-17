"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
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
    extensions: [StarterKit],

    content,

    immediatelyRender: false,

    editorProps: {
        attributes: {
            class:
                "prose prose-invert prose-headings:text-white prose-p:text-slate-200 prose-strong:text-white max-w-none min-h-[700px] rounded-2xl border border-white/10 bg-slate-950/40 p-10 outline-none",
        },
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="space-y-4">
        <EditorToolbar editor={editor} />

        <EditorContent editor={editor} />
    </div>
  );
}