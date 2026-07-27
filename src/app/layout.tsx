import type { Metadata } from "next";
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: "ليبيا بلس | Libya Plus - منصة إعلامية ليبية",
    template: "%s | ليبيا بلس",
  },
  description:
    "ليبيا بلس - منصة إعلامية عربية احترافية للأخبار والفيديو والبث المباشر. شاهد أحدث المحتوى من ليبيا والعالم.",
  keywords: ["ليبيا بلس", "أخبار ليبيا", "بث مباشر", "فيديو", "إعلام"],
  openGraph: {
    type: "website",
    locale: "ar_LY",
    siteName: "ليبيا بلس",
    title: "ليبيا بلس | Libya Plus",
    description: "منصة إعلامية ليبية للفيديو والبث المباشر",
  },
  twitter: {
    card: "summary_large_image",
    title: "ليبيا بلس",
    description: "منصة إعلامية ليبية احترافية",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} ${ibmPlex.variable} antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster position="top-center" richColors dir="rtl" />
      </body>
    </html>
  );
}
