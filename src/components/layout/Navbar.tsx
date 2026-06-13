"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Search, Globe, Tractor } from "lucide-react";
import { Button } from "@/components/common/Button";

export const Navbar = () => {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const lang = (params.lang as string) || "ar";

  const toggleLang = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    // Replace the current language in the pathname
    const newPathname = pathname.replace(`/${lang}`, `/${newLang}`);
    router.push(newPathname || `/${newLang}`);
  };

  return (
    <header className="hidden md:block sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2 text-green-700 hover:opacity-90 transition-opacity min-h-[44px]">
          <Tractor className="h-8 w-8" />
          <span className="text-xl font-bold font-arabic">منصة ريف</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder={lang === "ar" ? "ابحث عن مواشي، شتلات، معدات..." : "Search livestock, plants, equipment..."}
            className="w-full h-11 ps-10 pe-4 rounded-full border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-700 transition-colors text-sm"
          />
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={toggleLang} className="gap-2 h-11" aria-label="Toggle language">
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">{lang === "ar" ? "English" : "العربية"}</span>
          </Button>
          <Link href={`/${lang}/listings/create`}>
            <Button variant="primary" className="h-11">
              {lang === "ar" ? "أضف إعلان" : "Add Listing"}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
