import jwt,{JwtPayload} from "jsonwebtoken";
const expiresIn = process.env.JWT_EXPIRES_IN ?? "1d";
export interface AuthPayload extends JwtPayload {
  userId: number;
  role: "Super-Admin" | "Zonal-Admin"| "Branch-Admin" | "Member";
  permissions?: string[];
  memberId?: number | null;
}

export function signToken(payload: AuthPayload) {
  console.log("11",payload)
  return jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    { expiresIn: "1h" },
  );
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as AuthPayload;
}
