import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/current-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleStatus } from "@prisma/client";

export default async function DashboardPage() {
  const user = await requireUser();

  const [published, draft, categoryCount, totalViews] = await Promise.all([
    prisma.article.count({ where: { status: ArticleStatus.PUBLISHED } }),
    prisma.article.count({ where: { status: ArticleStatus.DRAFT } }),
    prisma.category.count(),
    prisma.article.aggregate({ _sum: { viewCount: true } }),
  ]);

  const stats = [
    { label: "Yayındaki Haber", value: published },
    { label: "Taslak", value: draft },
    { label: "Kategori", value: categoryCount },
    { label: "Toplam Görüntülenme", value: totalViews._sum.viewCount ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Merhaba, {user.name}</h1>
        <p className="text-sm text-muted-foreground">Site içeriğinizi buradan yönetin.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tabular-nums">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
