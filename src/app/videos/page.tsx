import { getLatestVideos } from "@/lib/data";
import { SectionHeader } from "@/components/home/section-header";
import { VideoCard } from "@/components/video/video-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الفيديوهات",
  description: "تصفح جميع فيديوهات ليبيا بلس",
};

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  const videos = await getLatestVideos(24);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <SectionHeader title="جميع الفيديوهات" subtitle={`${videos.length} فيديو متاح`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} />
          ))}
        </div>
        {videos.length === 0 && (
          <p className="text-center text-gray-500 py-20">لا توجد فيديوهات حالياً</p>
        )}
      </div>
    </div>
  );
}
