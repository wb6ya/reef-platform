"use client";

import React, { useState } from "react";
import { ListingCard } from "@/components/features/ListingCard";
import { deleteListing } from "@/actions/listing";
import { Trash2 } from "lucide-react";

export function UserListingsGrid({ 
  listings, 
  lang 
}: { 
  listings: any[];
  lang: "ar" | "en";
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm(lang === "ar" ? "هل أنت متأكد من حذف الإعلان نهائياً؟" : "Are you sure you want to delete this listing?")) {
      return;
    }
    
    setDeletingId(id);
    await deleteListing(id);
    setDeletingId(null);
  };

  if (listings.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-12 flex items-center justify-center text-center">
        <p className="text-gray-500 font-bold text-lg">
          {lang === "ar" ? "لا توجد إعلانات خاصة بك" : "You have no listings"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {listings.map((listing) => (
        <div key={listing.id} className="relative group">
          <ListingCard 
            id={listing.id}
            title={listing.title}
            price={listing.price}
            city={listing.city}
            imageUrl={listing.media[0]?.url}
            timeElapsed="-" // Simplified for now
            lang={lang}
          />
          <button 
            onClick={(e) => handleDelete(e, listing.id)}
            disabled={deletingId === listing.id}
            className="absolute top-2 left-2 z-10 bg-white p-2.5 rounded-full shadow-md text-red-600 hover:bg-red-50 hover:scale-110 transition-all disabled:opacity-50"
            title={lang === "ar" ? "حذف الإعلان" : "Delete Listing"}
          >
            <Trash2 className={`w-5 h-5 ${deletingId === listing.id ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      ))}
    </div>
  );
}
