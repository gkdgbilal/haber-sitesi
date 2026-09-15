import { searchArticles } from "@/lib/articles";
import { ArticleGridCard } from "@/components/site/article-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchArticles(query) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-site-ink">Ara</h1>

      <form method="GET" className="relative mt-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-site-ink-muted" />
        <Input
          name="q"
          defaultValue={query}
          placeholder="Haber ara..."
          className="pl-9"
          autoFocus
        />
      </form>

      {query ? (
        <p className="mt-4 text-sm text-site-ink-muted">
          &ldquo;{query}&rdquo; için {results.length} sonuç bulundu.
        </p>
      ) : null}

      {results.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((article) => (
            <ArticleGridCard key={article.id} article={article} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
