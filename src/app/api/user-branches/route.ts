import { prisma } from "lib/prisma";
//import { requireAuth } from "@/lib/auth";
//import { requirePermission } from "@/lib/permissions";
import bcrypt from "bcryptjs";
import { requireAuth } from "app/middleware/requireAuth";
import { requirePermission } from "app/middleware/requirePermission";

/**
 * @swagger
 * /api/user-branches:
 *   post:
 *     summary: Create a new user with branches
 *     description: Super Admin creates Zonal/Branch Admin and assigns branches
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - role
 *               - branchIds
 *             properties:
 *               username:
 *                 type: string
 *                 example: zonal_admin_1
 *               role:
 *                 type: string
 *                 enum: ["Zonal-Admin", "Branch-Admin"]
 *                 example: "Zonal-Admin"
 *               branchIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 credentials:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     password:
 *                       type: string
 *       403:
 *         description: Forbidden
 */
export async function POST(req: Request) {
  try {
    console.log("61",req);
    const authUser = requireAuth(req);
    if (!authUser) throw new Error("Unauthorized");

    // 🔐 Only SUPERADMIN
    if (authUser.role !== "Super-Admin") {
      throw new Error("Only Super Admin can create admins");
    }

    requirePermission(authUser, "CREATE_BRANCH"); // or CREATE_ADMIN if you add it

    const {
      username,
      role,        // ZONAL_ADMIN | BRANCH_ADMIN
      branchIds,
    } = await req.json();

    if (!username || !role) {
      throw new Error("username and role are required");
    }

    if (!Array.isArray(branchIds) || branchIds.length === 0) {
      throw new Error("branchIds required");
    }
    if(role==="Super-Admin"){
      throw new Error("Super Admin must be created from register page because it has global access.");
    }
    // 🚫 Branch Admin → only ONE branch
    if (role === "Branch-Admin" && branchIds.length > 1) {
      throw new Error("Branch Admin can be assigned only one branch");
    }

    // 🔍 Load role
    const dbRole = await prisma.role.findUnique({
      where: { name: role },
    });

    if (!dbRole) {
      throw new Error("Invalid role");
    }
    const exists = await prisma.user.findUnique({
    where: { username },
  });
  if (exists) {
    throw new Error("User already exists");
  }

    // 🔐 Generate password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 🧑 Create user
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        roleId: dbRole.id,
      },
    });

    // 🔗 Assign branches
    await prisma.userBranch.createMany({
      data: branchIds.map((branchId: number) => ({
        userId: newUser.id,
        branchId,
      })),
    });

    // 📧 (later) Send email with credentials

    return Response.json({
      message: "Admin created successfully",
      credentials: {
        username,
        password: tempPassword, // show once
      },
    });
  } catch (e: any) {
  console.error("132", e);

  return new Response(
    JSON.stringify({
      message: e.message || "Something went wrong",
    }),
    {
      status: 403,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

}

/**
 * @swagger
 * /api/user-branches:
 *   get:
 *     summary: Get all users with branches
 *     description: Get all users with branches
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: zonal_admin_1
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-09-01T00:00:00.000Z
 *                       role:
 *                         type: string 
 *                         example: ZONAL_ADMIN
 *                       userBranches:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             branch:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 1
 *                                 branchName:
 *                                   type: string
 *                                   example: Branch 1
 *                                 branchCode:
 *                                   type: string
 *                                   example: BR1
 *     security:
 *       - bearerAuth: []
 */
export async function GET(req: Request) {
  try {
    const user = requireAuth(req);
    if (!user) throw new Error("Unauthorized");

    // 🔐 Only Super Admin
    // if (user.role !== "Super-Admin") {
    //   throw new Error("Forbidden");
    // }

    requirePermission(user, "VIEW_BRANCH");

    const admins = await prisma.user.findMany({
      where: {
        role: {
          name: {
            in: ["Super-Admin", "Zonal-Admin", "Branch-Admin"],
          },
        },
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
        role: {
          select: {
            name: true,
          },
        },
        userBranches: {
          select: {
            branch: {
              select: {
                id: true,
                branchName: true,
                branchCode: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({
      count: admins.length,
      data: admins.map((u) => ({
        userId: u.id,
        username: u.username,
        role: u.role.name,
        branches: u.userBranches.map((ub) => ub.branch),
        createdAt: u.createdAt,
      })),
    });
  } catch (e: any) {
    console.error("270",e);
    //return new Response(e, { status: 403 });
    return new Response(
    JSON.stringify({
      message: e.message || "Something went wrong",
    }),
    {
      status: 403,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  }
}


/**
 * @swagger
 * /api/user-branches:
 *   delete:
 *     summary: Revoke branch access
 *     description: Revoke branch access
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               branchIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Branch access removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 removedCount:
 *                   type: integer
 *     security:
 *       - bearerAuth: []
 */
export async function DELETE(req: Request) {
  try {
    const authUser = requireAuth(req);
    if (!authUser) throw new Error("Unauthorized");

    // 🔐 Only Super Admin
    // if (authUser.role !== "Super-Admin") {
    //   throw new Error("Only Super Admin can revoke branch access");
    // }

    requirePermission(authUser, "UPDATE_BRANCH");

    const { userId, branchIds } = await req.json();

    if (!userId || !Array.isArray(branchIds) || branchIds.length === 0) {
      throw new Error("userId and branchIds are required");
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        userBranches: true,
      },
    });

    if (!targetUser) {
      throw new Error("User not found");
    }

    const existingBranchCount = targetUser.userBranches.length;
    const deletingCount = branchIds.length;
    const remaining = existingBranchCount - deletingCount;
    if(targetUser.role.name === "Super-Admin") {
      throw new Error("Super Admin have global access so cannot remove branch access");
    }
    // 🚫 Branch Admin must have exactly ONE branch
    if (targetUser.role.name === "Branch-Admin" && remaining < 1) {
      throw new Error("Branch Admin must have exactly one branch");
    }

    // 🚫 Zonal Admin must have at least one branch
    if (targetUser.role.name === "Zonal-Admin" && remaining < 1) {
      throw new Error("Zonal Admin must have at least one branch");
    }

    // ❌ Delete multiple branches
    const deleted = await prisma.userBranch.deleteMany({
      where: {
        userId,
        branchId: {
          in: branchIds,
        },
      },
    });

    if (deleted.count === 0) {
      throw new Error("No branch access found to delete");
    }

    return Response.json({
      message: "Branch access removed successfully",
      removedCount: deleted.count,
    });
  } catch (e: any) {
    return new Response(e.message, { status: 403 });
  }
}
