"use server";

import { revalidatePath } from "next/cache";
import { UserRole, ArticleStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/current-user";
import { articleSchema, type ArticleFormValues } from "@/lib/validation/article";

const EDITOR_ROLES: UserRole[] = [UserRole.ADMIN, UserRole.EDITOR, UserRole.AUTHOR];

// Next.js dev (Turbopack) + React 19 Server Actions can mis-serialize deeply
// nested plain objects (e.g. Tiptap's contentJson tree) as "temporary
// references", which later crashes inside Prisma's argument serializer.
// Sending the payload as a JSON string sidesteps that entirely.
function parseArticlePayload(payload: string): ArticleFormValues {
  const raw = JSON.parse(payload);
  if (raw.publishedAt) raw.publishedAt = new Date(raw.publishedAt);
  return articleSchema.parse(raw);
}

export async function createArticle(payload: string) {
  const user = await requireRole(EDITOR_ROLES);
  const data = parseArticlePayload(payload);

  const existing = await prisma.article.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return { success: false as const, error: "Bu slug zaten kullanılıyor." };
  }

  const article = await prisma.article.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      contentJson: data.contentJson as Prisma.InputJsonValue,
      coverImageUrl: data.coverImageUrl || null,
      status: data.status,
      publishedAt: data.status === ArticleStatus.PUBLISHED ? new Date() : data.publishedAt,
      categoryId: data.categoryId,
      authorId: user.id,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      tags: {
        create: data.tagIds.map((tagId) => ({ tagId })),
      },
    },
  });

  revalidatePath("/dashboard/articles");
  revalidatePath("/");
  return { success: true as const, articleId: article.id };
}

export async function updateArticle(id: string, payload: string) {
  const user = await requireRole(EDITOR_ROLES);
  const data = parseArticlePayload(payload);

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return { success: false as const, error: "Haber bulunamadı." };
  if (user.role === UserRole.AUTHOR && article.authorId !== user.id) {
    return { success: false as const, error: "Bu haberi düzenleme yetkiniz yok." };
  }

  const slugOwner = await prisma.article.findUnique({ where: { slug: data.slug } });
  if (slugOwner && slugOwner.id !== id) {
    return { success: false as const, error: "Bu slug zaten kullanılıyor." };
  }

  await prisma.$transaction([
    prisma.articleTag.deleteMany({ where: { articleId: id } }),
    prisma.article.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        contentJson: data.contentJson as Prisma.InputJsonValue,
        coverImageUrl: data.coverImageUrl || null,
        status: data.status,
        publishedAt:
          data.status === ArticleStatus.PUBLISHED && !article.publishedAt
            ? new Date()
            : data.publishedAt ?? article.publishedAt,
        categoryId: data.categoryId,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        tags: { create: data.tagIds.map((tagId) => ({ tagId })) },
      },
    }),
  ]);

  revalidatePath("/dashboard/articles");
  revalidatePath(`/haber/${data.slug}`);
  revalidatePath("/");
  return { success: true as const };
}

export async function deleteArticle(id: string) {
  const user = await requireRole(EDITOR_ROLES);
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return { success: false as const, error: "Haber bulunamadı." };
  if (user.role === UserRole.AUTHOR && article.authorId !== user.id) {
    return { success: false as const, error: "Bu haberi silme yetkiniz yok." };
  }

  await prisma.article.delete({ where: { id } });
  revalidatePath("/dashboard/articles");
  revalidatePath("/");
  return { success: true as const };
}

export async function getArticleForEdit(id: string) {
  await requireRole(EDITOR_ROLES);
  return prisma.article.findUnique({
    where: { id },
    include: { tags: true },
  });
}

export async function listArticlesForDashboard() {
  await requireRole(EDITOR_ROLES);
  return prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      author: { select: { name: true } },
    },
  });
}
