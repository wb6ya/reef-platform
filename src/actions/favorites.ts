"use server";

import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function toggleFavorite(listingId: string) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.userId as string;

    const existing = await prisma.favorite.findUnique({
      where: {
        user_id_listing_id: {
          user_id: userId,
          listing_id: listingId,
        }
      }
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id }
      });
    } else {
      await prisma.favorite.create({
        data: {
          user_id: userId,
          listing_id: listingId,
        }
      });
    }

    revalidatePath("/", "layout");
    return { success: true, favorited: !existing };
  } catch (error) {
    console.error("toggleFavorite error:", error);
    return { success: false, error: "Failed to toggle favorite" };
  }
}
