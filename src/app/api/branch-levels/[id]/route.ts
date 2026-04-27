import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { requireAuth } from "app/middleware/requireAuth";

type Params = { params: Promise<{ id: string }> };

/**
 * @swagger
 * /api/branch-levels/{id}:
 *   patch:
 *     summary: Update a branch level
 *     description: Update a branch level
 *     tags:
 *       - Branch Levels
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       404:
 *         description: Branch level not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function PATCH(req: Request, { params }: Params) {
  const user = requireAuth(req);
    console.log("42",user);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
  
  const { id } = await params;
  const branchLevelId = Number(id);
  const { name } = await req.json();

  const existing = await prisma.branchLevel.findUnique({
    where: { id: branchLevelId },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Branch level not found" },
      { status: 404 }
    );
  }

  const updated = await prisma.branchLevel.update({
    where: { id: branchLevelId },
    data: { name },
  });

  return NextResponse.json(updated);
}
