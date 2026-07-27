"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Play, Globe, Share2, Mail, Radio } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="bg-[#111827] text-gray-300 mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C1121F] text-white">
                <Play className="h-6 w-6 fill-current" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">ليبيا بلس</h3>
                <p className="text-xs text-gray-400">Libya Plus</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              منصة إعلامية ليبية رائدة تقدم الأخبار والبث المباشر والمحتوى المرئي بجودة عالمية.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "الرئيسية" },
                { href: "/videos", label: "الفيديوهات" },
                { href: "/channels", label: "القنوات" },
                { href: "/live", label: "البث المباشر" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-[#E5383B] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">المزيد</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/programs", label: "البرامج" },
                { href: "/about", label: "من نحن" },
                { href: "/contact", label: "اتصل بنا" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-[#E5383B] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">تابعنا</h4>
            <div className="flex gap-3">
              {[Globe, Share2, Mail, Radio].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 hover:bg-[#C1121F] transition-colors"
                  aria-label="social"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ليبيا بلس — جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}
