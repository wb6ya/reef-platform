"use server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export async function createListingAction(data: {
  title: string;
  description: string;
  price: number | null;
  city: string;
  region: string;
  categoryId: string;
  dynamic_attributes: Record<string, unknown>;
  imageUrl: string;
}) {
  const userId = await getSessionUserId();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    const listing = await prisma.listing.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        city: data.city,
        region: data.region,
        category_id: data.categoryId,
        user_id: userId,
        attributes: data.dynamic_attributes as any,
        status: "ACTIVE",
        media: {
          create: {
            url: data.imageUrl,
            type: "IMAGE"
          }
        }
      }
    });
    return { success: true, listingId: listing.id };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to create listing" };
  }
}

export async function getListingsAction() {
  return await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    include: {
      user: { select: { is_verified: true, name: true, phone: true, created_at: true } },
      media: { take: 1 }
    },
    orderBy: { created_at: 'desc' }
  });
}
