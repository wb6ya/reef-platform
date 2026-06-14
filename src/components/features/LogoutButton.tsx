"use client";

import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { logout } from "@/actions/auth";
import { useRouter } from "next/navigation";

export function LogoutButton({ lang }: { lang: "ar" | "en" }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center gap-3 p-4 hover:bg-red-50 text-red-600 rounded-xl transition-colors font-bold text-lg w-full disabled:opacity-50"
    >
      <LogOut className="w-5 h-5" />
      {lang === "ar" ? "تسجيل الخروج" : "Logout"}
    </button>
  );
}
