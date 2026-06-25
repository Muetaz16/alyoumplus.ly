"use client";

import { useEffect, useState } from "react";
import db from "@/lib/db";
import LivePlayer from "@/components/LivePlayer";

interface Video {
  id: number;
  title: string;
  description: string | null;
  type: string;
  url: string;
  thumbnail: string | null;
  views: number;
  likes: number;
  isFeatured: boolean;
  createdAt: any;
}

export default function LivePage() {
  const [liveStream, setLiveStream] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveStream() {
      try {
        const stream = await db.video.findFirst({
          where: {
            type: "LIVE",
            isFeatured: true,
          },
        });
        setLiveStream(stream);
      } catch (err) {
        console.error("Error fetching live stream on client:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveStream();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
        <span style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>جاري الاتصال بـ غرف البث المباشر...</span>
      </div>
    );
  }

  return <LivePlayer initialLiveStream={liveStream} />;
}
