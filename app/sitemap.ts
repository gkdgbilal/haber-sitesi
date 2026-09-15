import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { ArticleStatus } from "@prisma/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const [articles, categories] = await Promise.all([
    prisma.article.findMany({
      where: { status: ArticleStatus.PUBLISHED, publishedAt: { lte: new Date() } },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.category.findMany({ select: { slug: true } }),
  ]);

  return [
    { url: baseUrl, changeFrequency: "hourly", priority: 1 },
    { url: `${baseUrl}/ara`, changeFrequency: "weekly", priority: 0.3 },
    ...categories.map((category) => ({
      url: `${baseUrl}/kategori/${category.slug}`,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    })),
    ...articles.map((article) => ({
      url: `${baseUrl}/haber/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
  ];
}
