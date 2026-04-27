export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "lib/prisma";
import { signToken } from "lib/jwt";
import { logger } from "lib/logger";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     description: Login a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
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
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function POST(req: Request) {
  logger.info("🟢 LOGIN API HIT");

  try {
    logger.debug("➡️ Parsing request body");
    const body = await req.json();

    logger.debug(
      {
        username: body?.username,
        hasPassword: body?.password,
      },
      "📦 Request body received"
    );

    const { username, password } = body;

    if (!username || !password) {
      logger.warn("❌ Missing username or password");
      return NextResponse.json(
        { message: "Username and password required" },
        { status: 400 }
      );
    }

    logger.info({ username }, "🔍 Fetching user");

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
        memberProfile: true,
      },
    });

    if (!user) {
      logger.warn({ username }, "❌ User not found");
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      logger.warn({ userId: user.id }, "⛔ User inactive");
      return NextResponse.json(
        { message: "Account inactive" },
        { status: 401 }
      );
    }

    logger.debug({ userId: user.id }, "🔐 Comparing password");

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      logger.warn({ userId: user.id }, "❌ Password mismatch");
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    logger.info({ userId: user.id }, "✅ Password validated");

    const permissions = user.role.permissions.map(
      (rp) => rp.permission.code
    );

    logger.debug(
      { permissions },
      "🧾 Permissions loaded"
    );

    const token = signToken({
      userId: user.id,
      role: user.role.name as "Super-Admin" | "Zonal-Admin" | "Branch-Admin" | "Member",
      permissions,
      memberId: user.memberProfile?.id ?? null,
    });

    logger.info({ userId: user.id }, "JWT generated");
    const res = NextResponse.json({ success: true, token });

res.cookies.set("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
});

return res;

   // return NextResponse.json({ token });

  } catch (err) {
    logger.error(err, "🔥 LOGIN API CRASHED");
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
