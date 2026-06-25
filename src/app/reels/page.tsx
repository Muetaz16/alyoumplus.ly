"use client";

import { useEffect, useState } from "react";
import db from "@/lib/db";
import ReelsList from "@/components/ReelsList";

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
  category?: { name: string; slug: string } | null;
}

export default function ReelsPage() {
  const [reels, setReels] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReels() {
      try {
        const results = await db.video.findMany({
          where: {
            type: "REEL",
          },
          include: {
            category: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        // Convert Date objects or format timestamps to ISO strings securely
        const serialized = results.map((reel: any) => ({
          ...reel,
          createdAt: typeof reel.createdAt === "object" && reel.createdAt?.toISOString
            ? reel.createdAt.toISOString()
            : String(reel.createdAt),
        }));

        // If an ID was passed in the URL, bring that specific reel to the top
        const params = new URLSearchParams(window.location.search);
        const targetId = params.get("id");
        if (targetId) {
          const idNum = parseInt(targetId, 10);
          const targetIndex = serialized.findIndex((r: any) => r.id === idNum);
          if (targetIndex > 0) {
            const targetReel = serialized.splice(targetIndex, 1)[0];
            serialized.unshift(targetReel);
          }
        }

        setReels(serialized);
      } catch (err) {
        console.error("Error loading reels on client:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReels();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "75vh" }}>
        <span style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>جاري تجميع فيديوهات ريلز الحية...</span>
      </div>
    );
  }

  return <ReelsList initialReels={reels} />;
}
