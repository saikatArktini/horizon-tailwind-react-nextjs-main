import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export function signVerificationToken(payload: any) {
  return jwt.sign(payload, SECRET, { expiresIn: "10m" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET) as any;
}
