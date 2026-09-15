"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteArticle } from "@/actions/articles";
import { Pencil, Trash2 } from "lucide-react";

type Row = {
  id: string;
  title: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED";
  category: { name: string };
  author: { name: string };
  createdAt: Date;
};

const STATUS_LABEL: Record<Row["status"], string> = {
  DRAFT: "Taslak",
  SCHEDULED: "Zamanlanmış",
  PUBLISHED: "Yayında",
};

export function ArticleList({ articles }: { articles: Row[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!window.confirm("Bu haberi silmek istediğinize emin misiniz?")) return;
    const result = await deleteArticle(id);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Haber silindi.");
    router.refresh();
  }

  if (articles.length === 0) {
    return <p className="text-sm text-muted-foreground">Henüz haber yok.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Başlık</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead>Yazar</TableHead>
          <TableHead>Durum</TableHead>
          <TableHead className="text-right">İşlemler</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article) => (
          <TableRow key={article.id}>
            <TableCell className="font-medium">{article.title}</TableCell>
            <TableCell>{article.category.name}</TableCell>
            <TableCell>{article.author.name}</TableCell>
            <TableCell>
              <Badge variant={article.status === "PUBLISHED" ? "default" : "outline"}>
                {STATUS_LABEL[article.status]}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                render={
                  <Link href={`/dashboard/articles/${article.id}/edit`}>
                    <Pencil className="size-4" />
                  </Link>
                }
              />
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-destructive hover:text-destructive"
                onClick={() => handleDelete(article.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
