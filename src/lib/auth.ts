import { cookies } from "next/headers";
import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || "fallback-secret-for-development-only";

function sign(payload: string): string {
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(payload);
  return `${payload}.${hmac.digest("base64url")}`;
}

function verify(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(payload);
  const expectedSignature = hmac.digest("base64url");
  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return payload;
  }
  return null;
}

export async function createSession(userId: string) {
  const token = sign(userId);
  const cookieStore = await cookies();
  cookieStore.set("auth_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_session")?.value;
  if (!token) return null;
  return verify(token);
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
}
