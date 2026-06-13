"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCategoriesAction } from "@/actions/categories";
import { createListingAction } from "@/actions/listings";
import { Button } from "@/components/common/Button";
import { InputField } from "@/components/common/InputField";
import { SelectField } from "@/components/common/SelectField";
import { UploadCloud } from "lucide-react";

export default function CreateListingWizard() {
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) || "ar";

  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [dynamicValues, setDynamicValues] = useState<Record<string, any>>({});
  const [imageUrl, setImageUrl] = useState("");
  const [details, setDetails] = useState({ title: "", description: "", price: "", city: "", region: "" });

  useEffect(() => {
    getCategoriesAction().then(setCategories);
  }, []);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    const res = await createListingAction({
      title: details.title,
      description: details.description,
      price: details.price ? Number(details.price) : null,
      city: details.city,
      region: details.region,
      categoryId: selectedCat!.id,
      dynamic_attributes: dynamicValues,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1000&auto=format&fit=crop"
    });
    setIsLoading(false);
    if (res.success) {
      router.push(`/${lang}`);
    } else {
      alert(res.error);
    }
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        
        {/* Progress tracker */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`flex-1 h-2 rounded-full mx-1 ${step >= i ? 'bg-green-700' : 'bg-gray-200'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-bold text-gray-900">{lang === "ar" ? "اختر القسم" : "Select Category"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {categories.map(cat => (
                <div 
                  key={cat.id} 
                  onClick={() => { setSelectedCat(cat); handleNext(); }}
                  className="border border-gray-200 rounded-xl p-6 cursor-pointer hover:border-green-700 hover:bg-green-50 hover:shadow-md transition-all text-center flex flex-col items-center justify-center gap-2"
                >
                  <p className="font-bold text-gray-900">{lang === "ar" ? cat.name_ar : cat.name_en}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && selectedCat && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-bold text-gray-900">{lang === "ar" ? "التفاصيل الإضافية" : "Additional Details"}</h2>
            <div className="space-y-4">
              {(selectedCat.schema as any[]).map((field: any) => (
                field.type === "select" ? (
                  <SelectField
                    key={field.name}
                    label={field.label}
                    options={field.options.map((o: string) => ({ value: o, label: o }))}
                    value={dynamicValues[field.name] || ""}
                    onChange={e => setDynamicValues({...dynamicValues, [field.name]: e.target.value})}
                    required={field.required}
                  />
                ) : (
                  <InputField
                    key={field.name}
                    label={field.label}
                    type={field.type}
                    value={dynamicValues[field.name] || ""}
                    onChange={e => setDynamicValues({...dynamicValues, [field.name]: e.target.value})}
                    required={field.required}
                  />
                )
              ))}
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handlePrev} className="flex-1">{lang === "ar" ? "السابق" : "Back"}</Button>
              <Button variant="primary" onClick={handleNext} className="flex-1">{lang === "ar" ? "التالي" : "Next"}</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-bold text-gray-900">{lang === "ar" ? "الصور المرفقة" : "Media Upload"}</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <UploadCloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-700 font-medium mb-2">{lang === "ar" ? "اضغط لاختيار صورة (محاكاة)" : "Click to select image (mock)"}</p>
              <p className="text-sm text-gray-400">Max 10MB (Client-side validated)</p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handlePrev} className="flex-1">{lang === "ar" ? "السابق" : "Back"}</Button>
              <Button variant="primary" onClick={() => {
                setImageUrl("https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1000&auto=format&fit=crop");
                handleNext();
              }} className="flex-1">{lang === "ar" ? "التالي" : "Next"}</Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-bold text-gray-900">{lang === "ar" ? "التفاصيل الأساسية" : "Basic Details"}</h2>
            <div className="space-y-4">
              <InputField label={lang === "ar" ? "عنوان الإعلان" : "Title"} value={details.title} onChange={e => setDetails({...details, title: e.target.value})} required />
              <InputField label={lang === "ar" ? "السعر (اتركه فارغاً إذا كان على السوم)" : "Price"} type="number" value={details.price} onChange={e => setDetails({...details, price: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <InputField label={lang === "ar" ? "المنطقة" : "Region"} value={details.region} onChange={e => setDetails({...details, region: e.target.value})} required />
                <InputField label={lang === "ar" ? "المدينة" : "City"} value={details.city} onChange={e => setDetails({...details, city: e.target.value})} required />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handlePrev} disabled={isLoading} className="flex-1">{lang === "ar" ? "السابق" : "Back"}</Button>
              <Button variant="primary" onClick={handleSubmit} isLoading={isLoading} className="flex-1">{lang === "ar" ? "نشر الإعلان" : "Publish Listing"}</Button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
