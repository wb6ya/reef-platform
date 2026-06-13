"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Home, Grid, PlusCircle, MessageSquare, User } from "lucide-react";
import { cn } from "@/utils/cn";

export const MobileNav = () => {
  const params = useParams();
  const pathname = usePathname();
  const lang = (params.lang as string) || "ar";

  const navItems = [
    { href: `/${lang}`, icon: Home, label: lang === "ar" ? "الرئيسية" : "Home" },
    { href: `/${lang}/categories`, icon: Grid, label: lang === "ar" ? "الأقسام" : "Categories" },
    { href: `/${lang}/listings/create`, icon: PlusCircle, label: lang === "ar" ? "أضف إعلان" : "Add", special: true },
    { href: `/${lang}/chat`, icon: MessageSquare, label: lang === "ar" ? "الرسائل" : "Chats" },
    { href: `/${lang}/profile`, icon: User, label: lang === "ar" ? "حسابي" : "Profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 start-0 end-0 bg-white border-t border-gray-200 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <ul className="flex items-center justify-between px-2 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== `/${lang}` && pathname.startsWith(item.href));
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors min-h-[44px]",
                  isActive ? "text-green-700" : "text-gray-500 hover:text-green-600"
                )}
              >
                {item.special ? (
                  <div className="bg-green-700 text-white p-2 rounded-full -mt-5 border-4 border-white shadow-sm">
                    <item.icon className="h-6 w-6" />
                  </div>
                ) : (
                  <item.icon className={cn("h-5 w-5", isActive && "fill-green-700/20")} />
                )}
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
