"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { InputField } from "@/components/common/InputField";
import { Button } from "@/components/common/Button";
import { updateProfile } from "@/actions/user";

export function ProfileForm({ 
  initialData, 
  lang 
}: { 
  initialData: { name: string; email: string | null };
  lang: "ar" | "en";
}) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: initialData.name,
      email: initialData.email || "",
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setFeedback(null);
    
    const res = await updateProfile(data);
    
    if (res.success) {
      setFeedback({ type: "success", msg: lang === "ar" ? "تم تحديث البيانات بنجاح" : "Profile updated successfully" });
    } else {
      setFeedback({ type: "error", msg: res.error || "Error" });
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {feedback && (
        <div className={`p-4 rounded-xl font-bold ${feedback.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {feedback.msg}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField 
          label={lang === "ar" ? "الاسم" : "Name"}
          {...register("name", { required: true, minLength: 2 })}
          error={errors.name ? "مطلوب" : undefined}
        />
        <InputField 
          label={lang === "ar" ? "البريد الإلكتروني (اختياري)" : "Email (Optional)"}
          type="email"
          dir="ltr"
          {...register("email")}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          {lang === "ar" ? "حفظ التعديلات" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
