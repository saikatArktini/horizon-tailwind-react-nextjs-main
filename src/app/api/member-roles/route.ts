import { requireAuth } from "app/middleware/requireAuth";
import { prisma } from "lib/prisma";
import { NextResponse } from "next/server";
//import { prisma } from "@/lib/prisma";

/**
 * @swagger
 * /api/member-roles:
 *   get:
 *     summary: Get all member roles
 *     description: Get all member roles
 *     tags:
 *       - Member Roles
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
export async function GET(req: Request) {
  const user = requireAuth(req);
          console.log("42",user);
          if (!user) {
            return NextResponse.json(
              { message: "Unauthorized" },
              { status: 401 }
            );
          }
  return NextResponse.json(
    await prisma.memberRole.findMany({ orderBy: { name: "asc" } })
  );
}

/**
 * @swagger
 * /api/member-roles:
 *   post:
 *     summary: Create a new member role
 *     description: Create a new member role
 *     tags:
 *       - Member Roles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function POST(req: Request) {
  const user = requireAuth(req);
        console.log("42",user);
        if (!user) {
          return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
          );
        }
  const { name } = await req.json();

  if (name !== "Member") {
    return NextResponse.json(
      { error: "Only 'Member' role is allowed" },
      { status: 400 }
    );
  }

  const exists = await prisma.memberRole.findUnique({ where: { name } });
  if (exists) {
    return NextResponse.json({ error: "Role already exists" }, { status: 409 });
  }

  const role = await prisma.memberRole.create({ data: { name } });
  return NextResponse.json(role, { status: 201 });
}
