"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Undo,
  Redo,
} from "lucide-react";

interface Props {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: Props) {
  if (!editor) return null;

  const buttonClass = (active: boolean) =>
    `flex h-10 w-10 items-center justify-center rounded-lg transition ${
      active
        ? "bg-indigo-600 text-white"
        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
    }`;

  return (
    <div className="sticky top-4 z-20 mb-6 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-slate-900/95 p-4 backdrop-blur">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
      >
        <Bold size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive("italic"))}
      >
        <Italic size={18} />
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        className={buttonClass(editor.isActive("heading", { level: 1 }))}
      >
        <Heading1 size={18} />
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={buttonClass(editor.isActive("heading", { level: 2 }))}
      >
        <Heading2 size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive("bulletList"))}
      >
        <List size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive("orderedList"))}
      >
        <ListOrdered size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className={buttonClass(false)}
      >
        <Undo size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className={buttonClass(false)}
      >
        <Redo size={18} />
      </button>
    </div>
  );
}