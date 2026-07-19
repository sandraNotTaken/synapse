"use client";

import { useRef, useState } from "react";
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
  Image as ImageIcon,
  Paperclip,
  Loader2,
} from "lucide-react";

interface Props {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  if (!editor) return null;

  const buttonClass = (active: boolean) =>
    `flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition ${
      active
        ? "bg-indigo-600 text-white"
        : "bg-muted text-muted-foreground hover:bg-muted-foreground/10 disabled:opacity-50"
    }`;

  async function handleFileUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    isImage: boolean
  ) {
    if (!editor) return;
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      const url = data.url;

      if (isImage) {
        editor.chain().focus().setImage({ src: url, alt: file.name }).run();
      } else {
        editor
          .chain()
          .focus()
          .setLink({ href: url })
          .insertContent(file.name)
          .run();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
      if (event.target) event.target.value = "";
    }
  }

  return (
    <div className="sticky top-4 z-20 mb-6 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-slate-900/95 p-4 backdrop-blur">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={(e) => handleFileUpload(e, true)}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileUpload(e, false)}
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
        className="hidden"
      />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
        title="Bold"
      >
        <Bold size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive("italic"))}
        title="Italic"
      >
        <Italic size={18} />
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        className={buttonClass(editor.isActive("heading", { level: 1 }))}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={buttonClass(editor.isActive("heading", { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive("bulletList"))}
        title="Bullet List"
      >
        <List size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive("orderedList"))}
        title="Numbered List"
      >
        <ListOrdered size={18} />
      </button>

      <div className="h-6 w-px bg-white/10 self-center mx-1" />

      {/* Upload actions */}
      <button
        type="button"
        disabled={uploading}
        onClick={() => imageInputRef.current?.click()}
        className={buttonClass(false)}
        title="Insert Image"
      >
        {uploading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <ImageIcon size={18} />
        )}
      </button>

      <button
        type="button"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        className={buttonClass(false)}
        title="Insert Document / PDF"
      >
        {uploading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Paperclip size={18} />
        )}
      </button>

      <div className="h-6 w-px bg-border self-center mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className={buttonClass(false)}
        title="Undo"
      >
        <Undo size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className={buttonClass(false)}
        title="Redo"
      >
        <Redo size={18} />
      </button>
    </div>
  );
}