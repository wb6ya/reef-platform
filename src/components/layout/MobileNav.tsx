"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react";
import { cn } from "@/utils/cn";

export function MobileNav() {
  const pathname = usePathname();
  const params = useParams();
  const lang = (params.lang as "ar" | "en") || "ar";

  const navItems = [
    { icon: Home, label: lang === "ar" ? "الرئيسية" : "Home", href: `/${lang}` },
    { icon: Search, label: lang === "ar" ? "بحث" : "Search", href: `/${lang}/search` },
    // Center CTA handled separately
    { icon: MessageCircle, label: lang === "ar" ? "رسائل" : "Chats", href: `/${lang}/chat` },
    { icon: User, label: lang === "ar" ? "حسابي" : "Profile", href: `/${lang}/profile` },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 start-0 end-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex items-center justify-around h-16 relative px-2">
        {navItems.slice(0, 2).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full gap-1 text-sm font-medium transition-colors",
                isActive ? "text-green-700" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <item.icon className="w-7 h-7" />
              <span className="text-xs font-bold">{item.label}</span>
            </Link>
          );
        })}

        {/* Elevated Center CTA for Add Listing */}
        <div className="relative -top-6">
          <Link
            href={`/${lang}/listings/create`}
            className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-green-700 text-white shadow-lg border-4 border-white hover:bg-green-800 transition-transform hover:scale-105 active:scale-95"
            aria-label={lang === "ar" ? "أضف إعلان" : "Add Listing"}
          >
            <Plus className="w-8 h-8" />
          </Link>
          <span className="absolute -bottom-5 start-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-green-800">
            {lang === "ar" ? "أضف إعلان" : "Sell"}
          </span>
        </div>

        {navItems.slice(2, 4).map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full gap-1 text-sm font-medium transition-colors",
                isActive ? "text-green-700" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <item.icon className="w-7 h-7" />
              <span className="text-xs font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
