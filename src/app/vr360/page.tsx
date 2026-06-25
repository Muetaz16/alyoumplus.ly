"use client";

import { useEffect, useState } from "react";
import db from "@/lib/db";
import YouTubeGrid from "@/components/YouTubeGrid";
import styles from "./page.module.css";

interface Category {
  name: string;
  slug: string;
}

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
  createdAt: Date | string;
  category?: Category | null;
}

export default function VR360Page() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const results = await db.video.findMany({
          where: {
            type: "VR360",
          },
          include: {
            category: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        // Convert Date objects or format timestamps to ISO strings securely
        const serialized = results.map((video: any) => ({
          ...video,
          createdAt: typeof video.createdAt === "object" && video.createdAt?.toISOString
            ? video.createdAt.toISOString()
            : String(video.createdAt),
        }));

        setVideos(serialized);
      } catch (err) {
        console.error("Error loading VR 360 videos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "75vh" }}>
        <span style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>جاري تحميل فيديوهات 360 درجة...</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.heroHeader}>
        <div className={styles.headerContent}>
          <span className={styles.badgeVR}>تفاعلي 360°</span>
          <h1 className={styles.title}>
            <span className={styles.globeIcon}>🌐</span>
            فيديوهات 360 درجة (الواقع الافتراضي)
          </h1>
          <p className={styles.description}>

          </p>
        </div>
      </header>

      <YouTubeGrid initialVideos={videos} />
    </div>
  );
}
