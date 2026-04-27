//import { prisma } from "lib/prisma";
import { requireAuth } from "app/middleware/requireAuth";
import { prisma } from "lib/prisma";
import { NextResponse } from "next/server";
//import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };


/**
 * @swagger
 * /api/members/{id}/referrals:
 *   get:
 *     summary: Get all referrals of a member
 *     description: Get all referrals of a member
 *     tags:
 *       - Members
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *                   createdAt:
 *                     type: string
 *       404:
 *         description: No referrals found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
  const { id } = await params;
  //const memberId = Number(id);
  const referrals = await prisma.member.findMany({
    where: { memberCode: id },
    select: {
      id: true,
      fullName: true,
      memberCode: true,
      createdAt: true,
    },
  });
  //console.log("62",referrals);
  if (referrals.length === 0) {
    return NextResponse.json({ message: "No referrals found" }, { status: 404 });
  }
  return NextResponse.json(referrals);
}
