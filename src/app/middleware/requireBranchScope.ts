import { prisma } from "lib/prisma";
import { AuthUser } from "./requireAuth";
//import type { AuthUser } from "@/lib/auth/requireAuth";

export async function requireBranchScope(
  user: AuthUser,
  branchId: number
) {
  // Super Admin has global access
  if (user.role === "Super-Admin") return;

  const hasAccess = await prisma.userBranch.findFirst({
    where: {
      userId: user.userId,
      branchId,
    },
  });

  if (!hasAccess) {
    throw new Error("Forbidden: Branch access denied");
  }
}
