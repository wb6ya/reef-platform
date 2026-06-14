import React from "react";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, AlertTriangle, User } from "lucide-react";
import { ProfileForm } from "@/components/features/ProfileForm";
import { UserListingsGrid } from "@/components/features/UserListingsGrid";
import { LogoutButton } from "@/components/features/LogoutButton";
import { ListingCard } from "@/components/features/ListingCard";

const prisma = new PrismaClient();

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const session = await getSession();

  if (!session || !session.userId) {
    redirect(`/${lang}/login`);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
  });

  if (!user) {
    redirect(`/${lang}/login`);
  }

  const isVerified = user.verification_status === "VERIFIED";

  const userListings = await prisma.listing.findMany({
    where: { user_id: session.userId as string },
    orderBy: { created_at: "desc" },
    include: {
      media: {
        where: { is_primary: true },
        take: 1
      }
    }
  });

  const favorites = await prisma.favorite.findMany({
    where: { user_id: session.userId as string },
    include: {
      listing: {
        include: {
          media: {
            where: { is_primary: true },
            take: 1
          }
        }
      }
    },
    orderBy: { created_at: "desc" }
  });
  const favoriteListings = favorites.map(f => f.listing);

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
        </h1>
      </div>

      {!isVerified && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 text-yellow-800">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg">
                {lang === "ar" ? "حساب غير موثق" : "Unverified Account"}
              </h3>
              <p className="text-sm font-medium">
                {lang === "ar" 
                  ? "وثق حسابك الآن لكي تتمكن من نشر الإعلانات وكسب ثقة المشترين." 
                  : "Verify your account now to post listings and gain buyer trust."}
              </p>
            </div>
          </div>
          <Link 
            href={`/${lang}/profile/verify`}
            className="whitespace-nowrap bg-yellow-400 text-yellow-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 shadow-sm transition-colors"
          >
            {lang === "ar" ? "توثيق الحساب" : "Verify Now"}
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card & Actions */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-700 shrink-0">
                <User className="w-8 h-8" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900 truncate">{user.name}</h2>
                  {isVerified && <BadgeCheck className="w-5 h-5 text-green-600 shrink-0" />}
                </div>
                <span className="text-gray-500 font-medium text-sm dir-ltr text-left">
                  {user.phone}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <ProfileForm initialData={{ name: user.name, email: user.email }} lang={lang as "ar" | "en"} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <LogoutButton lang={lang as "ar" | "en"} />
          </div>
        </div>

        {/* Right Column: Listings Manager & Favorites */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* My Listings */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {lang === "ar" ? "إعلاناتي" : "My Listings"}
              </h2>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-100">
                {userListings.length} {lang === "ar" ? "إعلان" : "Listings"}
              </span>
            </div>
            
            <UserListingsGrid listings={userListings} lang={lang as "ar" | "en"} />
          </div>

          {/* My Favorites */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {lang === "ar" ? "المفضلة" : "My Favorites"}
              </h2>
              <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-bold border border-red-100">
                {favoriteListings.length} {lang === "ar" ? "إعلان" : "Listings"}
              </span>
            </div>
            
            {favoriteListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteListings.map(listing => (
                  <ListingCard
                    key={listing.id}
                    id={listing.id}
                    title={listing.title}
                    price={listing.price}
                    city={listing.city}
                    imageUrl={listing.media[0]?.url}
                    lang={lang as "ar" | "en"}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 font-medium">
                {lang === "ar" ? "لا توجد إعلانات مفضلة" : "No favorite listings yet"}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
