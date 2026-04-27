import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { requireAuth } from "app/middleware/requireAuth";

/* GET ALL COUNTRIES */

/**
 * @swagger
 * /api/countries:
 *   get:
 *     summary: List all countries
 *     description: List all countries
 *     tags:
 *       - Countries
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
 *                   states:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *
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
  const countries = await prisma.country.findMany({
    include: { states: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(countries);
}

/* CREATE COUNTRY */

/**
 * @swagger
 * /api/countries:
 *   post:
 *     summary: Create a country
 *     description: Create a country
 *     tags:
 *       - Countries
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
 *         description: Successful response
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
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "Country name required" }, { status: 400 });
  }

  const exists = await prisma.country.findUnique({ where: { name } });
  if (exists) {
    return NextResponse.json({ error: "Country already exists" }, { status: 409 });
  }

  const country = await prisma.country.create({
    data: { name },
  });

  return NextResponse.json(country, { status: 201 });
}
