import { notFound } from "next/navigation";
import Link from "next/link";
import { Eye, Calendar } from "lucide-react";
import { getVideoBySlug, getSuggestedVideos } from "@/lib/data";
import { VideoPlayer } from "@/components/video/video-player";
import { VideoCard } from "@/components/video/video-card";
import { ViewTracker } from "@/components/video/view-tracker";
import { ShareButton } from "@/components/video/share-button";
import { formatNumber, formatDateAr, parseVideoTags } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video || video.status !== "PUBLISHED") return { title: "فيديو غير موجود" };

  return {
    title: video.title,
    description: video.description ?? undefined,
    openGraph: {
      title: video.title,
      description: video.description ?? undefined,
      images: video.thumbnail ? [{ url: video.thumbnail }] : [],
      type: "video.other",
    },
  };
}

export default async function VideoPage({ params }: Props) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);

  if (!video || video.status !== "PUBLISHED") notFound();

  const suggested = await getSuggestedVideos(video.id, video.channelId);
  const pageUrl = `${process.env.NEXTAUTH_URL}/videos/${slug}`;
  const tags = parseVideoTags(video.tags);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnail,
    uploadDate: video.createdAt.toISOString(),
    contentUrl: video.videoUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewTracker slug={slug} />
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <VideoPlayer src={video.videoUrl} poster={video.thumbnail ?? undefined} />

              <div>
                <h1 className="text-2xl md:text-3xl font-black text-[#111827] mb-3">
                  {video.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  {video.channel && (
                    <Link
                      href={`/channel/${video.channel.slug}`}
                      className="font-bold text-[#C1121F] hover:underline"
                    >
                      {video.channel.name}
                    </Link>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {formatNumber(video.views)} مشاهدة
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDateAr(video.createdAt)}
                  </span>
                  <ShareButton url={pageUrl} title={video.title} />
                </div>
                {video.description && (
                  <p className="text-[#374151] leading-relaxed whitespace-pre-line">
                    {video.description}
                  </p>
                )}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-red-50 text-[#C1121F] text-xs font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <aside>
              <h2 className="text-lg font-bold mb-4 text-[#111827]">فيديوهات مقترحة</h2>
              <div className="space-y-4">
                {suggested.map((v, i) => (
                  <VideoCard key={v.id} video={v} index={i} />
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
