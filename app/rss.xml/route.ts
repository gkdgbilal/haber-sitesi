import { getLatestArticles } from "@/lib/articles";
import { getSiteSettings } from "@/lib/site-settings";

function escapeXml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const [settings, articles] = await Promise.all([
    getSiteSettings(),
    getLatestArticles({ take: 30 }),
  ]);

  const items = articles
    .map(
      (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${baseUrl}/haber/${article.slug}</link>
      <guid>${baseUrl}/haber/${article.slug}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <pubDate>${article.publishedAt?.toUTCString() ?? ""}</pubDate>
      <category>${escapeXml(article.category.name)}</category>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(settings.siteName)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(settings.tagline)}</description>
    <language>tr</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
