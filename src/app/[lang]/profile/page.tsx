import React from "react";
import { redirect } from "next/navigation";
import { getSessionUserId, destroySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User, LogOut, CheckCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/common/Button";
import Link from "next/link";
import { logoutAction } from "@/actions/auth";

export default async function ProfilePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const userId = await getSessionUserId();

  if (!userId) {
    redirect(`/${lang}/login`);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    await destroySession();
    redirect(`/${lang}/login`);
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="h-24 w-24 bg-green-100 text-green-700 rounded-full flex items-center justify-center shrink-0">
          <User className="h-12 w-12" />
        </div>
        
        <div className="flex-1 text-center md:text-start space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500" dir="ltr">{user.phone}</p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
            {user.is_verified ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                <CheckCircle className="h-4 w-4" />
                {lang === "ar" ? "بائع موثق" : "Verified Seller"}
              </span>
            ) : (
              <Link href={`/${lang}/profile/verify`}>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors rounded-full text-sm font-medium border border-amber-200 cursor-pointer">
                  <ShieldAlert className="h-4 w-4" />
                  {lang === "ar" ? "إكمال التوثيق" : "Complete Verification"}
                </span>
              </Link>
            )}
            <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {user.role}
            </span>
          </div>
        </div>

        <form action={logoutAction} className="mt-4 md:mt-0">
          <Button variant="outline" type="submit" className="gap-2">
            <LogOut className="h-4 w-4" />
            {lang === "ar" ? "تسجيل الخروج" : "Logout"}
          </Button>
        </form>
      </div>

      {/* Tabs / Listings Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
          {lang === "ar" ? "إعلاناتي" : "My Listings"}
        </h2>
        
        <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">
            {lang === "ar" ? "لم تقم بنشر أي إعلانات حتى الآن." : "You haven't posted any listings yet."}
          </p>
          <Link href={`/${lang}/listings/create`}>
            <Button variant="primary">
              {lang === "ar" ? "أضف أول إعلان" : "Add First Listing"}
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
