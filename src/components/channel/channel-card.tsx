"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface ChannelCardProps {
  channel: {
    slug: string;
    name: string;
    description: string | null;
    logo: string | null;
    coverImage: string | null;
    _count?: { videos: number };
  };
  index?: number;
}

const defaultCover =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop";

export function ChannelCard({ channel, index = 0 }: ChannelCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
    >
      <Link
        href={`/channel/${channel.slug}`}
        className="group block rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all"
      >
        <div className="relative h-36 overflow-hidden">
          <Image
            src={channel.coverImage || defaultCover}
            alt={channel.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 right-3 flex items-end gap-3">
            <div className="relative h-14 w-14 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-white">
              {channel.logo ? (
                <Image src={channel.logo} alt={channel.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#C1121F] text-white font-black text-lg">
                  {channel.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg text-[#111827] group-hover:text-[#C1121F] transition-colors">
            {channel.name}
          </h3>
          {channel.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{channel.description}</p>
          )}
          {channel._count && (
            <p className="mt-2 text-xs text-[#C1121F] font-semibold">
              {channel._count.videos} فيديو
            </p>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
