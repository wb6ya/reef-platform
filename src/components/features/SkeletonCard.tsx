import React from "react";

export function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] w-full bg-gray-200" />

      {/* Content Skeleton */}
      <div className="flex flex-col p-4 gap-4">
        {/* Title & Price Skeleton */}
        <div className="flex justify-between items-start gap-4">
          <div className="h-6 bg-gray-200 rounded-md w-2/3" />
          <div className="h-6 bg-gray-200 rounded-md w-1/4" />
        </div>

        {/* Meta Information Skeleton */}
        <div className="flex flex-col gap-3 mt-auto pt-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded-full" />
            <div className="h-4 bg-gray-200 rounded-md w-1/3" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-1/2">
              <div className="w-4 h-4 bg-gray-200 rounded-full" />
              <div className="h-3 bg-gray-200 rounded-md w-1/2" />
            </div>
            <div className="h-6 bg-gray-200 rounded-full w-1/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
