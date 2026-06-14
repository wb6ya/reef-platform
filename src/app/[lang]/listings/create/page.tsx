"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createListing, getCategories } from "@/actions/listing";
import { compressImage } from "@/utils/image";
import { InputField } from "@/components/common/InputField";
import { SelectField } from "@/components/common/SelectField";
import { Button } from "@/components/common/Button";
import { UploadCloud, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";

export default function CreateListingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const selectedCategoryId = watch("categoryId");
  const listingType = watch("type");
  
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    const newImages = [...images];
    
    for (let i = 0; i < files.length; i++) {
      if (newImages.length >= 5) break; 
      try {
        const compressedBase64 = await compressImage(files[i]);
        newImages.push(compressedBase64);
      } catch (err) {
        console.error("Compression failed", err);
      }
    }
    
    setImages(newImages);
    setIsCompressing(false);
  };

  const onSubmit = async (data: any) => {
    if (images.length === 0) {
      setServerError(lang === "ar" ? "يجب إضافة صورة واحدة على الأقل" : "At least one image is required");
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    // Extract core fields vs dynamic attributes
    const { title, description, city, region, type, price, categoryId, ...attributes } = data;

    const payload = {
      title,
      description,
      city,
      region,
      type: type || "FIXED_PRICE",
      price: type === "NEGOTIABLE" ? null : parseFloat(price),
      categoryId,
      attributes,
      imagesBase64: images,
    };

    const res = await createListing(payload);

    if (res.success) {
      router.push(`/${lang}`);
      router.refresh();
    } else {
      setServerError(res.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {lang === "ar" ? "أضف إعلان جديد" : "Add New Listing"}
        </h1>
        <p className="text-gray-500 font-medium">
          {lang === "ar" 
            ? "الرجاء تعبئة تفاصيل إعلانك بدقة لضمان أفضل تجربة للمشترين." 
            : "Please fill out the details accurately to ensure the best experience for buyers."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        
        {serverError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 font-bold shadow-sm">
            {serverError}
          </div>
        )}

        {/* Massive Touch Image Upload */}
        <div className="flex flex-col gap-4">
          <label className="font-bold text-gray-700">
            {lang === "ar" ? "صور الإعلان (حد أقصى 5 صور)" : "Images (Max 5)"}
          </label>
          <div className="flex flex-wrap gap-4">
            {images.map((base64, idx) => (
              <div key={idx} className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm">
                <img src={base64} alt="Upload preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-2 end-2 bg-white/80 p-1.5 rounded-full text-red-600 hover:bg-white shadow-sm transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            
            {images.length < 5 && (
              <label className="w-32 h-32 rounded-2xl border-2 border-dashed border-green-700/50 bg-green-50 flex flex-col items-center justify-center text-green-700 cursor-pointer hover:bg-green-100 transition-colors shadow-sm">
                <UploadCloud className="w-8 h-8 mb-2" />
                <span className="text-sm font-bold">{isCompressing ? "..." : (lang === "ar" ? "إضافة" : "Add")}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  onChange={handleImageSelect}
                  disabled={isCompressing}
                />
              </label>
            )}
          </div>
        </div>

        {/* Core Fields */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-6 transition-all">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">
            {lang === "ar" ? "المعلومات الأساسية" : "Basic Information"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField 
              label={lang === "ar" ? "عنوان الإعلان" : "Listing Title"} 
              {...register("title", { required: true })} 
              error={errors.title ? "مطلوب" : undefined}
            />
            
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: true }}
              defaultValue=""
              render={({ field }) => (
                <SelectField
                  label={lang === "ar" ? "القسم (التصنيف)" : "Category"}
                  options={categories.map(c => ({ value: c.id, label: lang === "ar" ? c.name_ar : c.name_en }))}
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={errors.categoryId ? "مطلوب" : undefined}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="type"
              control={control}
              rules={{ required: true }}
              defaultValue="FIXED_PRICE"
              render={({ field }) => (
                <SelectField
                  label={lang === "ar" ? "نوع السعر" : "Price Type"}
                  options={[
                    { value: "FIXED_PRICE", label: lang === "ar" ? "سعر ثابت" : "Fixed Price" },
                    { value: "NEGOTIABLE", label: lang === "ar" ? "قابل للتفاوض (على السوم)" : "Negotiable" }
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {listingType !== "NEGOTIABLE" && (
              <InputField 
                label={lang === "ar" ? "السعر (ر.س)" : "Price (SAR)"} 
                type="number" 
                dir="ltr"
                {...register("price", { required: listingType !== "NEGOTIABLE" })} 
                error={errors.price ? "مطلوب" : undefined}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField 
              label={lang === "ar" ? "المدينة" : "City"} 
              {...register("city", { required: true })} 
              error={errors.city ? "مطلوب" : undefined}
            />
            <InputField 
              label={lang === "ar" ? "المنطقة" : "Region"} 
              {...register("region", { required: true })} 
              error={errors.region ? "مطلوب" : undefined}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-700">{lang === "ar" ? "التفاصيل" : "Description"}</label>
            <textarea 
              {...register("description", { required: true })}
              className="w-full bg-gray-50 border-2 border-gray-300 rounded-2xl px-4 py-3 text-lg font-medium focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20 transition-all min-h-[120px]"
            />
            {errors.description && <span className="text-red-500 text-sm font-bold">مطلوب</span>}
          </div>
        </div>

        {/* Dynamic Schema Fields */}
        {selectedCategory && (
          <div className="bg-green-50 p-6 rounded-3xl shadow-sm border border-green-100 flex flex-col gap-6 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold text-green-900 border-b border-green-200 pb-4">
              {lang === "ar" ? "المواصفات المخصصة" : "Specific Attributes"}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(selectedCategory.schema as any[]).map((field) => {
                const isRequired = field.required;
                const fieldLabel = lang === "ar" ? field.label_ar : field.label_en;
                
                if (field.type === "select") {
                  return (
                    <Controller
                      key={field.id}
                      name={field.id}
                      control={control}
                      rules={{ required: isRequired }}
                      defaultValue=""
                      render={({ field: controllerField }) => (
                        <SelectField
                          label={`${fieldLabel} ${!isRequired ? '(اختياري)' : ''}`}
                          options={field.options_ar.map((opt: string, idx: number) => ({
                            value: opt,
                            label: lang === "ar" ? opt : field.options_en[idx]
                          }))}
                          value={controllerField.value || ""}
                          onChange={controllerField.onChange}
                          error={errors[field.id] ? "مطلوب" : undefined}
                        />
                      )}
                    />
                  );
                }

                return (
                  <InputField 
                    key={field.id}
                    label={`${fieldLabel} ${!isRequired ? '(اختياري)' : ''}`} 
                    type={field.type === "number" ? "number" : "text"} 
                    dir={field.type === "number" ? "ltr" : undefined}
                    {...register(field.id, { required: isRequired })} 
                    error={errors[field.id] ? "مطلوب" : undefined}
                  />
                );
              })}
            </div>
          </div>
        )}

        <Button type="submit" isLoading={isSubmitting} className="h-16 text-xl mt-4 shadow-lg shadow-green-700/20">
          {lang === "ar" ? "نشر الإعلان" : "Publish Listing"}
        </Button>
      </form>
    </div>
  );
}
