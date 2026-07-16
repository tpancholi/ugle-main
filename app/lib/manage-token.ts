import { createHash, randomBytes } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { getManageSecret } from "@/app/lib/env";

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateManageToken(): string {
  return randomBytes(32).toString("base64url");
}

export async function signManageJwt(payload: {
  customerId: string;
  email: string;
}): Promise<string> {
  const secret = new TextEncoder().encode(getManageSecret());
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.customerId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyManageJwt(token: string): Promise<{
  customerId: string;
  email: string;
} | null> {
  try {
    const secret = new TextEncoder().encode(getManageSecret());
    const { payload } = await jwtVerify(token, secret);
    if (!payload.sub || typeof payload.email !== "string") return null;
    return { customerId: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}
