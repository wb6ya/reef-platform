"use server";

import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function submitReview(revieweeId: string, rating: number, comment?: string) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return { success: false, error: "Unauthorized" };
    }

    const reviewerId = session.userId as string;

    if (reviewerId === revieweeId) {
      return { success: false, error: "Cannot rate yourself" };
    }

    if (rating < 1 || rating > 5) {
      return { success: false, error: "Invalid rating" };
    }

    // Upsert review (user can only leave one review per person, or update their existing one)
    const existing = await prisma.review.findFirst({
      where: {
        reviewer_id: reviewerId,
        reviewee_id: revieweeId,
      }
    });

    if (existing) {
      await prisma.review.update({
        where: { id: existing.id },
        data: { rating, comment },
      });
    } else {
      await prisma.review.create({
        data: {
          reviewer_id: reviewerId,
          reviewee_id: revieweeId,
          rating,
          comment,
        }
      });
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("submitReview error:", error);
    return { success: false, error: "Failed to submit review" };
  }
}
