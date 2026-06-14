import React from "react";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { ClientThread } from "./ClientThread";

const prisma = new PrismaClient();

export default async function ChatThreadPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const session = await getSession();

  if (!session || !session.userId) {
    redirect(`/${lang}/login`);
  }

  const userId = session.userId as string;

  const thread = await prisma.thread.findUnique({
    where: { id },
    include: {
      listing: true,
      buyer: true,
      seller: true,
      messages: {
        orderBy: { created_at: "asc" }
      }
    }
  });

  if (!thread) {
    notFound();
  }

  // Security: Ensure user is authorized to view this thread
  if (thread.buyer_id !== userId && thread.seller_id !== userId) {
    redirect(`/${lang}/chat`);
  }

  const isBuyer = thread.buyer_id === userId;
  const otherUser = isBuyer ? thread.seller : thread.buyer;

  return (
    <ClientThread 
      threadId={thread.id}
      currentUserId={userId}
      initialMessages={thread.messages}
      lang={lang}
      otherUserId={otherUser.id}
      otherUserName={otherUser.name}
      listingTitle={thread.listing.title}
      isBuyer={isBuyer}
    />
  );
}
