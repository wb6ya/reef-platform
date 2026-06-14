import React from "react";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { MessageSquare, Package } from "lucide-react";

const prisma = new PrismaClient();

export default async function InboxPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const session = await getSession();

  if (!session || !session.userId) {
    redirect(`/${lang}/login`);
  }

  const userId = session.userId as string;
  const isAr = lang === "ar";
  const dateLocale = isAr ? ar : enUS;

  const threads = await prisma.thread.findMany({
    where: {
      OR: [
        { buyer_id: userId },
        { seller_id: userId }
      ]
    },
    include: {
      listing: true,
      buyer: true,
      seller: true,
      messages: {
        orderBy: { created_at: "desc" },
        take: 1
      }
    },
    orderBy: { updated_at: "desc" }
  });

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-24">
      <h1 className="text-3xl font-bold text-gray-900">
        {isAr ? "الرسائل" : "Messages"}
      </h1>

      {threads.length === 0 ? (
        <div className="bg-white border-2 border-gray-100 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 font-bold text-lg">
            {isAr ? "لا توجد رسائل حالياً" : "No messages yet"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {threads.map((thread) => {
            const isBuyer = thread.buyer_id === userId;
            const otherUser = isBuyer ? thread.seller : thread.buyer;
            const latestMessage = thread.messages[0];

            return (
              <Link key={thread.id} href={`/${lang}/chat/${thread.id}`}>
                <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl flex items-center gap-4 hover:border-green-600 transition-colors shadow-sm">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex shrink-0 items-center justify-center text-gray-500 font-bold text-xl">
                    {otherUser.name.charAt(0)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-gray-900 text-lg truncate">
                        {otherUser.name}
                      </span>
                      {latestMessage && (
                        <span className="text-xs text-gray-500 font-medium shrink-0" dir={isAr ? "rtl" : "ltr"}>
                          {formatDistanceToNow(new Date(latestMessage.created_at), { addSuffix: true, locale: dateLocale })}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-green-700 font-bold mb-2 truncate bg-green-50 w-fit px-2 py-0.5 rounded-md">
                      <Package className="w-3 h-3" />
                      <span className="truncate">{thread.listing.title}</span>
                    </div>

                    <p className="text-gray-500 font-medium text-sm truncate">
                      {latestMessage ? latestMessage.content : (isAr ? "بدأ محادثة جديدة" : "Started a new conversation")}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
