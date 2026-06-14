import React from "react";
import { PrismaClient } from "@prisma/client";
import { SearchFilters } from "@/components/features/SearchFilters";
import { ListingCard } from "@/components/features/ListingCard";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { lang } = await params;
  const resolvedSearchParams = await searchParams;
  
  const q = resolvedSearchParams.q;
  const categoryId = resolvedSearchParams.category;
  const city = resolvedSearchParams.city;

  const categories = await prisma.category.findMany();

  // Build Prisma Where Clause for high-performance server-side filtering
  const where: any = {
    status: "ACTIVE"
  };

  if (categoryId) {
    where.category_id = categoryId;
  }

  if (city) {
    where.city = city;
  }

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const listings = await prisma.listing.findMany({
    where,
    include: {
      category: true,
      media: {
        where: { is_primary: true },
        take: 1
      }
    },
    orderBy: { created_at: "desc" }
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {lang === "ar" ? "تصفح الإعلانات" : "Browse Listings"}
      </h1>

      {/* Client Component for URL manipulation */}
      <SearchFilters categories={categories} lang={lang} />

      {/* Grid Render */}
      {listings.length === 0 ? (
        <div className="bg-white border-2 border-gray-100 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-sm mt-4">
          <p className="text-gray-500 font-bold text-lg">
            {lang === "ar" ? "لم يتم العثور على نتائج تطابق بحثك" : "No results found matching your search"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {listings.map((listing) => (
            <ListingCard 
              key={listing.id}
              id={listing.id}
              title={listing.title}
              price={listing.price}
              city={listing.city}
              imageUrl={listing.media[0]?.url}
              isVerifiedSeller={true} // MVP override
              lang={lang as "ar" | "en"}
              timeElapsed="-"
            />
          ))}
        </div>
      )}
    </div>
  );
}
