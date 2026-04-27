import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { requireAuth } from "app/middleware/requireAuth";

/* =========================
   GET ALL BRANCH LEVELS
   ========================= */

/**
 * @swagger
 * /api/branch-levels:
 *   get:
 *     summary: List all branch levels
 *     description: Returns all branch levels (Auth required)
 *     tags:
 *       - Branch Levels
 *     security:
 *       - bearerAuth: []
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
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *       401:
 *         description: Unauthorized
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

  const levels = await prisma.branchLevel.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(levels);
}

/* =========================
   CREATE BRANCH LEVEL
   ========================= */

/**
 * @swagger
 * /api/branch-levels:
 *   post:
 *     summary: Create a new branch level
 *     description: Create branch level (Auth required)
 *     tags:
 *       - Branch Levels
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Branch level created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Conflict
 */
export async function POST(req: Request) {
  const user = requireAuth(req);

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { name } = await req.json();

  if (!name) {
    return NextResponse.json(
      { error: "Name required" },
      { status: 400 }
    );
  }

  const exists = await prisma.branchLevel.findUnique({
    where: { name },
  });

  if (exists) {
    return NextResponse.json(
      { error: "Branch level already exists" },
      { status: 409 }
    );
  }

  const level = await prisma.branchLevel.create({
    data: { name },
  });

  return NextResponse.json(level, { status: 201 });
}
