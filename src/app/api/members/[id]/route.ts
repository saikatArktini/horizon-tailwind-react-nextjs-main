import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { requireAuth } from "app/middleware/requireAuth";

type Params = { params: { id: string } };

/**
 * GET MEMBER BY ID
 */

/**
 * @swagger
 * /api/members/{id}:
 *   get:
 *     summary: Get a member by ID
 *     description: Get a member by ID
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
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 memberCode:
 *                   type: string
 *                 fullName:
 *                   type: string
 *                 mobile:
 *                   type: string
 *                 email:
 *                   type: string
 *                 dob:
 *                   type: string
 *                 genderId:
 *                   type: integer
 *                 aadhaarNumber:
 *                   type: string
 *                 panNumber:
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
 *                 branchId:
 *                   type: integer
 *                 branchName:
 *                   type: string
 *                 branchCode:
 *                   type: string
 *                 referenceMemberId:
 *                   type: integer
 *                 referenceMemberName:
 *                   type: string
 *                 referenceMemberCode:
 *                   type: string
 *       404:
 *         description: Member not found
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
  const { id } =await params;
  //const idNumber = Number(id);
  const memberCode = id;
  const member = await prisma.member.findUnique({
    where: { memberCode },
    include: {
      branch: true,
      gender: true,
      memberRole: true,
      status: true,
      referenceMember: {
        select: { id: true, fullName: true, memberCode: true },
      },
    },
  });

  if (!member) {
    return NextResponse.json({ message: "Member not found" }, { status: 404 });
  }

  return NextResponse.json(member);
}

/**
 * UPDATE MEMBER
 */

/**
 * UPDATE MEMBER
 *
 * @swagger
 * /api/members/{id}:
 *   put:
 *     summary: Update a member
 *     description: Update a member
 *     tags:
 *       - Members
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
 *               fullName:
 *                 type: string
 *               mobile:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               pincode:
 *                 type: string
 *               bankName:
 *                 type: string
 *               accountNumber:
 *                 type: string
 *               ifscCode:
 *                 type: string
 *               commissionPercent:
 *                 type: number
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
 *                 mobile:
 *                   type: string
 *                 email:
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
 *                 commissionPercent:
 *                   type: number
 *       404:
 *         description: Member not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
 export async function PUT(req: Request, { params }: Params) {
  const user = requireAuth(req);
        console.log("42",user);
        if (!user) {
          return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
          );
        }
  try {
    const { id } =await params;

  const idNumber = Number(id);
  //const memberCode = id;
  //console.log("207",memberCode);
    const body = await req.json();

    const updated = await prisma.member.update({
      where: { id: idNumber },
      data: {
        // BASIC
        fullName: body.fullName,
        mobile: body.mobile,
        email: body.email,

        genderId: Number(body.genderId),
        memberRoleId: Number(body.memberRoleId),
        statusId: Number(body.statusId),

        // REFERRAL
        referenceMemberId: body.referenceMemberId || null,

        // KYC
        aadhaarNumber: body.aadhaarNumber || null,
        panNumber: body.panNumber || null,
        address: body.address || null,
        city: body.city || null,
        state: body.state || null,
        pincode: body.pincode || null,

        // BANK
        bankName: body.bankName || null,
        accountNumber: body.accountNumber || null,
        ifscCode: body.ifscCode || null,

        // 🔴 FIXED NAME
        commissionPercent: body.commissionPercentage
          ? Number(body.commissionPercentage)
          : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("UPDATE MEMBER ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update member" },
      { status: 500 }
    );
  }
}
