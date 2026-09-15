import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import type { JSONContent } from "@tiptap/core";

const EXTENSIONS = [
  StarterKit,
  Underline,
  Image,
  Link,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
];

export function renderArticleHtml(content: unknown): string {
  try {
    return generateHTML(content as JSONContent, EXTENSIONS);
  } catch {
    return "";
  }
}
