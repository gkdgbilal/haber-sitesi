import { z } from "zod";

export const slugSchema = z
  .string()
  .min(1, "Slug gerekli.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir.");

export const articleSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı.").max(200),
  slug: slugSchema,
  excerpt: z.string().min(10, "Spot en az 10 karakter olmalı.").max(400),
  contentJson: z.record(z.string(), z.unknown()),
  coverImageUrl: z.string().url().optional().or(z.literal("")).optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED"]),
  publishedAt: z.date().optional().nullable(),
  categoryId: z.string().min(1, "Kategori seçin."),
  tagIds: z.array(z.string()),
  seoTitle: z.string().max(70).optional().or(z.literal("")),
  seoDescription: z.string().max(160).optional().or(z.literal("")),
}).superRefine((data, ctx) => {
  if (data.status === "SCHEDULED" && !data.publishedAt) {
    ctx.addIssue({
      code: "custom",
      path: ["publishedAt"],
      message: "Zamanlanmış yayın için tarih/saat gerekli.",
    });
  }
});

export type ArticleFormValues = z.infer<typeof articleSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Kategori adı en az 2 karakter olmalı.").max(80),
  slug: slugSchema,
  parentId: z.string().optional().nullable(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const tagSchema = z.object({
  name: z.string().min(2, "Etiket adı en az 2 karakter olmalı.").max(50),
  slug: slugSchema,
});

export type TagFormValues = z.infer<typeof tagSchema>;
