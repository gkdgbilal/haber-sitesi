import Link from "next/link";
import { requireUser } from "@/lib/current-user";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { SignOutButton } from "@/components/dashboard/sign-out-button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r bg-muted/20 p-4 md:flex md:flex-col">
        <Link href="/dashboard" className="mb-6 px-2 text-lg font-bold tracking-tight">
          Yönetim Paneli
        </Link>
        <DashboardNav role={user.role} />
        <div className="mt-auto space-y-2 border-t pt-4">
          <p className="px-2 text-xs text-muted-foreground">{user.name}</p>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
