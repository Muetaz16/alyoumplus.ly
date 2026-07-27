"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Radio, Users, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";

interface LiveSectionProps {
  stream: {
    slug: string;
    title: string;
    description: string | null;
    thumbnail: string | null;
    viewerCount: number;
    channel?: { name: string } | null;
  } | null;
}

export function LiveSection({ stream }: LiveSectionProps) {
  if (!stream) return null;

  return (
    <section className="py-16 bg-gradient-to-r from-[#780000] to-[#C1121F]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-center gap-8"
        >
          <div className="relative w-full lg:w-1/2 aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={
                stream.thumbnail ||
                "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=450&fit=crop"
              }
              alt={stream.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Play className="h-8 w-8 text-white fill-white" />
              </div>
            </div>
          </div>

          <div className="flex-1 text-white">
            <Badge variant="live" className="mb-4 gap-1">
              <Radio className="h-3 w-3" />
              مباشر الآن
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-3">{stream.title}</h2>
            {stream.description && (
              <p className="text-white/80 mb-4 text-lg">{stream.description}</p>
            )}
            {stream.channel && (
              <p className="text-white/70 mb-4">{stream.channel.name}</p>
            )}
            <div className="flex items-center gap-4 mb-6">
              <span className="flex items-center gap-2 text-white/90">
                <Users className="h-5 w-5" />
                {formatNumber(stream.viewerCount)} مشاهد
              </span>
            </div>
            <Button asChild variant="secondary" size="lg">
              <Link href={`/live/${stream.slug}`}>
                <Play className="h-5 w-5 fill-current text-[#C1121F]" />
                مشاهدة البث
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
