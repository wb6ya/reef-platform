"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { sendMessage } from "@/actions/chat";
import { Send, ChevronRight, ChevronLeft, Package } from "lucide-react";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";

export function ClientThread({
  threadId,
  currentUserId,
  initialMessages,
  lang,
  otherUserId,
  otherUserName,
  listingTitle,
  isBuyer
}: {
  threadId: string;
  currentUserId: string;
  initialMessages: any[];
  lang: string;
  otherUserId: string;
  otherUserName: string;
  listingTitle: string;
  isBuyer: boolean;
}) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const isAr = lang === "ar";
  const dateLocale = isAr ? ar : enUS;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [initialMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [router]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSending(true);
    const res = await sendMessage(threadId, content);
    if (res.success) {
      setContent("");
      router.refresh();
    }
    setIsSending(false);
  };

  const handleReviewSubmit = async () => {
    setIsSubmittingReview(true);
    // dynamically import the action to avoid circular deps if any, or just import at top
    const { submitReview } = await import("@/actions/reviews");
    const res = await submitReview(otherUserId, rating, reviewComment);
    if (res.success) {
      setShowRating(false);
      setReviewComment("");
    } else {
      alert(res.error);
    }
    setIsSubmittingReview(false);
  };

  return (
    <div className="fixed inset-0 md:top-[80px] z-[60] md:z-40 bg-[#EFEAE2] flex flex-col">
      {/* Thread Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 px-3 py-3 flex items-center gap-3 shrink-0 shadow-sm z-20">
        <Link href={`/${lang}/chat`} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors shrink-0">
          {isAr ? <ChevronRight className="w-7 h-7 text-gray-700" /> : <ChevronLeft className="w-7 h-7 text-gray-700" />}
        </Link>
        <div className="w-11 h-11 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-lg shrink-0">
          {otherUserName.charAt(0)}
        </div>
        <div className="flex flex-col min-w-0">
          <h2 className="font-bold text-gray-900 text-lg leading-tight truncate">{otherUserName}</h2>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 truncate mt-0.5">
            <Package className="w-3 h-3 shrink-0" />
            <span className="truncate">{isAr ? "بخصوص إعلان:" : "Regarding:"} <span className="text-gray-700">{listingTitle}</span></span>
          </div>
        </div>
        
        {isBuyer && (
          <button 
            onClick={() => setShowRating(true)}
            className="ms-auto shrink-0 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full text-xs font-bold border border-yellow-200 shadow-sm transition-colors hover:bg-yellow-100"
          >
            {isAr ? "تقييم" : "Rate"}
          </button>
        )}
      </div>

      {showRating && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 text-center">
              {isAr ? "تقييم البائع" : "Rate Seller"}
            </h3>
            
            <div className="flex justify-center gap-2 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  onClick={() => setRating(star)}
                  className={cn("text-3xl transition-transform hover:scale-110", star <= rating ? "text-yellow-400" : "text-gray-200")}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea 
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder={isAr ? "أضف تعليقاً (اختياري)..." : "Add a comment (optional)..."}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              rows={3}
            />

            <div className="flex gap-3 mt-2">
              <button 
                onClick={() => setShowRating(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button 
                onClick={handleReviewSubmit}
                disabled={isSubmittingReview}
                className="flex-1 bg-yellow-400 text-yellow-900 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50 shadow-sm"
              >
                {isSubmittingReview ? "..." : (isAr ? "تأكيد" : "Submit")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bubble Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {initialMessages.map((msg) => {
          const isMine = msg.sender_id === currentUserId;
          return (
            <div key={msg.id} className={cn("flex max-w-[85%]", isMine ? "self-end" : "self-start")}>
              <div className={cn(
                "px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-sm max-w-full break-words relative",
                isMine 
                  ? "bg-[#D9FDD3] text-gray-900 rounded-te-sm" // WhatsApp style green
                  : "bg-white border border-gray-100 text-gray-900 rounded-ts-sm"
              )}>
                {msg.content}
                <div className="text-[10px] mt-1 text-end opacity-60 font-medium" dir={isAr ? "rtl" : "ltr"}>
                  {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: dateLocale })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#EFEAE2]/90 backdrop-blur-md p-3 shrink-0 z-20 pb-safe">
        <form onSubmit={handleSend} className="container mx-auto max-w-2xl flex gap-2 items-end">
          <div className="flex-1 bg-white rounded-3xl px-4 py-1.5 shadow-sm min-h-[52px] flex items-center border border-gray-200 focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-600/20 transition-all">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isAr ? "اكتب رسالة..." : "Type a message..."}
              className="w-full text-[16px] font-medium focus:outline-none bg-transparent"
              autoComplete="off"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSending || !content.trim()}
            className="w-[52px] h-[52px] rounded-full bg-[#00A884] text-white flex items-center justify-center hover:bg-[#008f6f] disabled:opacity-50 transition-colors shrink-0 shadow-md"
          >
            <Send className={cn("w-5 h-5", isAr && "rotate-180 -ml-1", !isAr && "-mr-1")} />
          </button>
        </form>
      </div>
    </div>
  );
}
