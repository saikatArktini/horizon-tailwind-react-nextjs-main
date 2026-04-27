//import type { AuthUser } from "@/lib/auth/requireAuth";

import { AuthUser } from "./requireAuth";

export function requirePermission(
  user: AuthUser,
  permissionCode: string
) {
  if (!user.permissions.includes(permissionCode)) {
    console.log("10");
    throw new Error("Forbidden: Permission denied");
  }

  return user;
}
