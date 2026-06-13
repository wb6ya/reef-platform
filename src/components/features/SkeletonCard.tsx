import * as React from "react";

export const SkeletonCard: React.FC = () => {
  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] w-full bg-gray-200"></div>

      {/* Content Skeleton */}
      <div className="p-4 flex flex-col gap-3">
        {/* Title Lines */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Footer info */}
        <div className="mt-4 flex items-center justify-between">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};
