import Link from "next/link";
import { listArticlesForDashboard } from "@/actions/articles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArticleList } from "@/components/dashboard/article-list";
import { Plus } from "lucide-react";

export default async function DashboardArticlesPage() {
  const articles = await listArticlesForDashboard();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Haberler</h1>
        <Button
          render={
            <Link href="/dashboard/articles/new">
              <Plus className="size-4" />
              Yeni Haber
            </Link>
          }
        />
      </div>
      <Card>
        <CardContent className="pt-6">
          <ArticleList articles={articles} />
        </CardContent>
      </Card>
    </div>
  );
}
