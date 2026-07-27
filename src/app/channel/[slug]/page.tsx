import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getChannelBySlug } from "@/lib/data";
import { VideoCard } from "@/components/video/video-card";
import { SectionHeader } from "@/components/home/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Radio } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const channel = await getChannelBySlug(slug);
  if (!channel) return { title: "قناة غير موجودة" };
  return {
    title: channel.name,
    description: channel.description ?? undefined,
    openGraph: {
      title: channel.name,
      images: channel.coverImage ? [{ url: channel.coverImage }] : [],
    },
  };
}

export default async function ChannelPage({ params }: Props) {
  const { slug } = await params;
  const channel = await getChannelBySlug(slug);
  if (!channel) notFound();

  const activeLive = channel.liveStreams[0];

  return (
    <div>
      <div className="relative h-64 md:h-80">
        <Image
          src={
            channel.coverImage ||
            "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&h=600&fit=crop"
          }
          alt={channel.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 container mx-auto px-4 pb-8 flex items-end gap-6">
          <div className="relative h-24 w-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl shrink-0 bg-white">
            {channel.logo ? (
              <Image src={channel.logo} alt={channel.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#C1121F] text-white text-3xl font-black">
                {channel.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl font-black">{channel.name}</h1>
            {channel.description && (
              <p className="mt-2 text-white/80 max-w-2xl">{channel.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {activeLive && (
          <section className="rounded-2xl border-2 border-[#C1121F] p-6 bg-red-50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Badge variant="live">
                  <Radio className="h-3 w-3" />
                  مباشر الآن
                </Badge>
                <h2 className="text-xl font-bold">{activeLive.title}</h2>
              </div>
              <Button asChild>
                <Link href={`/live/${activeLive.slug}`}>
                  <Play className="h-4 w-4 fill-current" />
                  مشاهدة البث
                </Link>
              </Button>
            </div>
          </section>
        )}

        <section>
          <SectionHeader title="أحدث الفيديوهات" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {channel.videos.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} />
            ))}
          </div>
        </section>

        {channel.programs.length > 0 && (
          <section>
            <SectionHeader title="البرامج" href="/programs" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {channel.programs.map((program) => (
                <Link
                  key={program.id}
                  href={`/channel/${slug}/program/${program.slug}`}
                  className="block p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg hover:border-[#C1121F]/30 transition-all"
                >
                  <h3 className="font-bold text-lg text-[#111827] hover:text-[#C1121F]">
                    {program.name}
                  </h3>
                  {program.description && (
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                      {program.description}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-[#C1121F] font-semibold">
                    {program._count.videos} حلقة
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
