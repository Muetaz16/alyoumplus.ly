import Link from "next/link";
import Image from "next/image";
import { getAllLiveStreams } from "@/lib/data";
import { SectionHeader } from "@/components/home/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Radio } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "البث المباشر",
  description: "شاهد البث المباشر على ليبيا بلس",
};

export const dynamic = "force-dynamic";

export default async function LivePage() {
  const streams = await getAllLiveStreams();

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <SectionHeader title="البث المباشر" subtitle="تابع أحداث ليبيا لحظة بلحظة" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {streams.map((stream) => (
            <article
              key={stream.id}
              className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-shadow"
            >
              <div className="relative aspect-video">
                <Image
                  src={
                    stream.thumbnail ||
                    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=450&fit=crop"
                  }
                  alt={stream.title}
                  fill
                  className="object-cover"
                />
                {stream.isActive && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="live">
                      <Radio className="h-3 w-3" />
                      مباشر
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2">{stream.title}</h3>
                {stream.channel && (
                  <p className="text-sm text-[#C1121F] mb-3">{stream.channel.name}</p>
                )}
                <Button asChild size="sm">
                  <Link href={`/live/${stream.slug}`}>
                    <Play className="h-4 w-4 fill-current" />
                    مشاهدة
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
        {streams.length === 0 && (
          <p className="text-center text-gray-500 py-20">لا يوجد بث مباشر حالياً</p>
        )}
      </div>
    </div>
  );
}
