import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, BadgeCheck } from "lucide-react";
import { FavoriteButton } from "@/components/features/FavoriteButton";

export interface ListingCardProps {
  id: string;
  title: string;
  price?: number | null;
  city: string;
  imageUrl?: string;
  timeElapsed?: string;
  isVerifiedSeller?: boolean;
  lang: "ar" | "en";
}

export function ListingCard({
  id,
  title,
  price,
  city,
  imageUrl,
  timeElapsed,
  isVerifiedSeller,
  lang,
}: ListingCardProps) {
  return (
    <Link href={`/${lang}/listings/${id}`} className="group block">
      <div className="flex flex-col bg-white rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-green-700/30 relative">
        
        <FavoriteButton id={id} />

        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 font-bold text-sm">
              No Image
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="flex flex-col p-4 gap-3">
          {/* Title & Price Row */}
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{title}</h3>
            <span className="font-bold text-green-700 whitespace-nowrap text-lg">
              {price ? `${price} ${lang === "ar" ? "ر.س" : "SAR"}` : (lang === "ar" ? "قابل للتفاوض" : "Negotiable")}
            </span>
          </div>

          {/* Meta Information */}
          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex items-center gap-1.5 text-gray-500 font-medium text-sm">
              <MapPin className="w-4 h-4 text-green-700" />
              <span className="truncate">{city}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-gray-500 font-medium text-xs">
                <Clock className="w-4 h-4" />
                <span>{timeElapsed}</span>
              </div>
              
              {isVerifiedSeller && (
                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-bold border border-green-200">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span>{lang === "ar" ? "مزارع موثق" : "Verified"}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </Link>
  );
}
