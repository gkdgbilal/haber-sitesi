import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getArticleBySlug, getLatestArticles, incrementViewCount } from "@/lib/articles";
import { getSiteSettings } from "@/lib/site-settings";
import { renderArticleHtml } from "@/lib/render-content";
import { ArticleRow } from "@/components/site/article-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      images: article.coverImageUrl ? [{ url: article.coverImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  incrementViewCount(article.id).catch(() => {});

  const [related, settings] = await Promise.all([
    getLatestArticles({ excludeId: article.id, categorySlug: article.category.slug, take: 4 }),
    getSiteSettings(),
  ]);

  const html = renderArticleHtml(article.contentJson);
  const url = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/haber/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.coverImageUrl ? [article.coverImageUrl] : undefined,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: [{ "@type": "Person", name: article.author.name }],
    publisher: {
      "@type": "Organization",
      name: settings.siteName,
      logo: settings.logoUrl ? { "@type": "ImageObject", url: settings.logoUrl } : undefined,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        <Link
          href={`/kategori/${article.category.slug}`}
          className="text-xs font-bold uppercase tracking-wider text-site-accent"
        >
          {article.category.name}
        </Link>
        <h1 className="mt-2 text-balance font-display text-4xl font-bold leading-[1.1] text-site-ink">
          {article.title}
        </h1>
        <p className="mt-3 text-lg text-site-ink-muted">{article.excerpt}</p>

        <div className="mt-4 flex items-center gap-3 border-y border-site-border py-3 text-sm text-site-ink-muted">
          <span className="font-medium text-site-ink">{article.author.name}</span>
          <span>·</span>
          <span>
            {article.publishedAt
              ? new Intl.DateTimeFormat("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(article.publishedAt)
              : null}
          </span>
        </div>

        {article.coverImageUrl ? (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-md bg-site-card">
            <Image
              src={article.coverImageUrl}
              alt={article.title}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div
          className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-headings:font-display prose-a:text-site-accent"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {article.tags.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-2 border-t border-site-border pt-6">
            {article.tags.map(({ tag }) => (
              <span
                key={tag.id}
                className="rounded-full border border-site-border px-3 py-1 text-xs text-site-ink-muted"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {related.length > 0 ? (
        <section className="mx-auto mt-14 max-w-3xl border-t border-site-border pt-8">
          <h2 className="font-display text-xl font-bold text-site-ink">İlgili Haberler</h2>
          <div className="mt-2 divide-y divide-site-border">
            {related.map((item) => (
              <ArticleRow key={item.id} article={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
