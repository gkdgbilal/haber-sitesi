import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { UserRole } from "@prisma/client";
import { requireRole } from "@/lib/current-user";

export async function POST(request: Request) {
  try {
    await requireRole([UserRole.ADMIN, UserRole.EDITOR, UserRole.AUTHOR]);
  } catch {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Sadece görsel yüklenebilir." }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Görsel 8MB'dan küçük olmalı." }, { status: 400 });
  }

  const blob = await put(`articles/${Date.now()}-${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: blob.url });
}
