import React from "react";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { MapPin, ShieldCheck, Phone } from "lucide-react";
import { Button } from "@/components/common/Button";
import { notFound } from "next/navigation";

export default async function ListingDetailsPage({ params }: { params: Promise<{ id: string, lang: string }> }) {
  const { id, lang } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      user: true,
      category: true,
      media: true
    }
  });

  if (!listing) notFound();

  const imageUrl = listing.media[0]?.url || "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1000&auto=format&fit=crop";
  const dynamicAttrs = listing.attributes as Record<string, any>;

  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left/Right Column: Image & Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="relative aspect-video w-full bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <Image src={imageUrl} alt={listing.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 66vw" priority />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{listing.title}</h1>
              <p className="text-xl md:text-2xl font-bold text-green-700 whitespace-nowrap">
                {listing.price !== null ? (lang === "ar" ? `${listing.price} ريال` : `${listing.price} SAR`) : (lang === "ar" ? "على السوم" : "Negotiable")}
              </p>
            </div>
            
            <div className="flex items-center text-gray-500 gap-2">
              <MapPin className="h-5 w-5" />
              <span>{listing.city}, {listing.region}</span>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h2 className="text-lg font-bold mb-2">{lang === "ar" ? "الوصف" : "Description"}</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
            </div>

            {dynamicAttrs && Object.keys(dynamicAttrs).length > 0 && (
              <div className="pt-4">
                <h2 className="text-lg font-bold mb-3">{lang === "ar" ? "المواصفات" : "Specifications"}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Object.entries(dynamicAttrs).map(([k, v]) => (
                    <div key={k} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <span className="text-sm text-gray-500 block mb-1">{k}</span>
                      <span className="font-medium text-gray-900">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Seller Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold mb-4">{lang === "ar" ? "معلومات البائع" : "Seller Info"}</h2>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center shrink-0 font-bold text-xl">
                {(listing as any).user.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-900 flex items-center gap-1">
                  {(listing as any).user.name}
                  {(listing as any).user.is_verified && <ShieldCheck className="h-4 w-4 text-green-600" />}
                </p>
                <p className="text-sm text-gray-500">{lang === "ar" ? "عضو منذ" : "Member since"} {new Date((listing as any).user.created_at).getFullYear()}</p>
              </div>
            </div>

            <a href={`https://wa.me/${(listing as any).user.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="w-full gap-2 text-lg h-14 bg-[#25D366] hover:bg-[#128C7E] focus-visible:ring-[#25D366] border-none">
                <Phone className="h-5 w-5" />
                {lang === "ar" ? "تواصل واتساب" : "Contact via WhatsApp"}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
