import Link from "next/link";
import Image from "next/image";
import type { ArticleCard as ArticleCardType } from "@/lib/articles";

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long" }).format(date);
}

export function ArticleHero({ article }: { article: ArticleCardType }) {
  return (
    <Link href={`/haber/${article.slug}`} className="group block">
      <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-site-card sm:aspect-[16/8]">
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            priority
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-site-ink-muted">
            <span className="font-display text-lg">{article.category.name}</span>
          </div>
        )}
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-site-accent">
        {article.category.name}
      </p>
      <h1 className="mt-1 text-balance font-display text-3xl font-bold leading-[1.1] text-site-ink transition-colors group-hover:text-site-accent sm:text-4xl">
        {article.title}
      </h1>
      <p className="mt-2 max-w-2xl text-base text-site-ink-muted">{article.excerpt}</p>
      <p className="mt-2 text-xs text-site-ink-muted">{formatDate(article.publishedAt)}</p>
    </Link>
  );
}

export function ArticleRow({ article }: { article: ArticleCardType }) {
  return (
    <Link href={`/haber/${article.slug}`} className="group flex gap-3 py-3">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-sm bg-site-card">
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-site-accent">
          {article.category.name}
        </p>
        <h3 className="text-balance font-display text-base font-semibold leading-tight text-site-ink group-hover:text-site-accent">
          {article.title}
        </h3>
      </div>
    </Link>
  );
}

export function ArticleGridCard({ article }: { article: ArticleCardType }) {
  return (
    <Link href={`/haber/${article.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-site-card">
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : null}
      </div>
      <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-site-accent">
        {article.category.name}
      </p>
      <h3 className="mt-1 text-balance font-display text-lg font-semibold leading-snug text-site-ink group-hover:text-site-accent">
        {article.title}
      </h3>
      <p className="mt-1 text-xs text-site-ink-muted">{formatDate(article.publishedAt)}</p>
    </Link>
  );
}
