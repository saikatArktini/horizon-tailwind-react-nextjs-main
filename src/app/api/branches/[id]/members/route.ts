import { requireAuth } from "app/middleware/requireAuth";
import { prisma } from "lib/prisma";
import { NextResponse } from "next/server";
//import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

/**
 * @swagger
 * /api/branches/{id}/members:
 *   get:
 *     summary: Get all members of a branch
 *     description: Get all members of a branch
 *     tags:
 *       - Members
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
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   fullName:
 *                     type: string
 *                   memberCode:
 *                     type: string
 *                   referenceMember:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       fullName:
 *                         type: string
 *                       memberCode:
 *                         type: string
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


  const members = await prisma.member.findMany({
    where: { branchId },
    include: {
      memberRole: true,
      status: true,
      referenceMember: {
        select: { id: true, fullName: true, memberCode: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(members);
}
