import { notFound } from "next/navigation";
import { getArticleForEdit } from "@/actions/articles";
import { listCategories, listTags } from "@/actions/categories";
import { ArticleForm } from "@/components/dashboard/article-form";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [article, categories, tags] = await Promise.all([
    getArticleForEdit(id),
    listCategories(),
    listTags(),
  ]);

  if (!article) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Haberi Düzenle</h1>
      <ArticleForm
        articleId={article.id}
        categories={categories}
        tags={tags}
        defaultValues={{
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          contentJson: article.contentJson as never,
          coverImageUrl: article.coverImageUrl ?? "",
          status: article.status,
          publishedAt: article.publishedAt,
          categoryId: article.categoryId,
          tagIds: article.tags.map((t) => t.tagId),
          seoTitle: article.seoTitle ?? "",
          seoDescription: article.seoDescription ?? "",
        }}
      />
    </div>
  );
}
