import { requireAuth } from "app/middleware/requireAuth";
import { prisma } from "lib/prisma";
import { NextResponse } from "next/server";
//import { prisma } from "@/lib/prisma";

/**
 * CREATE MEMBER
 */

/**
 * @swagger
 * /api/members:
 *   post:
 *     summary: Create a new member
 *     description: Create a new member
 *     tags:
 *       - Members
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberCode:
 *                 type: string
 *               fullName:
 *                 type: string
 *               mobile:
 *                 type: string
 *               email:
 *                 type: string
 *               dob:
 *                 type: string
 *
 *               genderId:
 *                 type: integer
 *               aadhaarNumber:
 *                 type: string
 *               panNumber:
 *                 type: string
 *
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               pincode:
 *                 type: string
 *
 *               bankName:
 *                 type: string
 *               accountNumber:
 *                 type: string
 *               ifscCode:
 *                 type: string
 *               commissionPercent:
 *                 type: number
 *
 *               branchId:
 *                 type: integer
 *               memberRoleId:
 *                 type: integer
 *               statusId:
 *                 type: integer
 *               referenceMemberId:
 *                 type: integer
 *               createdByUserId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Member created successfully
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
 *
 *                 genderId:
 *                   type: integer
 *                 aadhaarNumber:
 *                   type: string
 *                 panNumber:
 *                   type: string
 *
 *                 address:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 pincode:
 *                   type: string
 *
 *                 bankName:
 *                   type: string
 *                 accountNumber:
 *                   type: string
 *                 ifscCode:
 *                   type: string
 *                 commissionPercent:
 *                   type: number
 *
 *                 branchId:
 *                   type: integer
 *                 memberRoleId:
 *                   type: integer
 *                 statusId:
 *                   type: integer
 *                 referenceMemberId:
 *                   type: integer
 *                 createdByUserId:
 *                   type: integer
 *       500:
 *         description: Failed to create member
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export async function POST(req: Request) {
  try {
    const user = requireAuth(req);
        console.log("42",user);
        if (!user) {
          return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
          );
        }
    const body = await req.json();

    const member = await prisma.member.create({
      data: {
        memberCode: body.memberCode,
        fullName: body.fullName,
        mobile: body.mobile,
        email: body.email,
        dob: body.dob,

        genderId: body.genderId,
        aadhaarNumber: body.aadhaarNumber,
        panNumber: body.panNumber,

        address: body.address,
        city: body.city,
        state: body.state,
        pincode: body.pincode,

        bankName: body.bankName,
        accountNumber: body.accountNumber,
        ifscCode: body.ifscCode,
        commissionPercent: body.commissionPercent,

        branchId: body.branchId,
        memberRoleId: body.memberRoleId, // only "Member"
        statusId: body.statusId,         // Active by default

        referenceMemberId: body.referenceMemberId,
        createdByUserId: body.createdByUserId,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create member" },
      { status: 500 }
    );
  }
}

/**
 * LIST MEMBERS (FILTERABLE)
 */

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: List all members (filterable)
 *     description: List all members (filterable)
 *     tags:
 *       - Members
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
 *                   memberCode:
 *                     type: string
 *                   fullName:
 *                     type: string
 *                   mobile:
 *                     type: string
 *                   email:
 *                     type: string
 *                   dob:
 *                     type: string
 *                   genderId:
 *                     type: integer
 *                   aadhaarNumber:
 *                     type: string
 *                   panNumber:
 *                     type: string
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   pincode:
 *                     type: string
 *                   bankName:
 *                     type: string
 *                   accountNumber:
 *                     type: string
 *                   ifscCode:
 *                     type: string
 *                   commissionPercent:
 *                     type: number
 *                   branch:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       branchName:
 *                         type: string
 *                       branchCode:
 *                         type: string
 *                       city:
 *                         type: string
 *                   memberRole:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                   status:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *       404:
 *         description: No members found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to list members
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
  try {
    const members = await prisma.member.findMany({
      include: {
        branch: true,
        memberRole: true,
        status: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (members.length === 0) {
      return NextResponse.json(
        { message: "No members found" },
        { status: 404 }
      );
    }

    return NextResponse.json(members);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to list members" },
      { status: 500 }
    );
  }
}

