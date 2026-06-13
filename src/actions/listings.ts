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
  dynamic_attributes: any;
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
        categoryId: data.categoryId,
        sellerId: userId,
        dynamic_attributes: data.dynamic_attributes,
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
      seller: { select: { is_verified: true } },
      media: { take: 1 }
    },
    orderBy: { created_at: 'desc' }
  });
}
