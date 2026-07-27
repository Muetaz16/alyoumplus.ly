import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اتصل بنا",
  description: "تواصل مع فريق ليبيا بلس",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
