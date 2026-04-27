import { requireAuth } from "app/middleware/requireAuth";
import { prisma } from "lib/prisma";
import { NextResponse } from "next/server";
//import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

/**
 * GET BRANCH BY ID
 */

/**
 * @swagger
 * /api/branches/{id}:
 *   get:
 *     summary: Get a branch by id
 *     description: Get a branch by id
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
 *       404:
 *         description: Branch not found
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
  const branchId = Number(id);

  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    include: {
      branchLevel: true,
      country: true,
      state: true,
    },
  });

  if (!branch) {
    return NextResponse.json({ message: "Branch not found" }, { status: 404 });
  }

  return NextResponse.json(branch);
}

/**
 * UPDATE BRANCH
 *
 * @swagger
 * /api/branches/{id}:
 *   put:
 *     summary: Update a branch
 *     description: Update a branch
 *     tags:
 *       - Branches
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
 *               branchName:
 *                 type: string
 *               city:
 *                 type: string
 *               address:
 *                 type: string
 *               geoFencingEnabled:
 *                 type: boolean
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
 *       404:
 *         description: Branch not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export async function PUT(req: Request, { params }: Params) {
  //const branchId = Number(params.id);
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
  const body = await req.json();
  console.log(id);
  const existing = await prisma.branch.findUnique({
    where: { id: branchId },
  });

  if (!existing) {
    return NextResponse.json({ message: "Branch not found" }, { status: 404 });
  }

  const updated = await prisma.branch.update({
    where: { id: branchId },
    data: {
      branchName: body.branchName,
      city: body.city,
      address: body.address,
      geoFencingEnabled: body.geoFencingEnabled,
    },
  });

  return NextResponse.json(updated);
}
