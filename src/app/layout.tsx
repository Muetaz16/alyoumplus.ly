import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "اليوم plus | منصة البث المباشر والفيديوهات",
  description: "منصة إعلامية رائدة لمشاهدة فيديوهات الريلز القصيرة، البث المباشر الحصري، وآخر مستجدات المحتوى المرئي والمسموع بدقة عالية.",
  icons: {
    icon: "/logl.png",
    apple: "/logl.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="rtl">
      <body>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
