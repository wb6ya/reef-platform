"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { submitVerification } from "@/actions/verify";
import { InputField } from "@/components/common/InputField";
import { Button } from "@/components/common/Button";
import { ShieldCheck } from "lucide-react";

export default function VerifyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const [docNumber, setDocNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await submitVerification(docNumber);
    if (res.success) {
      router.push(`/${lang}/profile`);
      router.refresh();
    } else {
      setError(res.error || "Submission failed.");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="bg-white border-2 border-gray-100 shadow-sm p-6 md:p-8 rounded-3xl w-full max-w-md">
        
        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-700">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {lang === "ar" ? "توثيق الحساب" : "Account Verification"}
            </h1>
            <p className="text-gray-500 font-medium">
              {lang === "ar" 
                ? "أدخل رقم الهوية الوطنية أو سجل المزرعة لتوثيق حسابك ورفع موثوقيتك لدى المشترين." 
                : "Enter your National ID or Farm Permit number to verify your account."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <InputField
            label={lang === "ar" ? "رقم الهوية / السجل" : "ID / Permit Number"}
            type="text"
            inputMode="numeric"
            placeholder="10XXXXXXXX"
            value={docNumber}
            onChange={(e) => setDocNumber(e.target.value)}
            required
            dir="ltr"
            className="text-left font-mono text-lg"
            error={error || undefined}
          />
          
          <Button type="submit" isLoading={isLoading} className="w-full">
            {lang === "ar" ? "إرسال طلب التوثيق" : "Submit Verification"}
          </Button>

          <p className="text-xs text-center text-gray-400 mt-2 font-medium">
            {lang === "ar" 
              ? "لأغراض العرض التجريبي (MVP)، سيتم توثيق الحساب فوراً." 
              : "For MVP demo purposes, the account will be verified immediately."}
          </p>
        </form>
        
      </div>
    </div>
  );
}
