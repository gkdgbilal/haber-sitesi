"use server";

import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/current-user";

export async function updateSiteSettings(input: {
  siteName: string;
  tagline: string;
  themeColor: string;
  contactEmail?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  googleAnalyticsId?: string;
  googleAdsId?: string;
}) {
  await requireRole([UserRole.ADMIN]);

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: input,
    create: { id: "singleton", ...input },
  });

  revalidatePath("/", "layout");
  return { success: true as const };
}
