import type { Metadata, Viewport } from "next";
import { Cairo, Inter } from "next/font/google";
import "@/app/globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { OfflineBanner } from "@/components/common/OfflineBanner";
import { getSession } from "@/lib/auth";
import { cn } from "@/utils/cn";

const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: "#15803d",
};

export const metadata: Metadata = {
  title: "منصة ريف | Reef Platform",
  description: "المنصة الأولى المخصصة لقطاع الزراعة، الثروة الحيوانية، والمعدات الريفية",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Reef",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const session = await getSession();
  const isAuthenticated = !!session?.userId;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const fontClass = lang === "ar" ? cairo.className : inter.className;

  return (
    <html lang={lang} dir={dir}>
      <body className={cn(fontClass, "bg-gray-50 text-gray-900 antialiased")}>
        <div className="flex flex-col min-h-screen">
          <OfflineBanner />
          <Navbar isAuthenticated={isAuthenticated} />
          <main className="flex-1 container mx-auto px-4 py-8 pb-24 md:pb-8">
            {children}
          </main>
          <Footer />
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
