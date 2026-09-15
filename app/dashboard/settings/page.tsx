import { getSiteSettings } from "@/lib/site-settings";
import { SiteSettingsForm } from "@/components/dashboard/site-settings-form";

export default async function DashboardSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Site Ayarları</h1>
      <SiteSettingsForm
        defaultValues={{
          siteName: settings.siteName,
          tagline: settings.tagline,
          themeColor: settings.themeColor,
          contactEmail: settings.contactEmail ?? "",
          twitterUrl: settings.twitterUrl ?? "",
          facebookUrl: settings.facebookUrl ?? "",
          instagramUrl: settings.instagramUrl ?? "",
          googleAnalyticsId: settings.googleAnalyticsId ?? "",
          googleAdsId: settings.googleAdsId ?? "",
        }}
      />
    </div>
  );
}
