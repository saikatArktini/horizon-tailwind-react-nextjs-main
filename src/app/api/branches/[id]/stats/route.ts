import { requireAuth } from "app/middleware/requireAuth";
import { prisma } from "lib/prisma";
import { NextResponse } from "next/server";
//import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

/**
 * @swagger
 * /api/branches/{id}/stats:
 *   get:
 *     summary: Get branch statistics
 *     description: Get branch statistics
 *     tags:
 *       - Branches
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalMembers:
 *                   type: integer
 *                 activeMembers:
 *                   type: integer
 *                 inactiveMembers:
 *                   type: integer
 */
export async function GET(req: Request, { params }: Params) {
  const user = requireAuth(req);
          console.log("42",user);
          if (!user) {
            return NextResponse.json(
              { message: "Unauthorized" },
              { status: 401 }
            );
          }
  const { id } =await params;
  const branchId = Number(id);

  const [total, active, inactive] = await Promise.all([
    prisma.member.count({ where: { branchId } }),
    prisma.member.count({
      where: {
        branchId,
        status: { name: "Active" },
      },
    }),
    prisma.member.count({
      where: {
        branchId,
        status: { name: "Inactive" },
      },
    }),
  ]);

  return NextResponse.json({
    totalMembers: total,
    activeMembers: active,
    inactiveMembers: inactive,
  });
}
