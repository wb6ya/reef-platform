"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { requestLoginOTP, verifyOTP } from "@/actions/auth";
import { InputField } from "@/components/common/InputField";
import { Button } from "@/components/common/Button";
import Link from "next/link";

export default function LoginPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const fd = new FormData();
    fd.append("phone", phone);

    const res = await requestLoginOTP(fd);
    if (res.success) {
      setStep(2);
    } else {
      setError(res.error || "Something went wrong.");
    }
    
    setIsLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const fd = new FormData();
    fd.append("phone", phone);
    fd.append("code", otp);

    const res = await verifyOTP(fd);
    if (res.success) {
      router.push(`/${lang}/profile`);
      router.refresh();
    } else {
      setError(res.error || "Invalid code.");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="bg-white border-2 border-gray-100 shadow-sm p-6 md:p-8 rounded-3xl w-full max-w-md">
        
        <div className="flex flex-col items-center text-center gap-2 mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-2xl mb-2 shadow-sm">
            🔒
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {lang === "ar" ? "تسجيل الدخول" : "Login"}
          </h1>
          <p className="text-gray-500 font-medium">
            {step === 1 
              ? (lang === "ar" ? "أدخل رقم جوالك للمتابعة" : "Enter your phone number")
              : (lang === "ar" ? "أدخل الرمز المرسل إلى جوالك" : "Enter the OTP code")}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestOTP} className="flex flex-col gap-6">
            <InputField
              label={lang === "ar" ? "رقم الجوال" : "Phone Number"}
              type="tel"
              placeholder="05XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              dir="ltr"
              className="text-left" // Ensure numbers type LTR cleanly
              error={error || undefined}
            />
            <Button type="submit" isLoading={isLoading} className="w-full">
              {lang === "ar" ? "طلب رمز التحقق" : "Request OTP"}
            </Button>

            <p className="text-center text-gray-500 font-medium mt-4">
              {lang === "ar" ? "ليس لديك حساب؟ " : "Don't have an account? "}
              <Link href={`/${lang}/register`} className="text-green-700 font-bold hover:underline">
                {lang === "ar" ? "إنشاء حساب جديد" : "Register now"}
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-6">
            <InputField
              label={lang === "ar" ? "رمز التحقق" : "OTP Code"}
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              dir="ltr"
              className="text-center tracking-widest text-2xl font-bold"
              error={error || undefined}
            />
            <div className="flex flex-col gap-3">
              <Button type="submit" isLoading={isLoading} className="w-full">
                {lang === "ar" ? "تحقق ودخول" : "Verify & Login"}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setStep(1)}
                disabled={isLoading}
              >
                {lang === "ar" ? "تعديل رقم الجوال" : "Change Phone Number"}
              </Button>
            </div>
          </form>
        )}
        
      </div>
    </div>
  );
}
