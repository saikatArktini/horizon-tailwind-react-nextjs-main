import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { requireAuth } from "app/middleware/requireAuth";

/* GET ALL STATES */

/**
 * @swagger
 * /api/states:
 *   get:
 *     summary: List all states
 *     description: List all states
 *     tags:
 *       - States
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
 *                   country:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
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
  const states = await prisma.state.findMany({
    include: { country: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(states);
}

/* CREATE STATE */

/**
 * @swagger
 * /api/states:
 *   post:
 *     summary: Create a new state
 *     description: Create a new state
 *     tags:
 *       - States
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               countryId:
 *                 type: integer
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
 *                 country:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
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
 *         description: Country not found
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
  const { name, countryId } = await req.json();

  if (!name || !countryId) {
    return NextResponse.json(
      { error: "Name and countryId required" },
      { status: 400 }
    );
  }

  const countryExists = await prisma.country.findUnique({
    where: { id: countryId },
  });

  if (!countryExists) {
    return NextResponse.json({ error: "Invalid country" }, { status: 404 });
  }

  const state = await prisma.state.create({
    data: {
      name,
      countryId,
    },
  });

  return NextResponse.json(state, { status: 201 });
}
