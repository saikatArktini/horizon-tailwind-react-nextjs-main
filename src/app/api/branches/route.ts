import { requireAuth } from "app/middleware/requireAuth";
import { prisma } from "lib/prisma";
import { NextResponse } from "next/server";
//import { prisma } from "@/lib/prisma";

/**
 * CREATE BRANCH
 */
function generateBranchCode(
  countryId: number,
  stateId: number,
  branchLevelId: number
) {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BR-${countryId}-${stateId}-${branchLevelId}-${random}`;
}
/**
 * @swagger
 * /api/branches:
 *   post:
 *     summary: Create a new branch
 *     description: Create a new branch
 *     tags:
 *       - Branches
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               branchName:
 *                 type: string
 *               branchCode:
 *                 type: string
 *               city:
 *                 type: string
 *               address:
 *                 type: string
 *               branchLevelId:
 *                 type: integer
 *               countryId:
 *                 type: integer
 *               stateId:
 *                 type: integer
 *               geoFencingEnabled:
 *                 type: boolean
 *               createdByUserId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 branchName:
 *                   type: string
 *                 branchCode:
 *                   type: string
 *                 city:
 *                   type: string
 *                 address:
 *                   type: string
 *                 branchLevelId:
 *                   type: integer
 *                 countryId:
 *                   type: integer
 *                 stateId:
 *                   type: integer
 *                 geoFencingEnabled:
 *                   type: boolean
 *                 createdByUserId:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *       500:
 *         description: Failed to create branch
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

    let branchCode = "";
    let exists = true;

    while (exists) {
      branchCode = generateBranchCode(
        body.countryId,
        body.stateId,
        body.branchLevelId,
      );

      const found = await prisma.branch.findUnique({
        where: { branchCode },
      });

      exists = !!found;
    }

    const branch = await prisma.branch.create({
      data: {
        branchName: body.branchName,
        branchCode: branchCode, // ✅ FIXED
        city: body.city,
        address: body.address,
        branchLevelId: body.branchLevelId,
        countryId: body.countryId,
        stateId: body.stateId,
        geoFencingEnabled: body.geoFencingEnabled ?? false,
        createdByUserId: 1,
      },
    });

    return NextResponse.json(
      {
        message: "Branch created successfully",
        data: branch,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create branch" },
      { status: 500 }
    );
  }
}

/**
 * LIST ALL BRANCHES
 */

/**
 * @swagger
 * /api/branches:
 *   get:
 *     summary: List all branches
 *     description: List all branches
 *     tags:
 *       - Branches
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
 *                   branchName:
 *                     type: string
 *                   branchCode:
 *                     type: string
 *                   city:
 *                     type: string
 *                   address:
 *                     type: string
 *                   branchLevelId:
 *                     type: integer
 *                   countryId:
 *                     type: integer
 *                   stateId:
 *                     type: integer
 *                   geoFencingEnabled:
 *                     type: boolean
 *                   createdByUserId:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *                   branchLevel:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       branchLevelName:
 *                         type: string
 *                   country:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       countryName:
 *                         type: string
 *                   state:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       stateName:
 *                         type: string
 *                   createdBy:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       username:
 *                         type: string
 */
export async function GET( req: Request) {
  const user = requireAuth(req);
    console.log("42",user);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
  const branches = await prisma.branch.findMany({
    include: {
      branchLevel: true,
      country: true,
      state: true,
      createdBy: {
        select: { id: true, username: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(branches);
}
