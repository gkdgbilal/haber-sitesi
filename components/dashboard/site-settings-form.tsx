"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateSiteSettings } from "@/actions/site-settings";

type Values = {
  siteName: string;
  tagline: string;
  themeColor: string;
  contactEmail: string;
  twitterUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  googleAnalyticsId: string;
  googleAdsId: string;
};

export function SiteSettingsForm({ defaultValues }: { defaultValues: Values }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Values>({ defaultValues });

  async function onSubmit(values: Values) {
    await updateSiteSettings(values);
    toast.success("Site ayarları güncellendi.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kimlik</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="siteName">Site Adı</Label>
            <Input id="siteName" {...register("siteName")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tagline">Slogan</Label>
            <Textarea id="tagline" rows={2} {...register("tagline")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="themeColor">Tema Rengi</Label>
            <div className="flex items-center gap-2">
              <Input id="themeColor" type="color" className="h-10 w-16 p-1" {...register("themeColor")} />
              <Input {...register("themeColor")} className="flex-1" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contactEmail">İletişim E-postası</Label>
            <Input id="contactEmail" type="email" {...register("contactEmail")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sosyal Medya & Reklam</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="twitterUrl">X / Twitter</Label>
            <Input id="twitterUrl" {...register("twitterUrl")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="facebookUrl">Facebook</Label>
            <Input id="facebookUrl" {...register("facebookUrl")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="instagramUrl">Instagram</Label>
            <Input id="instagramUrl" {...register("instagramUrl")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
            <Input id="googleAnalyticsId" {...register("googleAnalyticsId")} placeholder="G-XXXXXXX" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="googleAdsId">Google Ads ID</Label>
            <Input id="googleAdsId" {...register("googleAdsId")} placeholder="AW-XXXXXXX" />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
      </Button>
    </form>
  );
}
