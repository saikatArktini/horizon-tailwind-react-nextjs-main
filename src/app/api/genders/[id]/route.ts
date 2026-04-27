import { prisma } from "lib/prisma";
import { NextResponse } from "next/server";
//import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

/**
 * @swagger
 * /api/genders/{id}:
 *   patch:
 *     summary: Update a gender
 *     description: Update a gender
 *     tags:
 *       - Genders
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
*/
export async function PATCH(req: Request, { params }: Params) {
  //const id = Number(params.id);
  const {id}=await params;
  const genderId = Number(id);
  const { name } = await req.json();

  const existing = await prisma.gender.findUnique({ where: { id: genderId } });
  if (!existing) {
    return NextResponse.json({ error: "Gender not found" }, { status: 404 });
  }

  const updated = await prisma.gender.update({
    where: { id: genderId },
    data: { name },
  });

  return NextResponse.json(updated);
}
