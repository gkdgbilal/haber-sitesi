"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Newspaper, FolderTree, Tags, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@prisma/client";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Genel Bakış", icon: LayoutDashboard, roles: ["ADMIN", "EDITOR", "AUTHOR"] },
  { href: "/dashboard/articles", label: "Haberler", icon: Newspaper, roles: ["ADMIN", "EDITOR", "AUTHOR"] },
  { href: "/dashboard/categories", label: "Kategoriler", icon: FolderTree, roles: ["ADMIN", "EDITOR"] },
  { href: "/dashboard/tags", label: "Etiketler", icon: Tags, roles: ["ADMIN", "EDITOR"] },
  { href: "/dashboard/settings", label: "Site Ayarları", icon: Settings, roles: ["ADMIN"] },
] as const;

export function DashboardNav({ role }: { role: UserRole }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {NAV_ITEMS.filter((item) => (item.roles as readonly string[]).includes(role)).map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
