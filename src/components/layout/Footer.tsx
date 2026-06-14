import React from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="hidden md:block bg-gray-900 text-gray-300 pt-16 pb-8 border-t-4 border-green-700 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-white">منصة ريف</span>
            </div>
            <p className="text-gray-400 font-medium leading-relaxed">
              المنصة الأولى المخصصة لقطاع الزراعة، الثروة الحيوانية، والمعدات الريفية، نربط المزارع بالمشتري مباشرة.
            </p>
          </div>

          {/* Links Col 1 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-white mb-2">روابط سريعة</h3>
            <Link href="/ar" className="hover:text-green-400 font-medium transition-colors">الرئيسية</Link>
            <Link href="/ar/search" className="hover:text-green-400 font-medium transition-colors">تصفح الإعلانات</Link>
            <Link href="/ar/listings/create" className="hover:text-green-400 font-medium transition-colors">أضف إعلان</Link>
          </div>

          {/* Links Col 2 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-white mb-2">الدعم الفني</h3>
            <Link href="/ar/faq" className="hover:text-green-400 font-medium transition-colors">الأسئلة الشائعة</Link>
            <Link href="/ar/contact" className="hover:text-green-400 font-medium transition-colors">تواصل معنا</Link>
            <Link href="/ar/safety" className="hover:text-green-400 font-medium transition-colors">إرشادات الأمان</Link>
          </div>

          {/* Links Col 3 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-white mb-2">سياسات المنصة</h3>
            <Link href="/ar/terms" className="hover:text-green-400 font-medium transition-colors">شروط الاستخدام</Link>
            <Link href="/ar/privacy" className="hover:text-green-400 font-medium transition-colors">سياسة الخصوصية</Link>
          </div>

        </div>
        
        <div className="border-t border-gray-800 pt-8 flex items-center justify-center">
          <p className="text-sm font-medium">
            © {new Date().getFullYear()} منصة ريف (Reef Platform). جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
