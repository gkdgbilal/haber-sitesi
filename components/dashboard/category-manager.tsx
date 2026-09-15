"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { categorySchema, type CategoryFormValues } from "@/lib/validation/article";
import { slugify } from "@/lib/slugify";
import { createCategory, deleteCategory } from "@/actions/categories";
import { Trash2 } from "lucide-react";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  _count: { articles: number };
};

export function CategoryManager({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [slugTouched, setSlugTouched] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema) });

  async function onSubmit(values: CategoryFormValues) {
    const result = await createCategory(values);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Kategori eklendi.");
    reset({ name: "", slug: "" });
    setSlugTouched(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    const result = await deleteCategory(id);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Kategori silindi.");
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 lg:col-span-1">
        <div className="space-y-1.5">
          <Label htmlFor="cat-name">Ad</Label>
          <Input
            id="cat-name"
            {...register("name")}
            onChange={(e) => {
              setValue("name", e.target.value);
              if (!slugTouched) setValue("slug", slugify(e.target.value));
            }}
          />
          {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cat-slug">Slug</Label>
          <Input
            id="cat-slug"
            {...register("slug")}
            onChange={(e) => {
              setSlugTouched(true);
              setValue("slug", e.target.value);
            }}
          />
          {errors.slug ? <p className="text-sm text-destructive">{errors.slug.message}</p> : null}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Ekleniyor..." : "Kategori Ekle"}
        </Button>
      </form>

      <div className="lg:col-span-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Haber Sayısı</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                <TableCell>{category._count.articles}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
