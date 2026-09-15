import { getSiteSettings } from "@/lib/site-settings";
import { getAllCategories, getFeaturedArticle } from "@/lib/articles";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories, breaking] = await Promise.all([
    getSiteSettings(),
    getAllCategories(),
    getFeaturedArticle(),
  ]);

  return (
    <div
      className="flex min-h-full flex-1 flex-col bg-site-bg"
      style={{ "--site-accent": settings.themeColor } as React.CSSProperties}
    >
      <SiteHeader
        siteName={settings.siteName}
        categories={categories}
        breakingTitle={breaking?.title}
      />
      <div className="flex-1">{children}</div>
      <SiteFooter
        siteName={settings.siteName}
        tagline={settings.tagline}
        contactEmail={settings.contactEmail}
        twitterUrl={settings.twitterUrl}
        facebookUrl={settings.facebookUrl}
        instagramUrl={settings.instagramUrl}
        categories={categories}
      />
    </div>
  );
}
