"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UploadCloud, FileText } from "lucide-react";
import { Button } from "@/components/common/Button";
import { verifySellerAction } from "@/actions/auth";

export default function SellerVerificationPage() {
  const params = useParams();
  const router = useRouter();
  const lang = (params.lang as string) || "ar";

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate file upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const res = await verifySellerAction();
    
    setIsLoading(false);
    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push(`/${lang}/profile`);
      }, 2000);
    }
  };

  if (isSuccess) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-green-100 text-center space-y-4">
          <div className="mx-auto bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-green-700" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {lang === "ar" ? "تم رفع المستندات بنجاح!" : "Documents Uploaded Successfully!"}
          </h2>
          <p className="text-gray-500">
            {lang === "ar" ? "جاري توجيهك للملف الشخصي..." : "Redirecting you to profile..."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {lang === "ar" ? "توثيق حساب البائع" : "Seller Verification"}
        </h1>
        <p className="text-gray-500 mb-8">
          {lang === "ar" 
            ? "للحصول على شارة البائع الموثق، يرجى رفع شهادة التسجيل الزراعي أو وثيقة العمل الحر."
            : "To get the Verified Seller badge, please upload your agricultural registration certificate or freelance document."}
        </p>

        <form onSubmit={handleUpload} className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
            <UploadCloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 font-medium mb-1">
              {lang === "ar" ? "اضغط لاختيار ملف أو اسحب الملف هنا" : "Click to select a file or drag it here"}
            </p>
            <p className="text-sm text-gray-400">PDF, JPG, PNG (Max 10MB)</p>
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            {lang === "ar" ? "رفع واعتماد المستندات" : "Upload & Verify Documents"}
          </Button>
        </form>
      </div>
    </main>
  );
}
