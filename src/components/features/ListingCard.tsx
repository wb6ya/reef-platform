import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, BadgeCheck } from "lucide-react";

export interface ListingCardProps {
  id: string;
  title: string;
  price: number | null;
  city: string;
  imageUrl: string;
  isVerifiedSeller?: boolean;
  lang: string;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  id,
  title,
  price,
  city,
  imageUrl,
  isVerifiedSeller = false,
  lang,
}) => {
  return (
    <Link href={`/${lang}/listings/${id}`} className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight">
            {title}
          </h3>
          {isVerifiedSeller && (
            <BadgeCheck className="h-5 w-5 text-green-600 shrink-0" aria-label="Verified Seller" />
          )}
        </div>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <p className="font-bold text-green-700">
            {price !== null ? (lang === "ar" ? `${price} ريال` : `${price} SAR`) : (lang === "ar" ? "على السوم" : "Negotiable")}
          </p>
          <div className="flex items-center text-gray-500 text-sm gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate max-w-[80px]">{city}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
