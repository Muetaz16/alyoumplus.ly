import { searchContent } from "@/lib/data";
import { VideoCard } from "@/components/video/video-card";
import { ChannelCard } from "@/components/channel/channel-card";
import { SectionHeader } from "@/components/home/section-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "البحث",
};

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q ?? "";
  const { videos, channels } = await searchContent(query);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <SectionHeader
          title={query ? `نتائج البحث: "${query}"` : "البحث"}
          subtitle={`${videos.length + channels.length} نتيجة`}
        />

        {channels.length > 0 && (
          <section className="mb-12">
            <h3 className="text-lg font-bold mb-4">القنوات</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {channels.map((c, i) => (
                <ChannelCard key={c.id} channel={c} index={i} />
              ))}
            </div>
          </section>
        )}

        {videos.length > 0 && (
          <section>
            <h3 className="text-lg font-bold mb-4">الفيديوهات</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.map((v, i) => (
                <VideoCard key={v.id} video={v} index={i} />
              ))}
            </div>
          </section>
        )}

        {query && videos.length === 0 && channels.length === 0 && (
          <p className="text-center text-gray-500 py-20">لا توجد نتائج لـ &quot;{query}&quot;</p>
        )}
      </div>
    </div>
  );
}
