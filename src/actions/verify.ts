"use server";

import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function submitVerification(nationalIdOrPermit: string) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return { success: false, error: "غير مصرح (Unauthorized)" };
    }

    if (!nationalIdOrPermit || nationalIdOrPermit.length < 8) {
      return { success: false, error: "رقم الهوية أو السجل غير صالح (Invalid ID/Permit)" };
    }

    // Mock an immediate verification and upgrade to SELLER for MVP
    await prisma.user.update({
      where: { id: session.userId as string },
      data: {
        national_id: nationalIdOrPermit,
        verification_status: "VERIFIED",
        role: "SELLER", 
      },
    });

    // Revalidate both paths to instantly update the UI without hard refreshing
    revalidatePath("/ar/profile");
    revalidatePath("/en/profile");

    return { success: true };
  } catch (error) {
    console.error("submitVerification error:", error);
    return { success: false, error: "حدث خطأ أثناء تقديم الطلب (Submission Error)" };
  }
}
