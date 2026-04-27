import { requireAuth } from "app/middleware/requireAuth";
import { prisma } from "lib/prisma";
import { NextResponse } from "next/server";
//import { requireAuth } from "@/lib/requireAuth";
//import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const user = requireAuth(req);

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  // Role-based access
  if (user.role !== "Super-Admin") {
    return NextResponse.json(
      { message: "Forbidden" },
      { status: 403 }
    );
  }

  const users = await prisma.user.findMany();

  return NextResponse.json(users);
}
