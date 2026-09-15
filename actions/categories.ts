"use server";

import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/current-user";
import { categorySchema, tagSchema, type CategoryFormValues, type TagFormValues } from "@/lib/validation/article";

const MANAGE_ROLES: UserRole[] = [UserRole.ADMIN, UserRole.EDITOR];

export async function createCategory(input: CategoryFormValues) {
  await requireRole(MANAGE_ROLES);
  const data = categorySchema.parse(input);

  const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
  if (existing) return { success: false as const, error: "Bu slug zaten kullanılıyor." };

  await prisma.category.create({
    data: { name: data.name, slug: data.slug, parentId: data.parentId || null },
  });
  revalidatePath("/dashboard/categories");
  revalidatePath("/");
  return { success: true as const };
}

export async function deleteCategory(id: string) {
  await requireRole(MANAGE_ROLES);
  const articleCount = await prisma.article.count({ where: { categoryId: id } });
  if (articleCount > 0) {
    return { success: false as const, error: "Bu kategoriye bağlı haberler var, önce onları taşıyın." };
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/dashboard/categories");
  revalidatePath("/");
  return { success: true as const };
}

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { articles: true } } },
  });
}

export async function createTag(input: TagFormValues) {
  await requireRole(MANAGE_ROLES);
  const data = tagSchema.parse(input);

  const existing = await prisma.tag.findUnique({ where: { slug: data.slug } });
  if (existing) return { success: false as const, error: "Bu etiket zaten var." };

  const tag = await prisma.tag.create({ data });
  revalidatePath("/dashboard/tags");
  return { success: true as const, tag };
}

export async function listTags() {
  return prisma.tag.findMany({ orderBy: { name: "asc" } });
}
