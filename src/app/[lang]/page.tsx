import { ListingCard } from "@/components/features/ListingCard";
import { PrismaClient } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";

const prisma = new PrismaClient();

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isAr = lang === "ar";
  const dateLocale = isAr ? ar : enUS;
  
  const listings = await prisma.listing.findMany({
    orderBy: { created_at: 'desc' },
    include: { 
      media: {
        where: { is_primary: true },
        take: 1
      }, 
      category: true,
      user: true
    }
  });

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center gap-4 bg-green-700 text-white p-8 rounded-3xl shadow-sm">
        <h1 className="text-3xl md:text-5xl font-bold">
          {lang === "ar" ? "مرحباً بك في منصة ريف" : "Welcome to Reef Platform"}
        </h1>
        <p className="text-lg md:text-xl text-green-50 max-w-2xl">
          {lang === "ar" 
            ? "المنصة الأولى في المنطقة المخصصة لقطاع الزراعة، الثروة الحيوانية، والمعدات الريفية. نربط المزارع بالمشتري مباشرة." 
            : "The premier platform dedicated to agriculture, livestock, and rural equipment. Connecting farmers directly with buyers."}
        </p>
      </div>
      
      {/* Latest Listings Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {lang === "ar" ? "أحدث الإعلانات" : "Latest Listings"}
          </h2>
        </div>

        {listings.length === 0 ? (
          <div className="bg-white border-2 border-gray-100 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
            <p className="text-gray-500 font-bold text-lg">
              {lang === "ar" ? "لا توجد إعلانات حالياً" : "No listings yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard 
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                city={listing.city}
                imageUrl={listing.media[0]?.url}
                timeElapsed={formatDistanceToNow(new Date(listing.created_at), { addSuffix: true, locale: dateLocale })}
                isVerifiedSeller={listing.user?.verification_status === "VERIFIED"}
                lang={lang as "ar" | "en"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
