import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";

const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
});

const inter = Inter({
  variable: "--font-english",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reef Platform | منصة ريف",
  description: "Customer-to-Customer (C2C) rural marketplace",
};

export async function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const dir = lang === "ar" ? "rtl" : "ltr";
  
  return (
    <html
      lang={lang}
      dir={dir}
      className={`${cairo.variable} ${inter.variable} h-full antialiased`}
    >
      <body className={`min-h-full flex flex-col font-${lang === 'ar' ? 'arabic' : 'sans'}`}>
        <Navbar />
        <main className="flex-1 flex flex-col pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
