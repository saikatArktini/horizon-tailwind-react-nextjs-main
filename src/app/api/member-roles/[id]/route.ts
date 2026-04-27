import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { requireAuth } from "app/middleware/requireAuth";

type Params = { params: Promise<{ id: string }> };

/**
 * @swagger
 * /api/member-roles/{id}:
 *   patch:
 *     summary: Update a member role
 *     description: Update a member role
 *     tags:
 *       - Member Roles
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
 *         description: Role not found
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
  //const id = Number(params.id);
  const { id } =await params;
  const memberRoleId = Number(id);
  const { name } = await req.json();

  if (name !== "Member") {
    return NextResponse.json(
      { error: "Only 'Member' role is allowed" },
      { status: 400 }
    );
  }

  const exists = await prisma.memberRole.findUnique({ where: { id: memberRoleId } });
  if (!exists) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  const updated = await prisma.memberRole.update({
    where: { id: memberRoleId },
    data: { name },
  });

  return NextResponse.json(updated);
}
