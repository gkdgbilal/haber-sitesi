import { listTags } from "@/actions/categories";
import { TagManager } from "@/components/dashboard/tag-manager";

export default async function DashboardTagsPage() {
  const tags = await listTags();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Etiketler</h1>
      <TagManager tags={tags} />
    </div>
  );
}
