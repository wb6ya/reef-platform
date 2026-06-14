"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { useStore } from "@/store/useStore";
import { cn } from "@/utils/cn";
import { toggleFavorite as toggleFavoriteServer } from "@/actions/favorites";

export function FavoriteButton({ id }: { id: string }) {
  const { favorites, toggleFavorite } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch on initial render

  const isFavorite = favorites.includes(id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Optimistic UI update
    toggleFavorite(id);
    
    // Server database update
    startTransition(async () => {
      await toggleFavoriteServer(id);
    });
  };

  return (
    <div
      role="button"
      onClick={handleToggle}
      className={cn("absolute top-3 end-3 bg-white/90 p-2 rounded-full shadow-sm transition-transform z-10", isPending ? "opacity-70 scale-95" : "hover:scale-110")}
    >
      <Heart className={cn("w-5 h-5 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-gray-600")} />
    </div>
  );
}
