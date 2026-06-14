"use server";

import { PrismaClient } from "@prisma/client";
import { RegisterSchema, LoginSchema, VerifySchema, formatToE164 } from "@/lib/validations/auth";
import { sendOTP } from "@/lib/sms";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth"; 

const prisma = new PrismaClient();

export async function requestRegistrationOTP(formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    const parsed = RegisterSchema.safeParse(data);
    
    if (!parsed.success) {
      return { success: false, error: parsed.error?.errors?.[0]?.message || "بيانات غير صالحة" };
    }

    const { name, email, phone, password } = parsed.data;

    // Check if phone exists
    const existingPhone = await prisma.user.findUnique({ where: { phone } });
    if (existingPhone) {
      return { success: false, error: "رقم الجوال مسجل مسبقاً" };
    }

    // Check if email exists
    if (email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        return { success: false, error: "البريد الإلكتروني مسجل مسبقاً" };
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const user = await prisma.user.create({
      data: {
        name,
        email: email || null,
        phone,
        password: hashedPassword,
        otpCode,
        otpExpires,
      }
    });

    const smsResult = await sendOTP(formatToE164(phone), otpCode);
    if (!smsResult.success) {
      return { success: false, error: smsResult.error };
    }

    return { success: true, phone };
  } catch (error) {
    console.error("requestRegistrationOTP Error:", error);
    return { success: false, error: "حدث خطأ غير متوقع" };
  }
}

export async function requestLoginOTP(formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    const parsed = LoginSchema.safeParse(data);
    
    if (!parsed.success) {
      return { success: false, error: parsed.error?.errors?.[0]?.message || "بيانات غير صالحة" };
    }

    const { phone } = parsed.data;
    const user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      return { success: false, error: "رقم الجوال غير مسجل" };
    }

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode, otpExpires }
    });

    const smsResult = await sendOTP(formatToE164(phone), otpCode);
    if (!smsResult.success) {
      return { success: false, error: smsResult.error };
    }

    return { success: true, phone };
  } catch (error) {
    console.error("requestLoginOTP Error:", error);
    return { success: false, error: "حدث خطأ غير متوقع" };
  }
}

export async function verifyOTP(formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    const parsed = VerifySchema.safeParse(data);
    
    if (!parsed.success) {
      return { success: false, error: parsed.error?.errors?.[0]?.message || "بيانات غير صالحة" };
    }

    const { phone, code } = parsed.data;
    
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return { success: false, error: "المستخدم غير موجود" };
    }

    if (!user.otpCode || user.otpCode !== code) {
      return { success: false, error: "رمز التحقق غير صحيح" };
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      return { success: false, error: "رمز التحقق منتهي الصلاحية" };
    }

    // Success - clear OTP and sign session
    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: null, otpExpires: null }
    });

    // Create session (edge compatible)
    await createSession(user.id);
    
    return { success: true };
  } catch (error) {
    console.error("verifyOTP Error:", error);
    return { success: false, error: "حدث خطأ غير متوقع" };
  }
}

export async function logout() {
  const { deleteSession } = await import("@/lib/auth");
  await deleteSession();
}

