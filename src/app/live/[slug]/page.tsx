import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VideoPlayer } from "@/components/video/video-player";
import { Badge } from "@/components/ui/badge";
import { Radio } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const stream = await prisma.liveStream.findUnique({ where: { slug } });
  if (!stream) return { title: "بث غير موجود" };
  return { title: stream.title, description: stream.description ?? undefined };
}

export default async function LiveWatchPage({ params }: Props) {
  const { slug } = await params;
  const stream = await prisma.liveStream.findUnique({
    where: { slug },
    include: { channel: true },
  });

  if (!stream) notFound();

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {stream.isActive && (
          <Badge variant="live" className="mb-4 gap-1">
            <Radio className="h-3 w-3" />
            مباشر الآن
          </Badge>
        )}
        <VideoPlayer src={stream.streamUrl} poster={stream.thumbnail ?? undefined} autoplay />
        <h1 className="text-2xl md:text-3xl font-black mt-6 text-[#111827]">{stream.title}</h1>
        {stream.channel && (
          <p className="text-[#C1121F] font-semibold mt-2">{stream.channel.name}</p>
        )}
        {stream.description && (
          <p className="mt-4 text-[#374151] leading-relaxed">{stream.description}</p>
        )}
      </div>
    </div>
  );
}
