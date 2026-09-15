"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Quote,
  List,
  ListOrdered,
  ImagePlus,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.set("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error("Görsel yüklenemedi.");
  const data = await res.json();
  return data.url as string;
}

export function RichTextEditor({
  content,
  onChange,
}: {
  content: JSONContent | undefined;
  onChange: (content: JSONContent) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral dark:prose-invert max-w-none min-h-[320px] focus:outline-none px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  });

  if (!editor) return null;

  async function handleImagePick() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;
      try {
        const url = await uploadImage(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch {
        // sessiz geç, kullanıcı tekrar deneyebilir
      }
    };
    input.click();
  }

  function handleLink() {
    const url = window.prompt("Bağlantı URL'si");
    if (!url) return;
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  const buttons = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive("underline") },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
  ];

  return (
    <div className="rounded-md border">
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-1.5">
        {buttons.map(({ icon: Icon, action, active }, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="icon"
            className={cn("size-8", active && "bg-accent text-accent-foreground")}
            onClick={action}
          >
            <Icon className="size-4" />
          </Button>
        ))}
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Button type="button" variant="ghost" size="icon" className="size-8" onClick={handleImagePick}>
          <ImagePlus className="size-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="size-8" onClick={handleLink}>
          <LinkIcon className="size-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
