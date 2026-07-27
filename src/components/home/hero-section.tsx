"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";

interface HeroSectionProps {
  video: {
    slug: string;
    title: string;
    description: string | null;
    thumbnail: string | null;
    views: number;
    channel?: { name: string } | null;
  } | null;
}

const defaultHero =
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1920&h=1080&fit=crop";

export function HeroSection({ video }: HeroSectionProps) {
  if (!video) {
    return (
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center bg-gradient-to-br from-[#780000] to-[#C1121F]">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-black mb-4">ليبيا بلس</h1>
          <p className="text-xl opacity-90">منصتك الإعلامية الأولى</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[75vh] min-h-[560px] overflow-hidden">
      <Image
        src={video.thumbnail || defaultHero}
        alt={video.title}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-l from-[#C1121F]/30 to-transparent" />

      <div className="relative container mx-auto px-4 h-full flex items-end pb-16 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          {video.channel && (
            <span className="inline-block mb-3 px-3 py-1 rounded-full bg-[#C1121F] text-white text-sm font-bold">
              {video.channel.name}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            {video.title}
          </h1>
          {video.description && (
            <p className="text-lg text-gray-200 mb-6 line-clamp-2 max-w-2xl">
              {video.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="gap-2 text-base">
              <Link href={`/videos/${video.slug}`}>
                <Play className="h-5 w-5 fill-current" />
                مشاهدة الآن
              </Link>
            </Button>
            <span className="flex items-center gap-2 text-white/80 text-sm">
              <Eye className="h-4 w-4" />
              {formatNumber(video.views)} مشاهدة
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
