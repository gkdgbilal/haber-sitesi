import { prisma } from "@/lib/prisma";
import { ArticleStatus, type Prisma } from "@prisma/client";

export const ARTICLE_CARD_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImageUrl: true,
  publishedAt: true,
  category: { select: { name: true, slug: true } },
} satisfies Prisma.ArticleSelect;

export type ArticleCard = Prisma.ArticleGetPayload<{ select: typeof ARTICLE_CARD_SELECT }>;

function publishedWhere(): Prisma.ArticleWhereInput {
  return {
    status: ArticleStatus.PUBLISHED,
    publishedAt: { lte: new Date() },
  };
}

export async function getFeaturedArticle(): Promise<ArticleCard | null> {
  return prisma.article.findFirst({
    where: publishedWhere(),
    orderBy: { publishedAt: "desc" },
    select: ARTICLE_CARD_SELECT,
  });
}

export async function getLatestArticles(options: {
  excludeId?: string;
  categorySlug?: string;
  take?: number;
  skip?: number;
} = {}): Promise<ArticleCard[]> {
  return prisma.article.findMany({
    where: {
      ...publishedWhere(),
      id: options.excludeId ? { not: options.excludeId } : undefined,
      category: options.categorySlug ? { slug: options.categorySlug } : undefined,
    },
    orderBy: { publishedAt: "desc" },
    take: options.take ?? 12,
    skip: options.skip ?? 0,
    select: ARTICLE_CARD_SELECT,
  });
}

export async function getArticlesByCategoryGrouped(take = 4) {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
  });

  const groups = await Promise.all(
    categories.map(async (category) => {
      const articles = await prisma.article.findMany({
        where: { ...publishedWhere(), categoryId: category.id },
        orderBy: { publishedAt: "desc" },
        take,
        select: ARTICLE_CARD_SELECT,
      });
      return { category, articles };
    })
  );

  return groups.filter((group) => group.articles.length > 0);
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: { slug, ...publishedWhere() },
    include: {
      author: { select: { name: true, avatarUrl: true } },
      category: { select: { name: true, slug: true } },
      tags: { include: { tag: true } },
    },
  });
}

export async function incrementViewCount(id: string) {
  await prisma.article.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });
}

export async function searchArticles(query: string, take = 20): Promise<ArticleCard[]> {
  if (!query.trim()) return [];
  return prisma.article.findMany({
    where: {
      ...publishedWhere(),
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { excerpt: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { publishedAt: "desc" },
    take,
    select: ARTICLE_CARD_SELECT,
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}
