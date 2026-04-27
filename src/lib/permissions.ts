import { NextResponse } from "next/server";

export function requirePermission(
  user: any,
  permission: string
) {
  if (!user.permissions.includes(permission)) {
    return NextResponse.json(
      { message: "Forbidden" },
      { status: 403 }
    );
  }
}
