"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { tagSchema, type TagFormValues } from "@/lib/validation/article";
import { slugify } from "@/lib/slugify";
import { createTag } from "@/actions/categories";

export function TagManager({ tags }: { tags: { id: string; name: string }[] }) {
  const router = useRouter();
  const [slugTouched, setSlugTouched] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TagFormValues>({ resolver: zodResolver(tagSchema) });

  async function onSubmit(values: TagFormValues) {
    const result = await createTag(values);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Etiket eklendi.");
    reset({ name: "", slug: "" });
    setSlugTouched(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="tag-name">Ad</Label>
          <Input
            id="tag-name"
            {...register("name")}
            onChange={(e) => {
              setValue("name", e.target.value);
              if (!slugTouched) setValue("slug", slugify(e.target.value));
            }}
          />
          {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tag-slug">Slug</Label>
          <Input
            id="tag-slug"
            {...register("slug")}
            onChange={(e) => {
              setSlugTouched(true);
              setValue("slug", e.target.value);
            }}
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Ekleniyor..." : "Etiket Ekle"}
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag.id} variant="secondary">
            {tag.name}
          </Badge>
        ))}
        {tags.length === 0 ? <p className="text-sm text-muted-foreground">Henüz etiket yok.</p> : null}
      </div>
    </div>
  );
}
