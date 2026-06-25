"use client";

import { useEffect, useState } from "react";
import styles from "@/app/live/page.module.css";

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

interface LivePlayerProps {
  initialLiveStream: Video | null;
}

export default function LivePlayer({ initialLiveStream }: LivePlayerProps) {
  const [liveStream] = useState<Video | null>(initialLiveStream);
  const [viewerCount, setViewerCount] = useState(1420);

  // 1. Simulate fluctuating viewer count
  useEffect(() => {
    const viewerInterval = setInterval(() => {
      setViewerCount((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4; // Fluctuate slightly
        return Math.max(1200, prev + delta);
      });
    }, 4000);

    return () => clearInterval(viewerInterval);
  }, []);

  if (!liveStream) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: "center", padding: "80px 20px" }} className="glass-card">
          <span style={{ fontSize: "3rem" }}>📡</span>
          <h2 style={{ marginTop: "20px" }}>لا يوجد بث مباشر مفعل حالياً</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "10px" }}>
            يرجى تفعيل البث المباشر ووسم البث كـ "مميز" في لوحة التحكم لبدء البث!
          </p>
        </div>
      </div>
    );
  }

  // Extract YouTube Video ID from full YouTube URL or format Google Drive links to avoid embedding issues
  const getEmbedUrl = (url: string) => {
    if (!url) return "";

    // Handle Google Drive
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }

    if (url.includes("embed/")) {
      return url;
    }
    // Extract ID from watch?v=
    const watchMatch = url.match(/[?&]v=([^&#]+)/);
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }
    // Extract ID from youtu.be/
    const shortMatch = url.match(/youtu\.be\/([^&#?]+)/);
    if (shortMatch && shortMatch[1]) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(liveStream.url);

  return (
    <div className={styles.container}>
      {/* Page Title Area */}
      <div className={styles.titleArea}>
        <h1 className={styles.liveTitle}>
          <span className="liveDot"></span>
          {liveStream.title}
        </h1>
        <div className={styles.liveCount}>
          <span>🔴</span>
          <span>{viewerCount.toLocaleString()} يشاهدون الآن</span>
        </div>
      </div>

      {/* Broadcast Split Grid */}
      <div className={styles.broadcastGrid}>
        {/* Cinema Video Player Container */}
        <div className={styles.playerWrapper}>
          <iframe
            src={`${embedUrl}?autoplay=1&mute=0&rel=0`}
            title={liveStream.title}
            className={styles.iframeElement}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>

      {/* Info Section */}
      <div className={styles.infoBox}>
        <span className={styles.infoLabel}>تفاصيل البث والمحتوى</span>
        <p className={styles.infoDescription}>
          {liveStream.description || "شاهد البث المباشر لقناة ليبيا بلس الرقمية بجودة عالية. تغطية إخبارية ممتازة وتواصل دائم ومباشر على مدار الساعة لآخر الفعاليات الثقافية والفنية والسياسية في ليبيا."}
        </p>
      </div>
    </div>
  );
}
