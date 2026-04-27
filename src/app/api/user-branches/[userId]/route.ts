import { requireAuth } from "app/middleware/requireAuth";
import { prisma } from "lib/prisma";
//import { requireAuth } from "lib/auth/requireAuth";

/**
 * @swagger
 * /api/user-branches/{userId}:
 *   get:
 *     summary: Get all branches assigned to a user
 *     description: Get all branches assigned to a user
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
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
 *                   branchId:
 *                     type: integer
 *                   userId:
 *                     type: integer
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
 *                       address:
 *                         type: string
 *                       branchLevelId:
 *                         type: integer
 *                       countryId:
 *                         type: integer
 *                       stateId:
 *                         type: integer
 *                       geoFencingEnabled:
 *                         type: boolean
 *                       createdByUserId:
 *                         type: integer
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
*/
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const authUser = requireAuth(req);
    if (!authUser) throw new Error("Unauthorized");

    const targetUserId = Number(params.userId);

    if (
      authUser.role !== "Super-Admin" &&
      authUser.userId !== targetUserId
    ) {
      throw new Error("Forbidden");
    }

    const branches = await prisma.userBranch.findMany({
      where: { userId: targetUserId },
      include: {
        branch: true,
      },
    });

    return Response.json(branches);
  } catch (e: any) {
    return new Response(e.message, { status: 403 });
  }
}
