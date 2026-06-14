"use server";

import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function getCategories() {
  return await prisma.category.findMany();
}

export async function createListing(payload: {
  title: string;
  description: string;
  city: string;
  region: string;
  type: "FIXED_PRICE" | "NEGOTIABLE";
  price: number | null;
  categoryId: string;
  attributes: Record<string, any>;
  imagesBase64: string[];
}) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return { success: false, error: "غير مصرح (Unauthorized)" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
    });

    if (!user || user.verification_status !== "VERIFIED") {
      return { success: false, error: "يجب توثيق الحساب أولاً (Must verify account first)" };
    }

    if (!payload.imagesBase64 || payload.imagesBase64.length === 0) {
      return { success: false, error: "يجب إضافة صورة واحدة على الأقل (Must add at least one image)" };
    }

    // 1. Process and save images to local disk FIRST
    const publicUploadsDir = path.join(process.cwd(), "public", "uploads", "listings");
    await fs.mkdir(publicUploadsDir, { recursive: true });

    const processedImages = await Promise.all(
      payload.imagesBase64.map(async (base64Str) => {
        const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        // Fallback if not standard base64 data URI
        if (!matches || matches.length !== 3) {
          return { url: base64Str, type: "image/webp" };
        }
        
        const mimeType = matches[1];
        const extension = mimeType.split("/")[1] || "webp";
        const base64Data = matches[2];
        
        const buffer = Buffer.from(base64Data, "base64");
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
        const filePath = path.join(publicUploadsDir, filename);
        
        await fs.writeFile(filePath, buffer);
        
        return { url: `/uploads/listings/${filename}`, type: mimeType };
      })
    );

    // 2. Prisma Transaction to ensure Listing and Media are atomic
    const newListing = await prisma.$transaction(async (tx) => {
      const listing = await tx.listing.create({
        data: {
          user_id: user.id,
          category_id: payload.categoryId,
          title: payload.title,
          description: payload.description,
          city: payload.city,
          region: payload.region,
          type: payload.type,
          price: payload.price,
          attributes: payload.attributes,
        },
      });

      const mediaPromises = processedImages.map((img, index) => 
        tx.listingMedia.create({
          data: {
            listing_id: listing.id,
            url: img.url,
            type: img.type,
            is_primary: index === 0,
          }
        })
      );

      await Promise.all(mediaPromises);

      return listing;
    });

    revalidatePath("/ar");
    revalidatePath("/en");
    revalidatePath("/", "layout");

    return { success: true, listingId: newListing.id };
  } catch (error) {
    console.error("createListing error:", error);
    return { success: false, error: "حدث خطأ أثناء إضافة الإعلان (Error creating listing)" };
  }
}

export async function deleteListing(listingId: string) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return { success: false, error: "غير مصرح (Unauthorized)" };
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return { success: false, error: "الإعلان غير موجود (Listing not found)" };
    }

    if (listing.user_id !== session.userId) {
      return { success: false, error: "غير مصرح لك بحذف هذا الإعلان (Unauthorized to delete)" };
    }

    await prisma.listing.delete({
      where: { id: listingId },
    });

    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error) {
    console.error("deleteListing error:", error);
    return { success: false, error: "حدث خطأ أثناء حذف الإعلان (Error deleting listing)" };
  }
}
