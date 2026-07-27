import {
  getFeaturedVideo,
  getLatestVideos,
  getPopularVideos,
  getActiveLiveStream,
  getAllChannels,
} from "@/lib/data";
import { HeroSection } from "@/components/home/hero-section";
import { LiveSection } from "@/components/home/live-section";
import { SectionHeader } from "@/components/home/section-header";
import { VideoCard } from "@/components/video/video-card";
import { ChannelCard } from "@/components/channel/channel-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, latest, popular, live, channels] = await Promise.all([
    getFeaturedVideo(),
    getLatestVideos(8),
    getPopularVideos(8),
    getActiveLiveStream(),
    getAllChannels(),
  ]);

  const heroVideo = featured ?? latest[0] ?? null;

  return (
    <>
      <HeroSection video={heroVideo} />
      <LiveSection stream={live} />

      <section className="py-16 bg-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="أحدث الفيديوهات"
            subtitle="تابع آخر المحتوى المنشور"
            href="/videos"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latest.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="الأكثر مشاهدة"
            subtitle="المحتوى الأكثر شعبية"
            href="/videos"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popular.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="قنوات ليبيا بلس"
            subtitle="استكشف محتوانا المتنوع"
            href="/channels"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map((channel, i) => (
              <ChannelCard key={channel.id} channel={channel} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
