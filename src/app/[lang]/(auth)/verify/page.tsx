"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/common/Button";
import { InputField } from "@/components/common/InputField";
import { ShieldCheck } from "lucide-react";
import { verifyOtpAction } from "@/actions/auth";

function VerifyForm() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const lang = (params.lang as string) || "ar";
  const phone = searchParams.get("phone") || "";

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError(lang === "ar" ? "رقم الهاتف غير متوفر" : "Phone number missing");
      return;
    }

    setIsLoading(true);
    setError("");

    const res = await verifyOtpAction(phone, otp);
    setIsLoading(false);

    if (res.success) {
      router.push(`/${lang}/profile`);
    } else {
      setError(res.error || "حدث خطأ غير متوقع");
    }
  };

  return (
    <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="bg-amber-50 p-4 rounded-full">
          <ShieldCheck className="h-8 w-8 text-amber-700" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {lang === "ar" ? "رمز التحقق" : "Verification Code"}
        </h1>
        <p className="text-gray-500 text-sm text-center">
          {lang === "ar" 
            ? `أدخل الرمز (1234) المرسل إلى ${phone}` 
            : `Enter the code (1234) sent to ${phone}`}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label={lang === "ar" ? "رمز التحقق (1234 للمعاينة)" : "OTP Code (1234 to test)"}
          type="text"
          dir="ltr"
          placeholder="1234"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          error={error}
          required
        />
        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
          {lang === "ar" ? "تأكيد الدخول" : "Verify & Login"}
        </Button>
      </form>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 w-full max-w-sm rounded-2xl"></div>}>
        <VerifyForm />
      </Suspense>
    </main>
  );
}
