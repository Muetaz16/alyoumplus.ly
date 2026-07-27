import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkText?: string;
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkText = "عرض الكل",
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-[#111827]">{title}</h2>
        {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-bold text-[#C1121F] hover:text-[#780000] transition-colors"
        >
          {linkText}
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
