import React from "react";
import { PrismaClient } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { BadgeCheck, MapPin, Clock, MessageCircle, Share2, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { initiateChat } from "@/actions/chat";
import Image from "next/image";
import { getSession } from "@/lib/auth";

const prisma = new PrismaClient();

export default async function ListingDetailsPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const session = await getSession();

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          reviews_received: true
        }
      },
      category: true,
      media: {
        orderBy: { is_primary: 'desc' }
      }
    }
  });

  if (!listing) {
    notFound();
  }

  const isAr = lang === "ar";
  const dateLocale = isAr ? ar : enUS;

  // Calculate average rating
  const reviews = listing.user.reviews_received;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  // Render Dynamic Attributes cleanly based on schema
  const schema = listing.category.schema as any[];
  const attributes = listing.attributes as Record<string, any>;

  const dynamicSpecs = schema.map((field) => {
    const value = attributes[field.id];
    if (value === undefined || value === null || value === "") return null;
    return {
      label: isAr ? field.label_ar : field.label_en,
      value: String(value)
    };
  }).filter(Boolean);

  const whatsappMessage = isAr 
    ? `مرحباً، أنا مهتم بإعلانك: ${listing.title} على منصة ريف.`
    : `Hello, I'm interested in your listing: ${listing.title} on Reef.`;
    
  // Pre-fill WhatsApp Deep Link
  const whatsappUrl = `https://wa.me/${listing.user.phone}?text=${encodeURIComponent(whatsappMessage)}`;

  // Inline Server Action for Internal Chat
  const handleChat = async () => {
    "use server";
    await initiateChat(listing.id, listing.user.id, lang);
  };

  return (
    <div className="flex flex-col gap-6 pb-32">
      {/* Media Gallery */}
      <div className="w-full h-72 sm:h-96 md:h-[500px] relative bg-gray-200 rounded-3xl overflow-hidden shadow-sm flex snap-x snap-mandatory overflow-x-auto">
        {listing.media.length > 0 ? (
          listing.media.map((m, idx) => (
            <div key={m.id} className="w-full flex-shrink-0 snap-center relative">
              <Image 
                src={m.url} 
                alt={`${listing.title} - Image ${idx + 1}`} 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1024px"
              />
            </div>
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
            No Image Available
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* Header Section */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {listing.title}
            </h1>
            <div className="flex items-center gap-2 text-green-700 font-bold mt-2 text-xl">
              {listing.price ? (
                <>
                  <span>{listing.price}</span>
                  <span className="text-sm">{isAr ? "ر.س" : "SAR"}</span>
                </>
              ) : (
                <span>{isAr ? "السعر قابل للتفاوض" : "Negotiable"}</span>
              )}
            </div>
          </div>
          <button className="bg-gray-100 p-3 rounded-full text-gray-700 hover:bg-gray-200 transition-colors shrink-0 shadow-sm">
            <Share2 className="w-6 h-6" />
          </button>
        </div>

        {/* Meta Info Badges */}
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
          <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
            <MapPin className="w-4 h-4" />
            <span>{listing.city}, {listing.region}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
            <Clock className="w-4 h-4" />
            <span dir={isAr ? "rtl" : "ltr"}>
              {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true, locale: dateLocale })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-bold">
            <Tag className="w-4 h-4" />
            <span>{isAr ? listing.category.name_ar : listing.category.name_en}</span>
          </div>
        </div>

        {/* Seller Profile Banner */}
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 flex items-center gap-4 mt-2 shadow-sm">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl shrink-0">
            {listing.user.name.charAt(0)}
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900 text-lg">{listing.user.name}</span>
              {listing.user.verification_status === "VERIFIED" && (
                <BadgeCheck className="w-5 h-5 text-green-600" />
              )}
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-gray-500 text-sm font-medium">
                {isAr ? "عضو منذ" : "Member since"} {new Date(listing.user.created_at).getFullYear()}
              </span>
              {avgRating && (
                <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 rounded-md text-xs font-bold border border-yellow-200">
                  ★ {avgRating}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Specifications Grid */}
        {dynamicSpecs.length > 0 && (
          <div className="mt-4 bg-green-50 border border-green-100 rounded-2xl p-5 shadow-sm">
            <h3 className="text-lg font-bold text-green-900 mb-4">{isAr ? "المواصفات" : "Specifications"}</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              {dynamicSpecs.map((spec, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-sm font-bold text-gray-500 mb-1">{spec?.label}</span>
                  <span className="text-base font-bold text-gray-900">{spec?.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description Section */}
        <div className="mt-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-3">{isAr ? "التفاصيل" : "Description"}</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
            {listing.description}
          </p>
        </div>
      </div>

      {/* Sticky Dual Communication Action Bar */}
      <div className="fixed bottom-0 start-0 end-0 bg-white border-t-2 border-gray-100 p-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-40">
        <div className="container mx-auto flex gap-3 max-w-2xl">
          {session?.userId === listing.user.id ? (
            <div className="flex-1 bg-gray-100 text-gray-400 h-14 rounded-xl flex items-center justify-center font-bold text-lg cursor-not-allowed border-2 border-gray-200 border-dashed">
              {isAr ? "هذا إعلانك" : "This is your listing"}
            </div>
          ) : (
            <>
              {/* WhatsApp Primary Deep Link */}
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] text-white h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-lg hover:bg-[#20bd5a] transition-colors shadow-sm"
              >
                <MessageCircle className="w-6 h-6" />
                {isAr ? "واتساب" : "WhatsApp"}
              </a>

              {/* Internal Chat Form Action */}
              <form action={handleChat} className="flex-1">
                <button type="submit" className="w-full bg-gray-900 text-white h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-lg hover:bg-gray-800 transition-colors shadow-sm">
                  {isAr ? "مراسلة" : "Chat"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
