import React from "react";
import { getListingsAction } from "@/actions/listings";
import { ListingGrid } from "@/components/features/ListingGrid";
import { ListingCardProps } from "@/components/features/ListingCard";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const rawListings: any[] = await getListingsAction();

  const formattedListings: ListingCardProps[] = rawListings.map(l => ({
    id: l.id,
    title: l.title,
    price: l.price,
    city: l.city,
    imageUrl: l.media[0]?.url || "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1000&auto=format&fit=crop",
    isVerifiedSeller: l.user.is_verified,
    lang
  }));

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-green-800">
          {lang === "ar" ? "سوقك الزراعي الأول" : "Your Premier Rural Marketplace"}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {lang === "ar" 
            ? "بيع واشتر المواشي والمحاصيل والمعدات الزراعية مباشرة وبدون وسطاء."
            : "Buy and sell livestock, crops, and equipment directly with zero middlemen."}
        </p>
      </section>

      {/* Latest Listings */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {lang === "ar" ? "أحدث الإعلانات" : "Latest Listings"}
          </h2>
        </div>
        
        <ListingGrid listings={formattedListings} />
      </section>
    </main>
  );
}
