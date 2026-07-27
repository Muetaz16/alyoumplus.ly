"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, Clock } from "lucide-react";
import { formatNumber, formatDuration, formatDateAr } from "@/lib/utils";

interface VideoCardProps {
  video: {
    slug: string;
    title: string;
    thumbnail: string | null;
    duration: number | null;
    views: number;
    createdAt: Date;
    channel?: { name: string; slug: string } | null;
  };
  index?: number;
}

const defaultThumb =
  "https://images.unsplash.com/photo-1611162617474-5b21e939e966?w=640&h=360&fit=crop";

export function VideoCard({ video, index = 0 }: VideoCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/videos/${video.slug}`} className="block">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100 shadow-md group-hover:shadow-xl transition-shadow">
          <Image
            src={video.thumbnail || defaultThumb}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {video.duration && (
            <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-black/80 px-2 py-1 text-xs font-bold text-white">
              <Clock className="h-3 w-3" />
              {formatDuration(video.duration)}
            </span>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="font-bold text-[#111827] line-clamp-2 group-hover:text-[#C1121F] transition-colors leading-snug">
            {video.title}
          </h3>
          {video.channel && (
            <p className="text-sm text-[#C1121F] font-medium">{video.channel.name}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {formatNumber(video.views)} مشاهدة
            </span>
            <span>{formatDateAr(video.createdAt)}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
