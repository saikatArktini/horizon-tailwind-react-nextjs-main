import { prisma } from "lib/prisma";
// import { requireAuth } from "@/lib/auth";
// import { requirePermission } from "@/lib/permissions";
import { requireAuth } from "app/middleware/requireAuth";
import { requirePermission } from "app/middleware/requirePermission";
import { requireBranchScope } from "app/middleware/requireBranchScope";

/**
 * @swagger
 * /api/assign-branches:
 *   post:
 *     summary: Assign branches to user
 *     description: Only Super Admin can assign branch access to users
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - branchIds
 *             properties:
 *               userId:
 *                 type: number
 *                 example: 1
 *               branchIds:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Branch access assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: number
 *                 role:
 *                   type: string
 *                 assignedBranches:
 *                   type: array
 *                   items:
 *                     type: number
 *       403:
 *         description: Forbidden
 */
// export async function POST(req: Request) {
//   try {
//     const authUser = requireAuth(req);
//     if (!authUser) throw new Error("Unauthorized");

//     // 🔐 Only Super Admin
//     if (authUser.role !== "Super-Admin") {
//       throw new Error("Only Super Admin can assign branch access");
//     }

//     requirePermission(authUser, "UPDATE_BRANCH");

//     const { userId, branchIds } = await req.json();
//     console.log("67", userId, branchIds);
//     //requireBranchScope(authUser, branchIds);
//     if (!userId || !Array.isArray(branchIds) || branchIds.length === 0) {
//       throw new Error("userId and branchIds are required");
//     }

//     // 🔍 Load target user
//     const targetUser = await prisma.user.findUnique({
//       where: { id: userId },
//       include: {
//         role: true,
//         userBranches: true,
//       },
//     });

//     if (!targetUser) {
//       throw new Error("Target user not found");
//     }

//     const roleName = targetUser.role.name;

//     // 🚫 Members cannot get branch access
//     if (roleName === "Member") {
//       throw new Error("Members cannot be assigned branches");
//     }

//     // 🚫 Branch Admin → exactly ONE branch
//     if (roleName === "Branch-Admin" && branchIds.length > 1) {
//       throw new Error("Branch Admin can be assigned only one branch");
//     }
//     if(roleName ==="Super-Admin"){
//       throw new Error("Super Admin has global access");
//     }

//     // 🧹 For Branch Admin, remove old branches first
//     if (roleName === "Branch-Admin") {
//       await prisma.userBranch.deleteMany({
//         where: { userId },
//       });
//     }

//     // ✅ Assign branches
//     await prisma.userBranch.createMany({
//       data: branchIds.map((branchId: number) => ({
//         userId,
//         branchId,
//       })),
//       skipDuplicates: true,
//     });

//     return Response.json({
//       message: "Branch access assigned successfully",
//       userId,
//       role: roleName,
//       assignedBranches: branchIds,
//     });
//   } catch (e: any) {
//     console.error("124",e);
//     return new Response(e, { status: 403 });
//   }
// }

export async function POST(req: Request) {
  try {
    const authUser = requireAuth(req);
    if (!authUser) throw new Error("Unauthorized");

    // ✅ Allow Super Admin & Zonal Admin
    if (!["Super-Admin", "Zonal-Admin"].includes(authUser.role)) {
      throw new Error("Not authorized to assign branches");
    }

    requirePermission(authUser, "UPDATE_BRANCH");

    const { userId, branchIds } = await req.json();

    if (!userId || !Array.isArray(branchIds) || branchIds.length === 0) {
      throw new Error("userId and branchIds are required");
    }

    // 🔍 Load target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        userBranches: true,
      },
    });

    if (!targetUser) {
      throw new Error("Target user not found");
    }

    const roleName = targetUser.role.name;

    // 🚫 Super Admin cannot be assigned branches
    if (roleName === "Super-Admin") {
      throw new Error("Super Admin has global access");
    }

    // 🚫 Members cannot get branch access
    if (roleName === "Member") {
      throw new Error("Members cannot be assigned branches");
    }

    // =====================================================
    // 🔐 ZONAL ADMIN RULES
    // =====================================================
    if (authUser.role === "Zonal-Admin") {

      // ❌ Zonal Admin can assign only to Branch Admin
      if (roleName !== "Branch-Admin") {
        throw new Error("Zonal Admin can assign branches only to Branch Admin");
      }

      // Get branches of logged-in Zonal Admin
      const zonalBranches = await prisma.userBranch.findMany({
        where: { userId: userId },
        select: { branchId: true },
      });

      const allowedBranchIds = zonalBranches.map(b => b.branchId);

      // Validate requested branches are inside zonal scope
      for (const branchId of branchIds) {
        if (!allowedBranchIds.includes(branchId)) {
          throw new Error(
            `Forbidden: You cannot assign branch ${branchId}`
          );
        }
      }
    }

    // =====================================================
    // 🔐 BRANCH ADMIN RULE
    // =====================================================
    if (roleName === "Branch-Admin" && branchIds.length > 1) {
      throw new Error("Branch Admin can be assigned only one branch");
    }

    // 🧹 If assigning to Branch Admin → remove old branches
    if (roleName === "Branch-Admin") {
      await prisma.userBranch.deleteMany({
        where: { userId },
      });
    }

    // ✅ Assign branches
    await prisma.userBranch.createMany({
      data: branchIds.map((branchId: number) => ({
        userId,
        branchId,
      })),
      skipDuplicates: true,
    });

    return Response.json({
      message: "Branch access assigned successfully",
      userId,
      role: roleName,
      assignedBranches: branchIds,
    });

  } catch (e: any) {
    console.error("Assign Branch Error:", e);
    return new Response(e.message || "Forbidden", { status: 403 });
  }
}
