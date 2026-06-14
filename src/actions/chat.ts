"use server";

import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function initiateChat(listingId: string, sellerId: string, lang: string) {
  const session = await getSession();
  if (!session || !session.userId) {
    redirect(`/${lang}/login`);
  }

  const buyerId = session.userId as string;

  if (buyerId === sellerId) {
    // Cannot chat with yourself
    return;
  }

  // Check if thread already exists
  let thread = await prisma.thread.findFirst({
    where: {
      listing_id: listingId,
      buyer_id: buyerId,
      seller_id: sellerId,
    }
  });

  if (!thread) {
    // Create new thread
    thread = await prisma.thread.create({
      data: {
        listing_id: listingId,
        buyer_id: buyerId,
        seller_id: sellerId,
      }
    });
  }

  redirect(`/${lang}/chat/${thread.id}`);
}

export async function sendMessage(threadId: string, content: string) {
  const session = await getSession();
  if (!session || !session.userId) {
    return { success: false, error: "Unauthorized" };
  }

  if (!content || content.trim() === "") {
    return { success: false, error: "Empty message" };
  }

  try {
    await prisma.message.create({
      data: {
        thread_id: threadId,
        sender_id: session.userId as string,
        content: content.trim(),
      }
    });

    // Update thread timestamp for Inbox sorting
    await prisma.thread.update({
      where: { id: threadId },
      data: { updated_at: new Date() }
    });

    // Revalidate paths for stateless polling
    revalidatePath("/ar/chat/[id]", "page");
    revalidatePath("/en/chat/[id]", "page");
    revalidatePath("/ar/chat", "page");
    revalidatePath("/en/chat", "page");

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to send message" };
  }
}
