import "server-only";
import { auth } from "@/lib/auth";
import type { UserRole } from "@prisma/client";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Oturum açmanız gerekiyor.");
  }
  return session.user;
}

export async function requireRole(allowed: UserRole[]) {
  const user = await requireUser();
  if (!allowed.includes(user.role)) {
    throw new Error("Bu işlem için yetkiniz yok.");
  }
  return user;
}
