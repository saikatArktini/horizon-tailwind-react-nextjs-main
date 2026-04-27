import { requireAuth } from "app/middleware/requireAuth";
import { requirePermission } from "app/middleware/requirePermission";
import { prisma } from "lib/prisma";
import { NextResponse } from "next/server";
//import { prisma } from "@/lib/prisma";

// GET ALL

/**
 * @swagger
 * /api/genders:
 *   get:
 *     summary: List all genders
 *     description: List all genders
 *     tags:
 *       - Genders
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
 *                   name:
 *                     type: string
 */
export async function GET(req: Request) {
  try{
    const user = requireAuth(req);
          console.log("42",user);
          if (!user) {
            return NextResponse.json(
              { message: "Unauthorized" },
              { status: 401 }
            );
          }
  //const permission=requirePermission(user,"CREATE_BRANCH");
  // console.log("42fsfsf",permission);
  // if(!permission){
  //   return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  // }
  const genders = await prisma.gender.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(genders);
  }catch(e){
    console.log("error11111",e.message);
    return NextResponse.json({ message: e.message }, { status: 403 });
  }
}

// CREATE

/**
 * @swagger
 * /api/genders:
 *   post:
 *     summary: Create a new gender
 *     description: Create a new gender
 *     tags:
 *       - Genders
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
 *       201:
 *         description: Created
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
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function POST(req: Request) {
  const user = requireAuth(req);
        console.log("42",user);
        if (!user) {
          return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
          );
        }
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const exists = await prisma.gender.findUnique({ where: { name } });
  if (exists) {
    return NextResponse.json({ error: "Gender already exists" }, { status: 409 });
  }

  const gender = await prisma.gender.create({ data: { name } });
  return NextResponse.json(gender, { status: 201 });
}
