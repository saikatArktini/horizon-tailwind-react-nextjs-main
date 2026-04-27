import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { requireAuth } from "app/middleware/requireAuth";

type Params = { params: Promise<{ id: string }> };

/**
 * @swagger
 * /api/member-statuses/{id}:
 *   patch:
 *     summary: Update a member status
 *     description: Update a member status
 *     tags:
 *       - Member Statuses
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
 *                 enum:
 *                   - Active
 *                   - Inactive
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
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Status not found
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
  const { id } =await params;
  const memberStatusId = Number(id);
  const { name } = await req.json();

  if (!["Active", "Inactive"].includes(name)) {
    return NextResponse.json(
      { error: "Invalid status value" },
      { status: 400 }
    );
  }

  const exists = await prisma.memberStatus.findUnique({ where: { id: memberStatusId } });
  if (!exists) {
    return NextResponse.json({ error: "Status not found" }, { status: 404 });
  }

  const updated = await prisma.memberStatus.update({
    where: { id: memberStatusId },
    data: { name },
  });

  return NextResponse.json(updated);
}
