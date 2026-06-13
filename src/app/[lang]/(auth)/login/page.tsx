"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/common/Button";
import { InputField } from "@/components/common/InputField";
import { Tractor } from "lucide-react";
import { sendOtpAction } from "@/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) || "ar";

  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await sendOtpAction(phone);
    setIsLoading(false);

    if (res.success) {
      // Pass phone via query param to the verify page
      router.push(`/${lang}/verify?phone=${encodeURIComponent(phone)}`);
    } else {
      setError(res.error || "حدث خطأ غير متوقع");
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="bg-green-50 p-4 rounded-full">
            <Tractor className="h-8 w-8 text-green-700" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {lang === "ar" ? "تسجيل الدخول" : "Login"}
          </h1>
          <p className="text-gray-500 text-sm text-center">
            {lang === "ar" 
              ? "أدخل رقم هاتفك للمتابعة في منصة ريف" 
              : "Enter your phone number to continue to Reef Platform"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label={lang === "ar" ? "رقم الجوال" : "Phone Number"}
            type="tel"
            dir="ltr"
            placeholder="05XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={error}
            required
          />
          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            {lang === "ar" ? "المتابعة" : "Continue"}
          </Button>
        </form>
      </div>
    </main>
  );
}
