"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import { Search, Globe, Leaf, User, MessageCircle } from "lucide-react";
import { Button } from "@/components/common/Button";

export function Navbar({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as "ar" | "en") || "ar";
  
  const isEn = lang === "en";
  
  const toggleLanguage = () => {
    const newLang = isEn ? "ar" : "en";
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`) || `/${newLang}`;
    router.push(newPath);
  };

  return (
    <header className="hidden md:flex sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-6">
        
        {/* Brand */}
        <Link href={`/${lang}`} className="flex items-center gap-2 group">
          <div className="bg-green-700 p-2 rounded-xl group-hover:bg-green-800 transition-colors shadow-sm">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold text-gray-900 tracking-tight">
            {lang === "ar" ? "منصة ريف" : "Reef"}
          </span>
        </Link>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-2xl relative">
          <input
            type="text"
            placeholder={lang === "ar" ? "ابحث عن معدات، مواشي، أو محاصيل..." : "Search livestock, equipment..."}
            className="w-full h-14 bg-gray-50 border-2 border-gray-300 rounded-xl px-4 pe-14 text-lg font-medium focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20 transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                router.push(`/${lang}/search?q=${e.currentTarget.value}`);
              }
            }}
          />
          <button className="absolute inset-y-0 end-0 px-4 flex items-center text-gray-500 hover:text-green-700 transition-colors">
            <Search className="w-6 h-6" />
          </button>
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 h-14 px-4 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-bold text-lg border-2 border-transparent"
          >
            <Globe className="w-6 h-6" />
            <span>{isEn ? "عربي" : "English"}</span>
          </button>
          
          {isAuthenticated ? (
            <>
              <Link href={`/${lang}/listings/create`}>
                <Button variant="primary" className="h-14 shadow-md">
                  {lang === "ar" ? "+ أضف إعلان" : "+ Add Listing"}
                </Button>
              </Link>
              <Link href={`/${lang}/chat`} className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors shadow-sm" title={lang === "ar" ? "الرسائل" : "Messages"}>
                <MessageCircle className="w-6 h-6" />
              </Link>
              <Link href={`/${lang}/profile`} className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-700 hover:bg-green-200 transition-colors shadow-sm" title={lang === "ar" ? "حسابي" : "Profile"}>
                <User className="w-6 h-6" />
              </Link>
            </>
          ) : (
            <Link href={`/${lang}/login`}>
              <Button variant="outline" className="h-14">
                {lang === "ar" ? "دخول" : "Login"}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
