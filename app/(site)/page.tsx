import { getFeaturedArticle, getLatestArticles, getArticlesByCategoryGrouped } from "@/lib/articles";
import { ArticleHero, ArticleRow, ArticleGridCard } from "@/components/site/article-card";

export default async function HomePage() {
  const featured = await getFeaturedArticle();
  const [latest, groups] = await Promise.all([
    getLatestArticles({ excludeId: featured?.id, take: 5 }),
    getArticlesByCategoryGrouped(4),
  ]);

  if (!featured) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center text-site-ink-muted">
        Henüz yayınlanmış haber yok.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-14 px-4 py-8">
      <section className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ArticleHero article={featured} />
        </div>
        <div className="divide-y divide-site-border lg:border-l lg:border-site-border lg:pl-8">
          {latest.map((article) => (
            <ArticleRow key={article.id} article={article} />
          ))}
        </div>
      </section>

      {groups.map(({ category, articles }) => (
        <section key={category.id}>
          <div className="mb-5 flex items-baseline justify-between border-b border-site-accent pb-2">
            <h2 className="font-display text-2xl font-bold text-site-ink">{category.name}</h2>
            <a
              href={`/kategori/${category.slug}`}
              className="text-sm font-medium text-site-accent hover:underline"
            >
              Tümünü gör
            </a>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((article) => (
              <ArticleGridCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
