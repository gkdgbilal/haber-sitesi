import Link from "next/link";
import { Search, Menu } from "lucide-react";
import type { Category } from "@prisma/client";

export function SiteHeader({
  siteName,
  categories,
  breakingTitle,
}: {
  siteName: string;
  categories: Category[];
  breakingTitle?: string | null;
}) {
  const today = new Intl.DateTimeFormat("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="border-b border-site-border bg-site-bg text-site-ink">
      {breakingTitle ? (
        <div className="flex items-center gap-3 bg-site-accent px-4 py-2 text-site-accent-foreground">
          <span className="shrink-0 rounded-sm bg-site-accent-foreground/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
            Son Dakika
          </span>
          <p className="truncate text-sm font-medium">{breakingTitle}</p>
        </div>
      ) : null}

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-xs text-site-ink-muted">
        <span className="capitalize">{today}</span>
        <Link href="/ara" className="flex items-center gap-1.5 hover:text-site-accent">
          <Search className="size-3.5" />
          Ara
        </Link>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-4">
        <Link
          href="/"
          className="font-display text-4xl font-bold tracking-tight text-site-ink sm:text-5xl"
        >
          {siteName}
        </Link>
      </div>

      <nav className="border-t border-site-border">
        <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4">
          <span className="flex items-center gap-1 py-3 pr-3 text-site-ink-muted">
            <Menu className="size-4" />
          </span>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/kategori/${category.slug}`}
              className="shrink-0 px-3 py-3 text-sm font-semibold uppercase tracking-wide text-site-ink transition-colors hover:text-site-accent"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
