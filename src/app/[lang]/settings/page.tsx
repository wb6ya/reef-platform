import React from "react";
import { getSession } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { logoutUser } from "@/actions/settings";
import { LogOut, Globe, User, BadgeCheck, ShieldAlert } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isAr = lang === "ar";
  
  const session = await getSession();
  let user = null;

  if (session && session.userId) {
    user = await prisma.user.findUnique({
      where: { id: session.userId as string }
    });
  }

  const handleLogout = async () => {
    "use server";
    await logoutUser(lang);
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto pb-24">
      <h1 className="text-3xl font-bold text-gray-900">
        {isAr ? "الإعدادات" : "Settings"}
      </h1>

      {/* Profile Overview */}
      <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
          {isAr ? "الملف الشخصي" : "Profile"}
        </h2>
        
        {user ? (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-2xl shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900 truncate">{user.name}</span>
                {user.verification_status === "VERIFIED" && (
                  <BadgeCheck className="w-6 h-6 text-green-600 shrink-0" />
                )}
              </div>
              <span className="text-gray-500 font-medium font-mono truncate" dir="ltr">
                {user.phone}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center gap-4 py-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <User className="w-8 h-8" />
            </div>
            <p className="text-gray-500 font-bold">
              {isAr ? "قم بتسجيل الدخول للوصول إلى الميزات الكاملة" : "Log in to access full features"}
            </p>
            <Link 
              href={`/${lang}/login`}
              className="bg-green-700 text-white font-bold px-8 py-3 rounded-xl hover:bg-green-800 transition-colors"
            >
              {isAr ? "تسجيل الدخول" : "Log In"}
            </Link>
          </div>
        )}

        {user && user.verification_status === "UNVERIFIED" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mt-2">
            <ShieldAlert className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-2">
              <span className="text-red-900 font-bold">
                {isAr ? "حساب غير موثق" : "Unverified Account"}
              </span>
              <span className="text-red-700 text-sm font-medium">
                {isAr 
                  ? "قم بتوثيق حسابك لتتمكن من إضافة إعلانات والظهور كموثوق." 
                  : "Verify your account to post listings and appear trusted."}
              </span>
              <Link 
                href={`/${lang}/profile/verify`}
                className="bg-red-600 text-white font-bold w-fit px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors mt-1"
              >
                {isAr ? "توثيق الآن" : "Verify Now"}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Language Toggle */}
      <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
          <Globe className="w-6 h-6 text-green-700" />
          <h2 className="text-xl font-bold text-gray-900">
            {isAr ? "لغة التطبيق" : "App Language"}
          </h2>
        </div>

        <div className="flex gap-4 mt-2">
          <a 
            href="/ar/settings"
            className={`flex-1 h-14 rounded-xl flex items-center justify-center font-bold text-lg border-2 transition-colors ${
              isAr ? 'bg-green-50 border-green-700 text-green-800' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            العربية
          </a>
          <a 
            href="/en/settings"
            className={`flex-1 h-14 rounded-xl flex items-center justify-center font-bold text-lg border-2 transition-colors ${
              !isAr ? 'bg-green-50 border-green-700 text-green-800' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            English
          </a>
        </div>
      </div>

      {/* Secure Logout */}
      {user && (
        <form action={handleLogout} className="mt-4">
          <button 
            type="submit" 
            className="w-full h-14 bg-red-50 text-red-600 font-bold text-lg rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors border-2 border-red-100"
          >
            <LogOut className="w-6 h-6" />
            {isAr ? "تسجيل الخروج" : "Log Out"}
          </button>
        </form>
      )}
    </div>
  );
}
