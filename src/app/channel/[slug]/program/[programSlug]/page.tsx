import { notFound } from "next/navigation";
import { getProgramBySlug } from "@/lib/data";
import { VideoCard } from "@/components/video/video-card";
import { SectionHeader } from "@/components/home/section-header";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string; programSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, programSlug } = await params;
  const program = await getProgramBySlug(slug, programSlug);
  if (!program) return { title: "برنامج غير موجود" };
  return { title: `${program.name} - ${program.channel.name}` };
}

export default async function ProgramPage({ params }: Props) {
  const { slug, programSlug } = await params;
  const program = await getProgramBySlug(slug, programSlug);
  if (!program) notFound();

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <Link
          href={`/channel/${slug}`}
          className="text-sm text-[#C1121F] font-semibold hover:underline mb-4 inline-block"
        >
          ← {program.channel.name}
        </Link>
        <SectionHeader
          title={program.name}
          subtitle={program.description ?? `${program.videos.length} حلقة`}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {program.videos.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
