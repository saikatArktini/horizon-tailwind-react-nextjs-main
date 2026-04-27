import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { requireAuth } from "app/middleware/requireAuth";

type Params = { params: Promise<{ id: string }> };

/**
 * Update a country
 *
 * @swagger
 * /api/countries/{id}:
 *   patch:
 *     summary: Update a country
 *     description: Update a country
 *     tags:
 *       - Countries
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
 *               name:
 *                 type: string
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
 *                 name:
 *                   type: string
 *       404:
 *         description: Country not found
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
  const countryId = Number(id);
  
  const { name } = await req.json();

  const existing = await prisma.country.findUnique({
    where: { id: countryId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Country not found" }, { status: 404 });
  }

  const updated = await prisma.country.update({
    where: { id: countryId },
    data: { name },
  });

  return NextResponse.json(updated);
}
/**
 * Get all states of a country
 *
 * @swagger
 * /api/countries/{countryId}/states:
 *   get:
 *     summary: Get all states of a country
 *     description: Get all states of a country
 *     tags:
 *       - States
 *     parameters:
 *       - in: path
 *         name: countryId
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
 *                   name:
 *                     type: string
 *                   countryId:
 *                     type: integer
 *       404:
 *         description: Country not found
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
  const countryIdNumber = Number(id);

  const existingCountry = await prisma.country.findUnique({
    where: { id: countryIdNumber },
  });

  if (!existingCountry) {
    return NextResponse.json({ error: "Country not found" }, { status: 404 });
  }
  const existingState = await prisma.state.findFirst({
    where: { countryId: countryIdNumber },
  });

  if (!existingState) {
    return NextResponse.json({ error: "State not found on that country" }, { status: 404 });
  }
  const states = await prisma.state.findMany({
    where: { countryId: countryIdNumber },
  });

  return NextResponse.json(states);
}
