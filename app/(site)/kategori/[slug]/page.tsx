import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug, getLatestArticles } from "@/lib/articles";
import { ArticleGridCard } from "@/components/site/article-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: `${category.name} kategorisindeki en güncel haberler.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const articles = await getLatestArticles({ categorySlug: slug, take: 24 });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="border-b border-site-accent pb-3 font-display text-3xl font-bold text-site-ink">
        {category.name}
      </h1>

      {articles.length === 0 ? (
        <p className="mt-8 text-site-ink-muted">Bu kategoride henüz haber yok.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article) => (
            <ArticleGridCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
