"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/utils/cn";

export function SearchFilters({
  categories,
  lang
}: {
  categories: any[];
  lang: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("category");
  const currentQuery = searchParams.get("q");

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const isAr = lang === "ar";

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Massive Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder={isAr ? "ابحث عن معدات، مواشي..." : "Search livestock, equipment..."}
          defaultValue={currentQuery || ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParam("q", e.currentTarget.value);
            }
          }}
          className="w-full h-14 bg-white border-2 border-gray-200 rounded-xl px-4 text-lg font-medium focus:outline-none focus:border-green-700 transition-colors shadow-sm"
        />
      </div>

      {/* Touch-Friendly Horizontal Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
        <button
          onClick={() => updateParam("category", null)}
          className={cn(
            "shrink-0 h-10 px-5 rounded-full font-bold text-sm transition-colors border-2 snap-start",
            !currentCategoryId 
              ? "bg-gray-900 text-white border-gray-900 shadow-sm" 
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          )}
        >
          {isAr ? "الكل" : "All"}
        </button>
        
        {categories.map((cat) => {
          const isActive = currentCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => updateParam("category", cat.id)}
              className={cn(
                "shrink-0 h-10 px-5 rounded-full font-bold text-sm transition-colors border-2 snap-start",
                isActive 
                  ? "bg-green-700 text-white border-green-700 shadow-sm" 
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              )}
            >
              {isAr ? cat.name_ar : cat.name_en}
            </button>
          );
        })}
      </div>
    </div>
  );
}
