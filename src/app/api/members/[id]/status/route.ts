import { requireAuth } from "app/middleware/requireAuth";
import { prisma } from "lib/prisma";
import { NextResponse } from "next/server";
//import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

/**
 * @swagger
 * /api/members/{id}/status:
 *   patch:
 *     summary: Update a member's status
 *     description: Update a member's status
 *     tags:
 *       - Members
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statusId:
 *                 type: integer
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
 *                 fullName:
 *                   type: string
 *                 memberCode:
 *                   type: string
 *                 mobile:
 *                   type: string
 *                 email:
 *                   type: string
 *                 dob:
 *                   type: string
 *                 address:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 pincode:
 *                   type: string
 *                 bankName:
 *                   type: string
 *                 accountNumber:
 *                   type: string
 *                 ifscCode:
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
  //const memberId = Number(id);
  const { statusId } = await req.json();

  const member = await prisma.member.findUnique({
    where: { memberCode:id },
  });

  if (!member) {
    return NextResponse.json({ error: "Member not found" });
  }

  const updated = await prisma.member.update({
    where: { memberCode:id },
    data: { statusId },
  });

  return NextResponse.json(updated);
}
