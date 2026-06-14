"use server";

import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const prisma = new PrismaClient();

const UpdateProfileSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل (Name must be at least 2 chars)"),
  email: z.string().email("بريد إلكتروني غير صالح (Invalid email)").optional().or(z.literal("")),
});

export async function updateProfile(data: { name: string; email?: string }) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return { success: false, error: "غير مصرح (Unauthorized)" };
    }

    const parsed = UpdateProfileSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error?.errors?.[0]?.message || "بيانات غير صالحة" };
    }

    const { name, email } = parsed.data;

    // Check email uniqueness if email provided
    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== session.userId) {
        return { success: false, error: "البريد الإلكتروني مستخدم مسبقاً (Email already in use)" };
      }
    }

    await prisma.user.update({
      where: { id: session.userId as string },
      data: {
        name,
        email: email || null,
      },
    });

    revalidatePath("/ar/profile", "layout");
    revalidatePath("/en/profile", "layout");

    return { success: true };
  } catch (error) {
    console.error("updateProfile error:", error);
    return { success: false, error: "حدث خطأ أثناء تحديث الملف الشخصي (Error updating profile)" };
  }
}
