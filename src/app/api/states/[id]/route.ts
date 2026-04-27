import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { requireAuth } from "app/middleware/requireAuth";

type Params = { params: Promise<{ id: string }> };

/**
 * @swagger
 * /api/states/{id}:
 *   patch:
 *     summary: Update a state
 *     description: Update a state
 *     tags:
 *       - States
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
 *         description: State not found
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
  const stateId = Number(id);
  const { name } = await req.json();

  const existing = await prisma.state.findUnique({
    where: { id: stateId },
  });

  if (!existing) {
    return NextResponse.json({ error: "State not found" }, { status: 404 });
  }

  const updated = await prisma.state.update({
    where: { id: stateId },
    data: { name },
  });

  return NextResponse.json(updated);
}
