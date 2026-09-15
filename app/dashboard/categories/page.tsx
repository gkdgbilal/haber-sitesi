import { listCategories } from "@/actions/categories";
import { CategoryManager } from "@/components/dashboard/category-manager";

export default async function DashboardCategoriesPage() {
  const categories = await listCategories();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Kategoriler</h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
