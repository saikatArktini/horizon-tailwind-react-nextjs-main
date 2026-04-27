import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { requireAuth } from "app/middleware/requireAuth";

/**
 * @swagger
 * /api/member-statuses:
 *   get:
 *     summary: List all member statuses
 *     description: List all member statuses
 *     tags:
 *       - Member Statuses
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
    await prisma.memberStatus.findMany({ orderBy: { name: "asc" } })
  );
}

/**
 * @swagger
 * /api/member-statuses:
 *   post:
 *     summary: Create a new member status
 *     description: Create a new member status
 *     tags:
 *       - Member Statuses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 enum:
 *                   - Active
 *                   - Inactive
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

  if (!["Active", "Inactive"].includes(name)) {
    return NextResponse.json(
      { error: "Status must be Active or Inactive" },
      { status: 400 }
    );
  }

  const exists = await prisma.memberStatus.findUnique({ where: { name } });
  if (exists) {
    return NextResponse.json({ error: "Status already exists" }, { status: 409 });
  }

  const status = await prisma.memberStatus.create({ data: { name } });
  return NextResponse.json(status, { status: 201 });
}
