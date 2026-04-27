// src/lib/requireAuth.ts
//import { verifyToken } from "./jwt";

import { verifyToken } from "lib/jwt";

export type Role =
  | "Super-Admin"
  | "Zonal-Admin"
  | "Branch-Admin"
  | "Member";

export type AuthUser = {
  userId: number;
  role: Role;
  permissions: string[];   // resolved permissions from role
  memberId?: number | null;
};
/**
 * @swagger
 * /:
 *   get:
 *     summary: Get authorized user data from authorization header
 *     description: Returns an authorized user data if the authorization header is valid, otherwise null
 *     tags:
 *       - authorization
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Authorized user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: number
 *                 role:
 *                   type: string
 *                 permissions:
 *                   type: string
 *                 memberId:
 *                   type: number
 *       401:
 *         description: Unauthorized request
 *         content: { }
*/
export function requireAuth(req: Request): AuthUser {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: Missing token");
  }

  const token = authHeader.split(" ")[1];

  try {
    return verifyToken(token) as AuthUser;
  } catch {
    throw new Error("Unauthorized: Invalid or expired token");
  }
}