"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { requestRegistrationOTP, verifyOTP } from "@/actions/auth";
import { InputField } from "@/components/common/InputField";
import { Button } from "@/components/common/Button";
import Link from "next/link";

export default function RegisterPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    otp: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("phone", formData.phone);
    if (formData.email) fd.append("email", formData.email);
    fd.append("password", formData.password);

    const res = await requestRegistrationOTP(fd);
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
    fd.append("phone", formData.phone);
    fd.append("code", formData.otp);

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
    <div className="flex items-center justify-center min-h-[70vh] px-4 py-8">
      <div className="bg-white border-2 border-gray-100 shadow-sm p-6 md:p-8 rounded-3xl w-full max-w-md">
        
        <div className="flex flex-col items-center text-center gap-2 mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-2xl mb-2 shadow-sm">
            📝
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {lang === "ar" ? "إنشاء حساب" : "Register"}
          </h1>
          <p className="text-gray-500 font-medium">
            {step === 1 
              ? (lang === "ar" ? "أدخل بياناتك لإنشاء حساب جديد" : "Enter your details to create an account")
              : (lang === "ar" ? "أدخل الرمز المرسل إلى جوالك" : "Enter the OTP code")}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestOTP} className="flex flex-col gap-5">
            <InputField
              label={lang === "ar" ? "الاسم الكامل" : "Full Name"}
              type="text"
              placeholder={lang === "ar" ? "محمد عبدالله" : "John Doe"}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <InputField
              label={lang === "ar" ? "رقم الجوال" : "Phone Number"}
              type="tel"
              placeholder="05XXXXXXXX"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
              dir="ltr"
              className="text-left"
            />
            <InputField
              label={lang === "ar" ? "البريد الإلكتروني (اختياري)" : "Email (Optional)"}
              type="email"
              placeholder="example@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              dir="ltr"
              className="text-left"
            />
            <InputField
              label={lang === "ar" ? "كلمة المرور" : "Password"}
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              dir="ltr"
              className="text-left"
            />
            
            {error && <p className="text-red-500 font-bold text-sm text-center">{error}</p>}

            <Button type="submit" isLoading={isLoading} className="w-full mt-2">
              {lang === "ar" ? "تسجيل" : "Register"}
            </Button>

            <p className="text-center text-gray-500 font-medium mt-4">
              {lang === "ar" ? "لديك حساب بالفعل؟ " : "Already have an account? "}
              <Link href={`/${lang}/login`} className="text-green-700 font-bold hover:underline">
                {lang === "ar" ? "سجل دخولك" : "Log in"}
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-6">
            <InputField
              label={lang === "ar" ? "رمز التحقق (1234)" : "OTP Code (1234)"}
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder="1234"
              value={formData.otp}
              onChange={(e) => setFormData({...formData, otp: e.target.value})}
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
                {lang === "ar" ? "تعديل البيانات" : "Change Details"}
              </Button>
            </div>
          </form>
        )}
        
      </div>
    </div>
  );
}
