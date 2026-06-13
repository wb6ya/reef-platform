"use server";

import { prisma } from "@/lib/prisma";
import { createSession, destroySession, getSessionUserId } from "@/lib/auth";

export async function sendOtpAction(phone: string) {
  // Simulate sending OTP. For MVP, we just return success.
  if (!phone || phone.length < 9) {
    return { success: false, error: "رقم الهاتف غير صحيح / Invalid phone number" };
  }
  return { success: true };
}

export async function verifyOtpAction(phone: string, otp: string) {
  if (otp !== "1234") {
    return { success: false, error: "رمز التحقق غير صحيح / Invalid OTP" };
  }

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { phone },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        phone,
        name: `مستخدم_${phone.slice(-4)}`,
      },
    });
  }

  await createSession(user.id);
  return { success: true };
}

export async function logoutAction() {
  await destroySession();
  return { success: true };
}

export async function verifySellerAction() {
  const userId = await getSessionUserId();
  if (!userId) return { success: false, error: "Unauthorized" };

  await prisma.user.update({
    where: { id: userId },
    data: { is_verified: true },
  });

  return { success: true };
}
