"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { JSONContent } from "@tiptap/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/dashboard/rich-text-editor";
import { articleSchema, type ArticleFormValues } from "@/lib/validation/article";
import { slugify } from "@/lib/slugify";
import { createArticle, updateArticle } from "@/actions/articles";

type Category = { id: string; name: string };
type Tag = { id: string; name: string };

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Taslak",
  SCHEDULED: "Zamanlanmış",
  PUBLISHED: "Yayında",
};

export function ArticleForm({
  categories,
  tags,
  defaultValues,
  articleId,
}: {
  categories: Category[];
  tags: Tag[];
  defaultValues?: Partial<ArticleFormValues>;
  articleId?: string;
}) {
  const router = useRouter();
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues?.slug));

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      contentJson: { type: "doc", content: [] },
      status: "DRAFT",
      categoryId: categories[0]?.id ?? "",
      tagIds: [],
      seoTitle: "",
      seoDescription: "",
      ...defaultValues,
    },
  });

  const selectedTagIds = watch("tagIds");

  function handleTitleChange(value: string) {
    setValue("title", value);
    if (!slugTouched) {
      setValue("slug", slugify(value));
    }
  }

  function toggleTag(id: string) {
    const next = selectedTagIds.includes(id)
      ? selectedTagIds.filter((t) => t !== id)
      : [...selectedTagIds, id];
    setValue("tagIds", next);
  }

  async function onSubmit(values: ArticleFormValues) {
    const payload = JSON.stringify(values);
    const result = articleId
      ? await updateArticle(articleId, payload)
      : await createArticle(payload);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(articleId ? "Haber güncellendi." : "Haber oluşturuldu.");
    router.push("/dashboard/articles");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-1.5">
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                {...register("title")}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
              {errors.title ? <p className="text-sm text-destructive">{errors.title.message}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                {...register("slug")}
                onChange={(e) => {
                  setSlugTouched(true);
                  setValue("slug", e.target.value);
                }}
              />
              {errors.slug ? <p className="text-sm text-destructive">{errors.slug.message}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="excerpt">Spot</Label>
              <Textarea id="excerpt" rows={3} {...register("excerpt")} />
              {errors.excerpt ? <p className="text-sm text-destructive">{errors.excerpt.message}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label>İçerik</Label>
              <Controller
                control={control}
                name="contentJson"
                render={({ field }) => (
                  <RichTextEditor
                    content={field.value as JSONContent}
                    onChange={(json) => field.onChange(json)}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="seoTitle">SEO Başlığı</Label>
              <Input id="seoTitle" {...register("seoTitle")} placeholder="Boş bırakılırsa başlık kullanılır" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="seoDescription">SEO Açıklaması</Label>
              <Textarea
                id="seoDescription"
                rows={2}
                {...register("seoDescription")}
                placeholder="Boş bırakılırsa spot kullanılır"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Yayın</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Durum</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue>{(value: string) => STATUS_LABELS[value] ?? value}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Taslak</SelectItem>
                      <SelectItem value="SCHEDULED">Zamanlanmış</SelectItem>
                      <SelectItem value="PUBLISHED">Yayında</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="coverImageUrl">Kapak Görseli URL</Label>
              <Input id="coverImageUrl" {...register("coverImageUrl")} placeholder="https://..." />
            </div>

            <div className="space-y-1.5">
              <Label>Kategori</Label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {(value: string) => categories.find((c) => c.id === value)?.name ?? "Kategori seçin"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId ? (
                <p className="text-sm text-destructive">{errors.categoryId.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label>Etiketler</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const active = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      type="button"
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={
                        "rounded-full border px-3 py-1 text-xs transition-colors " +
                        (active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-transparent text-muted-foreground hover:bg-muted")
                      }
                    >
                      {tag.name}
                    </button>
                  );
                })}
                {tags.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Henüz etiket yok.</p>
                ) : null}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Kaydediliyor..." : articleId ? "Güncelle" : "Oluştur"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
