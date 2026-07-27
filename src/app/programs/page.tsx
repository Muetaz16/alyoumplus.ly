import Link from "next/link";
import { getAllPrograms } from "@/lib/data";
import { SectionHeader } from "@/components/home/section-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "البرامج",
  description: "برامج ليبيا بلس المتنوعة",
};

export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  const programs = await getAllPrograms();

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <SectionHeader title="البرامج" subtitle="محتوى منظم حسب الاهتمام" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Link
              key={program.id}
              href={`/channel/${program.channel.slug}/program/${program.slug}`}
              className="block p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:border-[#C1121F]/20 transition-all group"
            >
              <span className="text-xs font-bold text-[#C1121F]">{program.channel.name}</span>
              <h3 className="mt-2 text-xl font-black text-[#111827] group-hover:text-[#C1121F] transition-colors">
                {program.name}
              </h3>
              {program.description && (
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{program.description}</p>
              )}
              <p className="mt-4 text-xs text-gray-400">{program._count.videos} حلقة</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
