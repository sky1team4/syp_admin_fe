"use client";

import React, { useRef, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  ImageIcon,
} from "lucide-react";
import MediaPickerModal from "./MediaPickerModal";

const HEADING_OPTIONS = [
  { value: "", label: "Paragraph" },
  { value: "1", label: "Heading 1" },
  { value: "2", label: "Heading 2" },
  { value: "3", label: "Heading 3" },
  { value: "4", label: "Heading 4" },
  { value: "5", label: "Heading 5" },
  { value: "6", label: "Heading 6" },
];

export default function RichTextEditor({ content, onChange, placeholder = "Write your post..." }) {
  const editorRef = useRef(null);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Image.configure({ inline: false, allowBase64: true }),
    ],
    content: content ?? "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "ProseMirror",
      },
      handleDOMEvents: {
        blur: () => {
          if (onChange && editorRef.current) onChange(editorRef.current.getHTML());
        },
      },
      handleKeyDown: (_view, event) => {
        if (event.key === "," && editorRef.current?.isActive("listItem")) {
          editorRef.current.chain().focus().insertContent(",").run();
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getHTML());
    },
  });

  const insertImage = (url) => {
    if (!url || !editor) {
      setImagePickerOpen(false);
      return;
    }
    setImagePickerOpen(false);
    editor.chain().focus().setImage({ src: url }).run();
    // Move cursor after the image so it appears in a text node (fixes dash-like cursor)
    requestAnimationFrame(() => {
      if (editor.isDestroyed) return;
      editor.chain().focus("end").run();
    });
  };

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  if (!editor) {
    return (
      <div className="blog-rich-editor border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div className="blog-editor-toolbar" />
        <div className="min-h-[280px] animate-pulse bg-gray-50" />
      </div>
    );
  }

  return (
    <div className="blog-rich-editor border border-gray-200 rounded-lg bg-white overflow-hidden">
      <div className="blog-editor-toolbar">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`toolbar-btn ${editor.isActive("bold") ? "is-active" : ""}`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`toolbar-btn ${editor.isActive("italic") ? "is-active" : ""}`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <span className="toolbar-divider" aria-hidden />
        <select
          value={[1, 2, 3, 4, 5, 6].find((l) => editor.isActive("heading", { level: l }))?.toString() ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            if (v) editor.chain().focus().toggleHeading({ level: Number(v) }).run();
            else editor.chain().focus().setParagraph().run();
          }}
          className="h-9 min-w-[120px] rounded-md border-0 bg-transparent px-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
          title="Block format"
        >
          {HEADING_OPTIONS.map((opt) => (
            <option key={opt.value || "p"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="toolbar-divider" aria-hidden />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`toolbar-btn ${editor.isActive("bulletList") ? "is-active" : ""}`}
          title="Bullet list"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`toolbar-btn ${editor.isActive("orderedList") ? "is-active" : ""}`}
          title="Numbered list"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <span className="toolbar-divider" aria-hidden />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`toolbar-btn ${editor.isActive("blockquote") ? "is-active" : ""}`}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`toolbar-btn ${editor.isActive("codeBlock") ? "is-active" : ""}`}
          title="Code block"
        >
          <Code className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setImagePickerOpen(true)}
          className="toolbar-btn"
          title="Insert image"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
      <MediaPickerModal
        open={imagePickerOpen}
        onClose={() => setImagePickerOpen(false)}
        onSelect={insertImage}
      />
    </div>
  );
}
