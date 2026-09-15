import { listCategories, listTags } from "@/actions/categories";
import { ArticleForm } from "@/components/dashboard/article-form";

export default async function NewArticlePage() {
  const [categories, tags] = await Promise.all([listCategories(), listTags()]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Yeni Haber</h1>
      <ArticleForm categories={categories} tags={tags} />
    </div>
  );
}
